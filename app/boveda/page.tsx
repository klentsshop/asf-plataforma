"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { validarAccesoBoveda } from "../../sanity/lib/actions";
import { client } from "../../sanity/lib/client";

// CORRECCIÓN CRÍTICA DE RUTAS
import { BovedaLogin as BovedaAccessForm } from "../../components/cliente/BovedaLogin";
import { BovedaNavbar } from "../../components/cliente/BovedaNavbar";
import { BovedaStatusBar } from "../../components/cliente/BovedaStatusBar";
import { BovedaLegal } from "../../components/cliente/BovedaLegal";
import { BovedaRepositorio } from "../../components/cliente/BovedaRepositorio";
import { BovedaHistorial } from "../../components/cliente/BovedaHistorial";
import { BovedaUpload } from "../../components/cliente/BovedaUpload";
import { BovedaFooter } from "../../components/cliente/BovedaFooter";

export default function BovedaPage() {
  const router = useRouter();

  const [acceso, setAcceso] = useState(false);
  const [cargando, setCargando] = useState(true); // Iniciamos en true para la verificación de sesión
  const [subiendoArchivo, setSubiendoArchivo] = useState(false);
  const [credenciales, setCredenciales] = useState({ email: "", casoId: "" });
  const [datosCaso, setDatosCaso] = useState<any>(null);

  // 0. PERSISTENCIA + AUTO-REFRESCO SILENCIOSO (Cada 30 seg)
  useEffect(() => {
    const storageId = sessionStorage.getItem("asf_id");
    const storageEmail = sessionStorage.getItem("asf_email");

    const checkSesionYRefrescar = async (isSilent = false) => {
      if (storageId && storageEmail) {
        try {
          const res = await validarAccesoBoveda(storageEmail, storageId);
          if (res.success) {
            setDatosCaso(res.datos);
            setAcceso(true);
          }
        } catch (error) {
          console.error("Error en sincronización silenciosa:", error);
        }
      }
      if (!isSilent) setCargando(false);
    };

    // Ejecución inicial (con loader si es primera vez)
    checkSesionYRefrescar();

    // Sincronización automática cada 30 segundos
    const refrescoIntervalo = setInterval(() => {
      checkSesionYRefrescar(true);
    }, 30000);

    return () => clearInterval(refrescoIntervalo);
  }, []);

  // 1. VALIDACIÓN DE ACCESO + CAMPANA
  const validarAcceso = async () => {
    if (!credenciales.email || !credenciales.casoId) {
      return alert("Por favor, ingrese su correo y el ID del expediente enviado a su email.");
    }

    setCargando(true);
    try {
      const res = await validarAccesoBoveda(credenciales.email, credenciales.casoId);
      if (res.success) {
        // GUARDAR SESIÓN PARA F5
        sessionStorage.setItem("asf_id", credenciales.casoId);
        sessionStorage.setItem("asf_email", credenciales.email);

        setDatosCaso(res.datos);
        setAcceso(true);

        if (res.datos.notificacionPendiente) {
          await client.patch(res.datos._id).set({ notificacionPendiente: false }).commit();
        }
      } else {
        alert("Acceso denegado: Credenciales inválidas. Verifique el ID en su correo.");
      }
    } catch (_e) {
      alert("Error de conexión con el servidor legal.");
    } finally {
      setCargando(false);
    }
  };

  // 2. SUBIR COMPROBANTE DE PAGO
  const subirComprobante = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubiendoArchivo(true);
    try {
      const asset = await client.assets.upload('image', file);
      await client
        .patch(datosCaso._id)
        .set({
          comprobantePago: {
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id }
          },
          estado: 'respondido'
        })
        .commit();

      alert("Comprobante enviado. ASF validará su pago en breve.");
      const refresh = await client.fetch(`*[_type == "caso" && _id == $id][0]{
        ...,
        "documentosPrueba": documentosPrueba[]{ ..., "url": asset->url }
      }`, { id: datosCaso._id });
      setDatosCaso(refresh);
    } catch (_e) {
      alert("Error al subir el comprobante.");
    } finally {
      setSubiendoArchivo(false);
    }
  };

  // 7. ENVIAR MENSAJE DEL CLIENTE AL ABOGADO (CAMPO: mensajeCliente)
  const enviarMensajeAlAbogado = async (mensajeTexto: string) => {
    if (!datosCaso) return;

    setSubiendoArchivo(true);
    try {
      await client
        .patch(datosCaso._id)
        .set({ mensajeCliente: mensajeTexto }) 
        .commit();

      alert("Mensaje enviado con éxito al Departamento Legal.");
      
      const refresh = await client.fetch(`*[_type == "caso" && _id == $id][0]{
        ...,
        "documentosPrueba": documentosPrueba[]{ ..., "url": asset->url }
      }`, { id: datosCaso._id });
      setDatosCaso(refresh);
    } catch (error) {
      alert("Error al enviar el mensaje.");
    } finally {
      setSubiendoArchivo(false);
    }
  };
 
  // 8. ENVIAR RESEÑA FINAL (ESTRELLAS + COMENTARIO)
  const enviarResenaFinal = async (resena: { rating: number; resenaTexto: string }) => {
    if (!datosCaso) return;

    setSubiendoArchivo(true);
    try {
      await client
        .patch(datosCaso._id)
        .set({ 
          rating: resena.rating,
          resenaTexto: resena.resenaTexto 
        })
        .commit();

      alert("¡Gracias! Su reseña ha sido publicada en el portal oficial de ASF.");
      
      const refresh = await client.fetch(`*[_type == "caso" && _id == $id][0]{
        ...,
        "documentosPrueba": documentosPrueba[]{ ..., "url": asset->url }
      }`, { id: datosCaso._id });
      setDatosCaso(refresh);
    } catch (error) {
      alert("Error al publicar la reseña.");
    } finally {
      setSubiendoArchivo(false);
    }
  };

  // 3. SUBIR DOCUMENTOS DE PRUEBA
  const manejarCargaArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !datosCaso) return;

    setSubiendoArchivo(true);
    try {
      const asset = await client.assets.upload('file', file, { filename: file.name });

      await client
        .patch(datosCaso._id)
        .setIfMissing({ documentosPrueba: [] })
        .append('documentosPrueba', [{
          _key: Math.random().toString(36).substring(2, 9),
          _type: 'file',
          asset: { _type: 'reference', _ref: asset._id },
          nombreOriginal: file.name,
          fechaCarga: new Date().toISOString()
        }])
        .commit();

      alert("Documento cargado exitosamente.");

      const dataActualizada = await client.fetch(`
        *[_type == "caso" && _id == $id][0]{
          ...,
          "documentosPrueba": documentosPrueba[]{
            ...,
            "url": asset->url
          }
        }
      `, { id: datosCaso._id });

      setDatosCaso(dataActualizada);
    } catch (_e) {
      alert("Error al subir el documento.");
    } finally {
      setSubiendoArchivo(false);
    }
  };

  // Pantalla de carga inicial (Estética ASF)
  if (cargando && !acceso) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-[#D4AF37]"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#D4AF37] font-black text-[10px] italic">ASF</div>
        </div>
        <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.5em] animate-pulse italic">Verificando Credenciales...</p>
      </div>
    );
  }

  // 4. NO AUTORIZADO (bloqueo inicial)
  if (!acceso) {
    return (
      <BovedaAccessForm
        credenciales={credenciales}
        setCredenciales={setCredenciales}
        validarAcceso={validarAcceso}
        cargando={cargando}
        router={router}
      />
    );
  }

  // 5. Lógica de pasos para StatusBar
  const pasos = ['analisis', 'respondido', 'gestion', 'concluido'];
  const indiceActual = pasos.indexOf(datosCaso?.estado || 'analisis');

  // 6. AUTORIZADO (vista bóveda)
  return (
    <main className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans selection:bg-[#D4AF37]">
      <BovedaNavbar datosCaso={datosCaso} />

      <div className="container mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <BovedaStatusBar indiceActual={indiceActual} />
          
          <BovedaLegal
            datosCaso={datosCaso}
            subiendoArchivo={subiendoArchivo}
            subirComprobante={subirComprobante}
            indiceActual={indiceActual}
            enviarMensajeAlAbogado={enviarMensajeAlAbogado}
            enviarResenaFinal={enviarResenaFinal} 
          />
        </div>

        <div className="space-y-8">
          <BovedaRepositorio datosCaso={datosCaso} />
          <BovedaUpload subiendoArchivo={subiendoArchivo} manejarCargaArchivo={manejarCargaArchivo} />
          <BovedaHistorial datosCaso={datosCaso} />
        </div>
      </div>

      <BovedaFooter />
    </main>
  );
}