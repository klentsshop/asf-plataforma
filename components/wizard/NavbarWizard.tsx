"use client";
import { Scale, Bell, Star, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function NavbarWizard({ notificacion, navegarPaso, menuMovil, setMenuMovil }: any) {
  const router = useRouter();

  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  // Función de seguridad unificada para evitar errores y repetir código
  // 🕵️ DEBUG: Esto te dirá en la consola (F12) qué está leyendo realmente
  const manejarAccesoAdmin = () => {
    const pin = prompt("SEGURIDAD TASF: INGRESE PIN MAESTRO");
    if (pin === process.env.NEXT_PUBLIC_ADMIN_PIN) { 
      sessionStorage.setItem("asf_admin_auth", "true");
      setMenuMovil(false); // Cierra el menú si está en móvil
      router.push("/admin-master");
    } else if (pin !== null) {
      alert("ACCESO DENEGADO");
    }
  };

  if (width === null) return null;
  const isDesktop = width >= 1024;
  const HEADER_HEIGHT = 80; // h-20

  return (
    <>
      {/* NAV PRINCIPAL */}
      <nav className="bg-[#1a1a1a] h-20 flex items-center z-[60] sticky top-0 border-b-4 border-[#D4AF37] shadow-2xl">
        <div className="container mx-auto px-6 lg:px-8 flex justify-between items-center text-left">

          {/* LOGO */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navegarPaso(1)}
          >
            <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8860B] p-2 rounded-lg shadow-inner border border-white/20">
              <Scale className="text-white w-6 h-6" />
            </div>

            <div className="flex flex-col text-left leading-none">
              <span className="font-black uppercase italic text-white tracking-tight text-lg sm:text-xl lg:text-3xl">
                Tu Abogado <span className="text-[#D4AF37]">Sin Fronteras</span>
              </span>
              <span className="text-[7px] sm:text-[8px] lg:text-[9px] font-bold text-[#D4AF37] tracking-[0.4em] uppercase italic opacity-80">
                Venezuela cerca de Ti
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4 lg:gap-6">

            {/* CAMPANA */}
            <button
              onClick={() => notificacion.activa && navegarPaso(7)}
              className={`p-2.5 rounded-full transition-all duration-500 ${
                notificacion.activa 
                  ? "bg-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.7)] animate-pulse"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <Bell 
                className={`${notificacion.activa ? "text-[#1a1a1a]" : "text-white/40"} w-5 h-5`} 
              />
            </button>

            {/* DESKTOP */}
            {isDesktop && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push('/boveda')}
                  className="bg-gradient-to-b from-[#D4AF37] to-[#B8860B] text-[#1a1a1a] px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border-2 border-white italic"
                >
                  MI USUARIO
                </button>

                <button
                  onClick={() => router.push('/login-abogado')}
                  className="bg-gradient-to-b from-[#D4AF37] to-[#B8860B] text-[#1a1a1a] px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border-2 border-white italic"
                >
                  SOY ABOGADO
                </button>

                {/* BOTÓN ADMIN MASTER - DESKTOP */}
                <button
                  onClick={manejarAccesoAdmin}
                  className="bg-gradient-to-b from-[#D4AF37] to-[#B8860B] text-[#1a1a1a] px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border-2 border-white italic shadow-lg hover:brightness-110 transition-all active:scale-95"
                >
                  ADMIN
                </button>
              </div>
            )}

            {/* BOTÓN HAMBURGUESA MÓVIL */}
            {!isDesktop && (
              <button 
                onClick={() => setMenuMovil(!menuMovil)}
                className="p-2 rounded-md bg-white/10"
              >
                {menuMovil ? <X size={18} className="text-white" /> : <Menu size={18} className="text-white" />}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* OVERLAY MÓVIL */}
      {!isDesktop && menuMovil && (
        <>
          <div
            onClick={() => setMenuMovil(false)}
            className="fixed inset-0 z-[50] bg-black/30 animate-fade-in"
          />

          {/* MENÚ BAJO HEADER: Cambiado de 'fixed' a 'absolute' */}
          <div
            className="absolute z-[70] left-0 w-full bg-[#0f0f0f] border-b-4 border-[#D4AF37] shadow-2xl px-4 py-6 flex flex-col gap-3 animate-slide-down"
            style={{ top: HEADER_HEIGHT }} // Se posiciona justo debajo de la barra h-20
          >
            <button
              onClick={() => { router.push('/boveda'); setMenuMovil(false); }}
              className="text-[#D4AF37] text-[12px] font-black uppercase tracking-[0.2em] py-4 px-4 rounded-xl border-2 border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-black transition-all italic text-left"
            >
              Mi Usuario
            </button>

            <button
              onClick={() => { router.push('/login-abogado'); setMenuMovil(false); }}
              className="text-[#D4AF37] text-[12px] font-black uppercase tracking-[0.2em] py-4 px-4 rounded-xl border-2 border-[#D4AF37]/20 hover:bg-[#D4AF37] hover:text-black transition-all italic text-left"
            >
              Soy Abogado
            </button>

            {/* BOTÓN ADMIN MASTER */}
            <button
              onClick={manejarAccesoAdmin}
              className="mt-2 bg-[#D4AF37] text-[#1a1a1a] text-[12px] font-black uppercase tracking-[0.2em] py-4 px-4 rounded-xl border-2 border-white transition-all italic text-left shadow-lg"
            >
              Admin
            </button>
          </div>
        </>
      )}
    </>
  );
}