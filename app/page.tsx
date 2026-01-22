"use client";

import { useState, useEffect, useTransition } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

// Acciones y constantes
import { crearCasoAnonimo, registrarYVincularCliente } from "../sanity/lib/actions";
import { estadosVenezuela, serviceCardsData } from "./lib/constants";
import { client } from "../sanity/lib/client";

// Tipados oficiales
import { NotificacionCaso, SeleccionCaso } from "./flows/expediente/expediente.types";

// Importación de Pasos
import { Paso1Categoria } from "./flows/expediente/pasos/Paso1Categoria";
import { Paso2Estado } from "./flows/expediente/pasos/Paso2Estado";
import { Paso4Situacion } from "./flows/expediente/pasos/Paso4Situacion";
import { Paso5Solicitud } from "./flows/expediente/pasos/Paso5Solicitud";
import { Paso6Expediente } from "./flows/expediente/pasos/Paso6Expediente";
import { Paso7Propuesta } from "./flows/expediente/pasos/Paso7Propuesta";
import { Paso8Registro } from "./flows/expediente/pasos/Paso8Registro";

// Layout y Navbar
import { HeaderWizard } from "@/components/wizard/HeaderWizard";
import { NavbarWizard } from "@/components/wizard/NavbarWizard";
import { ReviewsFooter } from "@/components/ReviewsFooter";

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
  
  // ESTADO PARA RESEÑAS PÚBLICAS
  const [reviews, setReviews] = useState<any[]>([]);

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

  // *** NUEVO: ESTADO DEL MENÚ MÓVIL ***
  const [menuMovil, setMenuMovil] = useState(false);

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
    
    // CARGAR RESEÑAS PARA EL FOOTER
    const fetchReviews = async () => {
      try {
        const data = await client.fetch(`
          *[_type == "caso" && estado == "concluido" && defined(rating)] | order(_updatedAt desc) [0...3] {
            rating,
            resenaTexto,
            "clienteNombre": cliente->nombre
          }
        `);
        setReviews(data);
      } catch (error) {
        console.error("Error cargando reseñas:", error);
      }
    };
    fetchReviews();
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
    const casoId = casoIdGenerado || localStorage.getItem("asf_caso_id") || "";
    if (!casoId) return alert("Error: No se detectó un ID de expediente activo.");
    if (!seleccion.nombre || !seleccion.email || !seleccion.cedula) {
      return alert("Por favor, complete su nombre, cédula y correo electrónico.");
    }
    setCargando(true);

    try {
      const res = await registrarYVincularCliente(casoId, seleccion);
      if (!res.success) throw new Error("Error técnico al vincular el cliente.");

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

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-no-repeat bg-center bg-contain opacity-20 grayscale contrast-125" 
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2070')" }} 
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af3710_1px,transparent_1px),linear-gradient(to_bottom,#d4af3710_1px,transparent_1px)] bg-[size:45px_45px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen text-center">
        {/* NAV */}
        <NavbarWizard 
          notificacion={notificacion} 
          navegarPaso={navegarPaso} 
          setMenuMovil={setMenuMovil} 
          menuMovil={menuMovil}
        />
        {/* *** MENÚ MÓVIL DESPLEGADO *** */}
        {menuMovil && (
          <div className="lg:hidden bg-[#1a1a1a] border-b-4 border-[#D4AF37] px-4 py-3 space-y-2 z-30">
            <button
              onClick={() => { router.push("/boveda"); setMenuMovil(false); }}
              className="w-full py-2 bg-[#D4AF37] text-[#1a1a1a] rounded-xl text-xs font-black uppercase tracking-widest italic"
            >
              MI BÓVEDA
            </button>
            <button
              onClick={() => { router.push("/login-abogado"); setMenuMovil(false); }}
              className="w-full py-2 bg-[#D4AF37] text-[#1a1a1a] rounded-xl text-xs font-black uppercase tracking-widest italic"
            >
              SOY ABOGADO
            </button>
          </div>
        )}


        {/* HEADER */}
        <HeaderWizard paso={paso} isPending={isPending} navegarPaso={navegarPaso} />

        
        {/* CONTENIDO PRINCIPAL */}
        <section className="flex-1 px-8 -mt-10 pb-0 flex justify-center items-start z-20">
          <div className="container mx-auto flex flex-col items-center">
            {paso === 1 && <Paso1Categoria {...commonProps} />}
            {paso === 2 && <Paso2Estado {...commonProps} />}
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

        {/* COMPONENTE DE RESEÑAS DINÁMICAS */}
        <ReviewsFooter reviews={reviews} />

        <footer className="bg-[#1a1a1a] py-12 border-t-4 border-[#D4AF37] text-center relative z-30">
          <p className="text-slate-500 text-[9px] font-black uppercase italic tracking-[0.5em]">
            Tu Abogado Sin Fronteras Venezuela • 2026
          </p>
        </footer>
      </div>
    </main>
  );
}