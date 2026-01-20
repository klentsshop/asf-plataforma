"use client";

import { useState, useEffect, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Acciones y constantes
import { crearCasoAnonimo, registrarYVincularCliente } from "../sanity/lib/actions";
import { estadosVenezuela, serviceCardsData } from "./lib/constants";

// Tipados oficiales
import { NotificacionCaso, SeleccionCaso } from "./flows/expediente/expediente.types";

// Importación de Pasos
import { Paso1Categoria } from "./flows/expediente/pasos/Paso1Categoria";
import { Paso2Estado } from "./flows/expediente/pasos/Paso2Estado";
import { Paso3Documentos } from "./flows/expediente/pasos/Paso3Documentos";
import { Paso4Situacion } from "./flows/expediente/pasos/Paso4Situacion";
import { Paso5Solicitud } from "./flows/expediente/pasos/Paso5Solicitud";
import { Paso6Expediente } from "./flows/expediente/pasos/Paso6Expediente";
import { Paso7Propuesta } from "./flows/expediente/pasos/Paso7Propuesta";
import { Paso8Registro } from "./flows/expediente/pasos/Paso8Registro";

// Layout y Navbar
import { HeaderWizard } from "@/components/wizard/HeaderWizard";
import { NavbarWizard } from "@/components/wizard/NavbarWizard";

// IMPORTACIÓN DE HOOKS FUNCIONALES
import { useExpedienteAudio } from "./flows/expediente/useExpedienteAudio";
import { useExpedienteNotifs } from "./flows/expediente/useExpedienteNotifs";

export default function Page() {
  const router = useRouter();
  const [paso, setPaso] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [grabando, setGrabando] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [casoIdGenerado, setCasoIdGenerado] = useState<string | null>(null);

  const [seleccion, setSeleccion] = useState<SeleccionCaso>({
    categoria: "", ubicacion: "", tieneDocumentos: "", descripcion: "",
    audioUrl: "", nombre: "", cedula: "", email: "", telefono: "",
  });

  const [notificacion, setNotificacion] = useState<NotificacionCaso>({
    activa: false, 
    respuesta: null, 
    monto: null, 
    codigoExpediente: null,
  });

  // 1. INTEGRACIÓN DE NOTIFICACIONES (Polling activo a Sanity)
  useExpedienteNotifs(setNotificacion);

  // 2. INTEGRACIÓN DE AUDIO (Motor real del micrófono)
  const { iniciarGrabacion, detenerGrabacion } = useExpedienteAudio(
    setCargando,
    setGrabando,
    setSeleccion
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const navegarPaso = (p: number) => { if (!cargando) setPaso(p); };

  const iniciarProcesoLegal = async () => {
    if (!seleccion.descripcion && !seleccion.audioUrl) return alert("Describe tu situación");
    setCargando(true);
    try {
      const res = await crearCasoAnonimo(seleccion);
      if (res?.success) {
        localStorage.setItem("asf_caso_id", res.casoId || "");
        setCasoIdGenerado(res.casoId || "");
        navegarPaso(5);
      }
    } finally { setCargando(false); }
  };

  const finalizarRegistroOficial = async () => {
    // 1. Recuperación de ID con respaldo de seguridad
    const casoId = casoIdGenerado || localStorage.getItem("asf_caso_id") || "";
    if (!casoId) return alert("Error: No se detectó un ID de expediente activo.");
    
    // 2. Validación de campos obligatorios
    if (!seleccion.nombre || !seleccion.email || !seleccion.cedula) {
      return alert("Por favor, complete su nombre, cédula y correo electrónico.");
    }

    setCargando(true);

    try {
      // 3. Intento de registro con validación de unicidad en Sanity
      const res = await registrarYVincularCliente(casoId, seleccion);
      
      // 🚨 MANEJO DE DUPLICADOS (Blindaje Legal)
      if (!res.success && res.errorType === "UNICIDAD") {
        const msj = res.mensajes?.map((m: string) => 
          m === "CEDULA_DUPLICADA" 
            ? "• Esta cédula ya está registrada en nuestro sistema." 
            : "• Este correo electrónico ya está vinculado a otro expediente."
        ).join("\n");
        
        setCargando(false);
        return alert(`ATENCIÓN JURÍDICA:\n\n${msj}\n\nPor favor, verifique sus datos o contacte a soporte.`);
      }

      if (!res.success) {
        throw new Error("Error técnico al vincular el cliente.");
      }

      // 4. Envío de Correo vía API Send (Resend)
      await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: seleccion.email,
          nombre: seleccion.nombre,
          casoId: casoId,
          codigoExpediente: notificacion.codigoExpediente,
        }),
      });

      // 5. Limpieza de seguridad y éxito
      localStorage.removeItem("asf_caso_id");
      navegarPaso(6);

    } catch (error: any) {
      console.error("Error en finalizarRegistroOficial:", error);
      alert(`Error en el proceso: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  const commonProps = {
    paso, 
    seleccion, 
    setSeleccion, 
    navegarPaso, 
    notificacion, 
    cargando, 
    grabando, 
    casoIdGenerado
  };

  if (!isClient) return null;

  return (
    <main className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans selection:bg-[#D4AF37] relative overflow-x-hidden">
      
      {/* CAPA DE FONDO LUXURY RECUPERADA */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Dama de la Justicia (Imagen de Unsplash con filtros originales) */}
        <div 
          className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-20 grayscale contrast-125" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070')" }} 
        />
        {/* Cuadrícula Dorada Sutil */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af3710_1px,transparent_1px),linear-gradient(to_bottom,#d4af3710_1px,transparent_1px)] bg-[size:45px_45px]" />
      </div>

      {/* CONTENIDO PRINCIPAL SOBRE EL FONDO */}
      <div className="relative z-10 flex flex-col min-h-screen text-center">
        <NavbarWizard notificacion={notificacion} navegarPaso={navegarPaso} />
        <HeaderWizard paso={paso} isPending={isPending} navegarPaso={navegarPaso} />

        {/* Sección de Pasos con margen negativo para el efecto Luxury */}
        <section className="flex-1 px-8 -mt-10 pb-20 flex justify-center items-start z-20">
          <div className="container mx-auto flex flex-col items-center">
            {paso === 1 && <Paso1Categoria {...commonProps} />}
            {paso === 2 && <Paso2Estado {...commonProps} />}
            {paso === 3 && <Paso3Documentos {...commonProps} />}
            {paso === 4 && (
              <Paso4Situacion 
                {...commonProps} 
                iniciarProcesoLegal={iniciarProcesoLegal} 
                iniciarGrabacion={iniciarGrabacion} 
                detenerGrabacion={detenerGrabacion} 
              />
            )}
            {paso === 5 && <Paso5Solicitud {...commonProps} />}
            {paso === 6 && <Paso6Expediente {...commonProps} />}
            {paso === 7 && <Paso7Propuesta {...commonProps} />}
            {paso === 8 && (
              <Paso8Registro 
                {...commonProps} 
                finalizarRegistroOficial={finalizarRegistroOficial} 
              />
            )}
          </div>
        </section>

        <footer className="bg-[#1a1a1a] py-12 border-t-4 border-[#D4AF37] text-center relative z-30">
          <p className="text-slate-500 text-[9px] font-black uppercase italic tracking-[0.5em]">
            Abogados Sin Fronteras Venezuela • 2026
          </p>
        </footer>
      </div>
    </main>
  );
}