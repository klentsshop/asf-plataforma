"use client";

import React, { useState, useEffect } from "react";
import { Scale, Users, Clock, FileText, Search, Landmark, KeyRound, LogOut, Loader2 } from "lucide-react";
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
  const [datosBancarios, setDatosBancarios] = useState({ 
  banco: "", 
  tipoCuenta: "", 
  numeroCuenta: "", 
  titular: "", 
  identificacion: "" 
});

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
          if (perfil.datosBancarios) {
           setDatosBancarios(perfil.datosBancarios);
           }
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
            `*[_type == "caso" && estado == "analisis" && ((categoria == $esp && ubicacion == $ub) || abogadoAsignado._ref == $id) && !defined(respuestaAbogado)] | order(_createdAt desc)`,
            { esp: abogadoInfo.especialidad, ub: abogadoInfo.ubicacion, id: abogadoInfo.id }
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
    
    const { isSafe } = filterSensitiveInfo(mensajeLegal);
    if (!isSafe) {
      return alert("⚠️ REGLA DE SEGURIDAD: No se permiten teléfonos o correos en el muro de gestión.");
    }

    try {
      setCargando(true);
      const statusInstitucional = `Actualización TASF: ${mensajeLegal}`;
      
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
      alert("Error crítico al sincronizar Usuario.");
    } finally {
      setCargando(false);
    }
  };

  const concluirCasoLegal = async () => {
    if (!confirm("¿Está seguro de marcar este caso como CONCLUIDO? Esto habilitará la encuesta de satisfacción para el cliente.")) return;

    setCargando(true);
    try {
      const res = await client
        .patch(casoSeleccionado._id)
        .set({ estado: 'concluido' }) 
        .commit();

      setCasoSeleccionado(res); 
      alert("⚖️ Expediente finalizado exitosamente.");
      setVista("expedientes");
      
    } catch (error) {
      console.error("Error al concluir:", error);
      alert("Error al cerrar el expediente.");
    } finally {
      setCargando(false);
    }
  };

  const guardarDatosBancarios = async () => {
  setCargando(true);
  try {
    await client
      .patch(abogadoInfo.id)
      .set({ datosBancarios: datosBancarios })
      .commit();
    alert("🏦 Información financiera actualizada.");
  } catch (error) {
    console.error("Error guardando banco:", error);
    alert("Error al guardar datos bancarios.");
  } finally {
    setCargando(false);
  }
};

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.replace("/login-abogado");
  };

  // ---- 4. RENDERIZADO PRINCIPAL (MEJORADO PARA MÓVIL) ----
  return (
    <main className="min-h-screen flex flex-col bg-[#F3F4F6] overflow-x-hidden">
      {/* NAVEGACIÓN SUPERIOR */}
      <Navbar abogadoInfo={abogadoInfo} setVista={setVista} cerrarSesion={cerrarSesion} />

      {/* CONTENEDOR FLEXIBLE: Cambia de Columna (móvil) a Fila (escritorio) */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        
        {/* BARRA LATERAL: 
            En móvil se vuelve una barra de navegación superior/apilada.
            En escritorio (lg:) recupera su ancho de 80 y altura completa.
        */}
        <div className="w-full lg:w-80 flex-shrink-0 bg-[#1a1a1a] border-b-4 lg:border-b-0 lg:border-r-4 border-[#D4AF37] z-20">
          <Sidebar vista={vista} setVista={setVista} />
        </div>

        {/* ÁREA DE CONTENIDO DINÁMICO: 
            Añadimos w-full y aseguramos que el scroll sea vertical.
        */}
        <section className="flex-1 w-full p-4 md:p-8 overflow-y-auto">
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
          
          {/* VISTA DE PAGOS Y DATOS BANCARIOS */}
{vista === "pagos" && (
  <div className="animate-in fade-in slide-in-from-bottom-10 duration-500 max-w-2xl mx-auto py-6">
    <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border-4 border-[#D4AF37] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-[#1a1a1a] text-[#D4AF37] rounded-full flex items-center justify-center border-2 border-[#D4AF37]">
          <Scale size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#1a1a1a] uppercase italic tracking-tighter">Datos de Cobro</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Configuración de Honorarios Oficiales</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {[
          { label: "Institución Bancaria", key: "banco", placeholder: "Ej: Banesco / Mercantil" },
          { label: "Titular de la Cuenta", key: "titular", placeholder: "Nombre Completo" },
          { label: "Cédula o RIF", key: "identificacion", placeholder: "V-00.000.000" },
          { label: "Número de Cuenta (20 Dígitos)", key: "numeroCuenta", placeholder: "01XX XXXX XX XXXXXXXXXX" },
        ].map((f) => (
          <div key={f.key} className="relative group">
            <label className="text-[9px] font-black text-slate-400 uppercase italic tracking-widest ml-2 mb-1 block">
              {f.label}
            </label>
            <input
              type="text"
              placeholder={f.placeholder}
              value={(datosBancarios as any)[f.key]}
              onChange={(e) => setDatosBancarios({ ...datosBancarios, [f.key]: e.target.value })}
              className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#D4AF37] transition-all font-bold text-xs text-slate-700 shadow-sm"
            />
          </div>
        ))}

        <div className="relative group">
          <label className="text-[9px] font-black text-slate-400 uppercase italic tracking-widest ml-2 mb-1 block">Tipo de Cuenta</label>
          <select
            value={datosBancarios.tipoCuenta}
            onChange={(e) => setDatosBancarios({ ...datosBancarios, tipoCuenta: e.target.value })}
            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-[#D4AF37] transition-all font-bold text-xs text-slate-700 shadow-sm appearance-none cursor-pointer"
          >
            <option value="">Seleccionar...</option>
            <option value="Ahorros">Cuenta de Ahorros</option>
            <option value="Corriente">Cuenta Corriente</option>
          </select>
        </div>

        <button
          onClick={guardarDatosBancarios}
          disabled={cargando}
          className="w-full mt-6 p-5 bg-[#1a1a1a] text-[#D4AF37] rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all italic flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 border-2 border-[#D4AF37]"
        >
          {cargando ? <Loader2 className="animate-spin" /> : "Actualizar Información Financiera"}
        </button>
      </div>
    </div>
  </div>
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