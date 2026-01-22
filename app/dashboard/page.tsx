"use client";

import React, { useState, useEffect } from "react";
import { Scale, Users, Clock, FileText, Search, KeyRound, LogOut, Loader2 } from "lucide-react";
import { client } from "../../sanity/lib/client";

// Importación de la regla de seguridad para el blindaje de la plataforma
import { filterSensitiveInfo } from "../lib/utils/security";

// Componentes refactorizados (Rutas @ raíz)
import { Navbar } from "@/components/abogado/Navbar";
import { Sidebar } from "@/components/abogado/Sidebar";
import { Bandeja } from "@/components/abogado/Bandeja";
import { MisClientes } from "@/components/abogado/MisClientes";
import { Expedientes } from "@/components/abogado/Expedientes";
import { Gestionar } from "@/components/abogado/Gestionar";
import { SecuritySettings } from "@/components/SecuritySettings";

export default function AbogadoDashboard() {
  const [vista, setVista] = useState("bandeja");
  const [casos, setCasos] = useState<any[]>([]);
  const [clientesActivos, setClientesActivos] = useState<any[]>([]);
  const [expedientesConcluidos, setExpedientesConcluidos] = useState<any[]>([]);
  const [casoSeleccionado, setCasoSeleccionado] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [mensajeLegal, setMensajeLegal] = useState("");
  const [ofertaMonto, setOfertaMonto] = useState("");
  const [abogadoInfo, setAbogadoInfo] = useState({ id: "", nombre: "", especialidad: "", ubicacion: "" });

  // ---- 1. GESTIÓN DE SESIÓN ----
  useEffect(() => {
    const id = localStorage.getItem("asf_abogado_id");
    if (!id) {
      window.location.href = "/login-abogado";
      return;
    }

    const cargarPerfil = async () => {
      try {
        const perfil = await client.fetch(`*[_type == "abogado" && _id == $id][0]`, { id });
        if (perfil) {
          setAbogadoInfo({
            id: perfil._id,
            nombre: perfil.nombre,
            especialidad: perfil.especialidad,
            ubicacion: perfil.ubicacion
          });
        }
      } catch (error) {
        console.error("Error de sesión:", error);
      }
    };
    cargarPerfil();
  }, []);

  // ---- 2. CARGA DE DATOS (POLLING 20s) ----
  useEffect(() => {
    if (!abogadoInfo.id || !abogadoInfo.especialidad) return;

    const cargar = async () => {
      try {
        setCargando(true);
        if (vista === "bandeja") {
          const d = await client.fetch(
            `*[_type == "caso" && estado == "analisis" && categoria == $esp && ubicacion == $ub && !defined(respuestaAbogado)] | order(_createdAt desc)`,
            { esp: abogadoInfo.especialidad, ub: abogadoInfo.ubicacion }
          );
          setCasos(d);
        } else if (vista === "clientes") {
          const d = await client.fetch(
            `*[_type == "caso" && abogadoAsignado._ref == $id && estado == "gestion" && pagoValidado == true] | order(_updatedAt desc){
              ...,
              "nombreCliente": cliente->nombre,
              "emailCliente": cliente->email,
              "documentosPrueba": documentosPrueba[]{ ..., "url": asset->url }
            }`,
            { id: abogadoInfo.id }
          );
          setClientesActivos(d);
        } else if (vista === "expedientes") {
          const d = await client.fetch(
            `*[_type == "caso" && abogadoAsignado._ref == $id && estado == "concluido"] | order(_updatedAt desc){
              ...,
              "nombreCliente": cliente->nombre
            }`,
            { id: abogadoInfo.id }
          );
          setExpedientesConcluidos(d);
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
      } finally {
        setCargando(false);
      }
    };

    cargar();
    const timer = setInterval(cargar, 20000);
    return () => clearInterval(timer);
  }, [vista, abogadoInfo]);

  // ---- 3. FUNCIONES DE GESTIÓN ----
  const manejarGestionar = (s: any) => {
    setCasoSeleccionado(s);
    setVista("gestionar");
    setOfertaMonto(s.presupuestoEstimado || "");
  };

  const manejarCargaInstrumentoAbogado = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !casoSeleccionado) return;

    setCargando(true);
    try {
      const asset = await client.assets.upload("file", file, { filename: file.name });
      await client.patch(casoSeleccionado._id)
        .setIfMissing({ documentosBoveda: [] })
        .append("documentosBoveda", [{
          _key: Math.random().toString(36).substring(2, 9),
          _type: "file",
          asset: { _type: "reference", _ref: asset._id },
          nombreOriginal: file.name,
          fechaCarga: new Date().toISOString()
        }]).commit();

      alert("Instrumento Legal cargado con éxito.");
    } catch (error) {
      console.error("Error subiendo archivo:", error);
      alert("Error al subir el archivo.");
    } finally {
      setCargando(false);
    }
  };

  const enviarActualizacionYPrecio = async () => {
    if (!mensajeLegal) return alert("Falta el reporte técnico");
    
    // VALIDACIÓN DE SEGURIDAD (ANTI-CONTACTO EXTERNO)
    const { isSafe } = filterSensitiveInfo(mensajeLegal);
    if (!isSafe) {
      return alert("⚠️ REGLA DE SEGURIDAD: No se permiten teléfonos o correos en el muro de gestión.");
    }

    try {
      setCargando(true);
      const statusInstitucional = `Actualización ASF: ${mensajeLegal}`;
      
      await client.patch(casoSeleccionado._id)
        .set({
          respuestaAbogado: statusInstitucional,
          actualizacion: statusInstitucional,
          notificacionPendiente: true,
          presupuestoEstimado: ofertaMonto || casoSeleccionado.presupuestoEstimado
        })
        .commit();

      alert("Bóveda Sincronizada exitosamente.");
      setMensajeLegal("");
      setVista("clientes");
    } catch (error) {
      console.error("Error sincronizando Sanity:", error);
      alert("Error crítico al sincronizar con la Bóveda.");
    } finally {
      setCargando(false);
    }
  };
  const concluirCasoLegal = async () => {
    // La doble confirmación ya la hace el componente hijo, 
    // pero dejamos esta por seguridad si se llegara a disparar desde aquí
    if (!confirm("¿Está seguro de marcar este caso como CONCLUIDO? Esto habilitará la encuesta de satisfacción para el cliente.")) return;

    setCargando(true);
    try {
      const res = await client
        .patch(casoSeleccionado._id)
        .set({ estado: 'concluido' }) 
        .commit();

      // ESTA ES LA LÍNEA CLAVE: Actualiza la UI del abogado al instante
      setCasoSeleccionado(res); 

      alert("⚖️ Expediente finalizado exitosamente.");
      
      // Opcional: Después del éxito, lo mandamos a ver sus casos concluidos
      setVista("expedientes");
      
    } catch (error) {
      console.error("Error al concluir:", error);
      alert("Error al cerrar el expediente.");
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.replace("/login-abogado");
  };

  // ---- 4. RENDERIZADO PRINCIPAL ----
  return (
    <main className="min-h-screen flex flex-col bg-[#F3F4F6]">
      {/* NAVEGACIÓN SUPERIOR */}
      <Navbar abogadoInfo={abogadoInfo} setVista={setVista} cerrarSesion={cerrarSesion} />

      <div className="flex flex-1 overflow-hidden">
        {/* BARRA LATERAL */}
        <Sidebar vista={vista} setVista={setVista} />

        {/* ÁREA DE CONTENIDO DINÁMICO */}
        <section className="flex-1 p-8 overflow-y-auto">
          {vista === "bandeja" && (
            <Bandeja cargando={cargando} casos={casos} manejarGestionar={manejarGestionar} />
          )}
          
          {vista === "clientes" && (
            <MisClientes cargando={cargando} clientesActivos={clientesActivos} manejarGestionar={manejarGestionar} />
          )}
          
          {vista === "expedientes" && (
            <Expedientes cargando={cargando} expedientesConcluidos={expedientesConcluidos} manejarGestionar={manejarGestionar} />
          )}
          
          {vista === "gestionar" && casoSeleccionado && (
            <Gestionar
              casoSeleccionado={casoSeleccionado}
              vista={vista}
              setVista={setVista}
              cargando={cargando}
              mensajeLegal={mensajeLegal}
              setMensajeLegal={setMensajeLegal}
              ofertaMonto={ofertaMonto}
              setOfertaMonto={setOfertaMonto}
              manejarCargaInstrumentoAbogado={manejarCargaInstrumentoAbogado}
              enviarActualizacionYPrecio={enviarActualizacionYPrecio}
              onConcluirCaso={concluirCasoLegal}
            />
          )}
          
          {vista === "seguridad" && (
            <div className="animate-in fade-in slide-in-from-right-10 duration-500 max-w-2xl mx-auto">
              <SecuritySettings abogadoId={abogadoInfo.id} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}