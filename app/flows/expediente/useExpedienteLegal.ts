"use client";

import { StorageCaso } from "./expediente.storage";
import { crearCaso, vincularCliente, enviarCorreoBoveda } from "./expediente.service";

/**
 * Hook Orquestador de la lógica de negocio legal.
 * Controla el flujo de creación, vinculación y cierre de expedientes.
 */
export function useExpedienteLegal(
  {
    seleccion,
    notificacion,
    setCargando,
    setCasoIdGenerado,
    navegarPaso,
    setNotificacion,
    casoIdGenerado
  }: any
) {

  /**
   * ACCIÓN 1: Registro Anónimo (Matchmaker Init)
   * Crea el caso en Sanity solo con Rama y Ubicación para que los abogados lo vean.
   */
  const iniciarProcesoLegal = async () => {
    // Validación de entrada mínima
    if (!seleccion.descripcion && !seleccion.audioUrl) {
      return alert("Por favor, describe tu situación.");
    }

    // Prevención de duplicados (Matchmaker Lock)
    const casoActivo = StorageCaso.getCasoActivo();
    if (casoActivo &&
        casoActivo.categoria === seleccion.categoria &&
        casoActivo.ubicacion === seleccion.ubicacion) {
      return alert(`Ya tienes una consulta activa para ${seleccion.categoria}. Revisa la campana dorada.`);
    }

    setCargando(true);

    try {
      const res = await crearCaso(seleccion);

      if (res?.success && res.casoId) {
        // Persistencia local para el polling
        StorageCaso.setCasoId(res.casoId);
        StorageCaso.setCasoActivo({
          categoria: seleccion.categoria,
          ubicacion: seleccion.ubicacion
        });

        setCasoIdGenerado(res.casoId);

        // Transición visual al estado de "Vigilando tu caso"
        setTimeout(() => {
          setCargando(false);
          navegarPaso(5);
        }, 300);
      } else {
        setCargando(false);
      }

    } catch (e) {
      console.error("Error en el proceso de registro anónimo:", e);
      setCargando(false);
    }
  };

  /**
   * ACCIÓN 2: Registro Oficial (Bóveda Blindada)
   * Vincula la identidad del cliente, envía email y limpia la sesión temporal.
   */
  const finalizarRegistroOficial = async () => {
    // Recuperación de ID por si se recargó la página
    let casoId = casoIdGenerado || StorageCaso.getCasoId();
    if (!casoId) return alert("Error: No se detectó un ID de expediente activo.");

    const emailNormalizado = seleccion.email.trim().toLowerCase();
    const nombreLimpio = seleccion.nombre.trim();
    if (!nombreLimpio || !emailNormalizado) {
      return alert("Por favor, complete su nombre y correo.");
    }

    setCargando(true);

    try {
      // 1. Vinculación en Base de Datos (Sanity)
      const link = await vincularCliente(casoId, { 
        ...seleccion, 
        email: emailNormalizado,
        nombre: nombreLimpio 
      });

      if (!link.success) {
        throw new Error("Sanity no pudo vincular al cliente.");
      }

      // CORRECCIÓN PARA RECURRENTE: Usamos el código que devuelve Sanity (ej. TASF-008)
      const codigoReal = link.codigoPremium || notificacion.codigoExpediente;

      // 2. Notificación Oficial (Resend / API Send)
      const resp = await enviarCorreoBoveda({
        email: emailNormalizado,
        nombre: nombreLimpio,
        casoId,
        codigoExpediente: codigoReal
      });

      if (!resp.ok) {
        console.error("❌ ERROR /api/send:", resp.data.error || "Desconocido");
      }

      // BLINDAJE DE IDENTIDAD PARA LA BÓVEDA: Evita cargar casos viejos
      sessionStorage.setItem("asf_id", casoId); 
      sessionStorage.setItem("asf_email", emailNormalizado);

      // 3. Limpieza de Seguridad
      StorageCaso.setEmail(emailNormalizado);
      StorageCaso.clearCaso();
      
      // Reseteo de estados de notificación para el siguiente proceso
      setNotificacion({ activa: false, respuesta: null, monto: null, codigoExpediente: null });
      
      // Salto final al éxito del expediente
      navegarPaso(6);

    } catch (error: any) {
      console.error("Error en finalizarRegistroOficial:", error);
      alert(`Error en el proceso: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return { iniciarProcesoLegal, finalizarRegistroOficial };
}