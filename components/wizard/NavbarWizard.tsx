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
                Abogados <span className="text-[#D4AF37]">Sin Fronteras</span>
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
                  MI BÓVEDA
                </button>

                <button
                  onClick={() => router.push('/login-abogado')}
                  className="bg-gradient-to-b from-[#D4AF37] to-[#B8860B] text-[#1a1a1a] px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border-2 border-white italic"
                >
                  SOY ABOGADO
                </button>
              </div>
            )}

            {/* MÓVIL */}
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
            className="fixed inset-0 z-[50] bg-black/30"
          />

          {/* MENÚ BAJO HEADER */}
          <div
            className="fixed z-[70] left-0 w-full bg-[#0f0f0f] border-b border-[#D4AF37]/40 shadow-lg px-3 py-3 flex flex-col gap-2"
            style={{ top: HEADER_HEIGHT }}
          >
            <button
              onClick={() => { router.push('/boveda'); setMenuMovil(false); }}
              className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest py-2 px-3 rounded-md border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-black transition"
            >
              Mi Bóveda
            </button>

            <button
              onClick={() => { router.push('/login-abogado'); setMenuMovil(false); }}
              className="text-[#D4AF37] text-[11px] font-bold uppercase tracking-widest py-2 px-3 rounded-md border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-black transition"
            >
              Soy Abogado
            </button>
          </div>
        </>
      )}
    </>
  );
}
