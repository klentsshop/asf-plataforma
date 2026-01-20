"use client";
import { Scale, Bell, Star } from "lucide-react";
import { useRouter } from "next/navigation";

export function NavbarWizard({ notificacion, navegarPaso }: any) {
  const router = useRouter();

  return (
    <nav className="bg-[#1a1a1a] h-20 flex items-center z-50 sticky top-0 border-b-4 border-[#D4AF37] shadow-2xl">
      <div className="container mx-auto px-8 flex justify-between items-center text-left">
        
        {/* LOGO Y NOMBRE */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navegarPaso(1)}>
          <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8860B] p-2 rounded-lg shadow-inner border border-white/20">
            <Scale className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-2xl font-black text-white leading-none tracking-tighter uppercase italic">
              Abogados <span className="text-[#D4AF37]">Sin Fronteras</span>
            </span>
            <span className="text-[9px] font-bold text-[#D4AF37] tracking-[0.4em] uppercase opacity-80 italic">
              Venezuela cerca de Ti
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          {/* SECCIÓN DE NOTIFICACIÓN / CAMPANA */}
          <div className="relative group">
            <button 
              onClick={() => { if(notificacion.activa) navegarPaso(7) }}
              className={`p-2.5 rounded-full transition-all duration-500 relative ${
                notificacion.activa 
                  ? 'bg-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.7)] animate-pulse' 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <Bell className={`${notificacion.activa ? 'text-[#1a1a1a]' : 'text-white/40'} w-5 h-5`} />
              {notificacion.activa && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-600 border-2 border-[#1a1a1a] rounded-full shadow-lg" />
              )}
            </button>

            {/* TOOLTIP FLOTANTE ORIGINAL (RECUPERADO) */}
            {notificacion.activa && (
              <div className="absolute top-14 right-0 w-64 bg-white p-4 rounded-2xl shadow-2xl border-4 border-[#D4AF37] z-[60] animate-in fade-in slide-in-from-top-3">
                <div className="flex items-start gap-3 text-left">
                  <div className="bg-emerald-100 p-1.5 rounded-lg shrink-0 border-2 border-emerald-500">
                    <Star className="text-emerald-600 w-4 h-4 fill-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#00244C] font-black uppercase tracking-tighter leading-none">
                      ¡Asesoría Lista!
                    </p>
                    <p className="text-[9px] text-slate-500 leading-tight mt-1 font-bold italic">
                      Tu abogado especialista ha respondido. Toca para ver la propuesta.
                    </p>
                  </div>
                </div>
                {/* Triángulo del Tooltip */}
                <div className="absolute -top-2 right-4 w-4 h-4 bg-white border-l-4 border-t-4 border-[#D4AF37] rotate-45" />
              </div>
            )}
          </div>
           {/* 🛡️ BOTÓN MI BOVEDA - ESTILO EXACTO A LA IMAGEN */}

          <button 

            onClick={() => router.push('/boveda')} 

            className="bg-gradient-to-b from-[#D4AF37] to-[#B8860B] text-[#1a1a1a] px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border-2 border-white hover:scale-105 transition-all shadow-xl shadow-black/40 italic"

          >MI BOVEDA

          </button>
          {/* BOTÓN LOGIN ABOGADO */}
          <button 
            onClick={() => router.push('/login-abogado')} 
            className="bg-gradient-to-b from-[#D4AF37] to-[#B8860B] text-[#1a1a1a] px-8 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest border-2 border-white hover:scale-105 transition-all shadow-xl shadow-black/40 italic"
          >
            SOY ABOGADO
          </button>
        </div>
      </div>
    </nav>
  );
}