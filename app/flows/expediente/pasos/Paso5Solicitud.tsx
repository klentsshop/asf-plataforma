"use client";
import { CheckCircle2, Bell, ShieldCheck } from "lucide-react";
import { PasoProps } from "../expediente.types";

export function Paso5Solicitud({ navegarPaso }: PasoProps) {
  return (
    <div className="w-full max-w-3xl animate-in fade-in zoom-in-95 duration-700">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border-4 border-[#D4AF37] text-center">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#333] p-10 rounded-3xl mb-8 border-4 border-[#D4AF37]">
          <CheckCircle2 className="text-[#D4AF37] w-16 h-16 mx-auto mb-6 drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
          <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">¡Solicitud Enviada!</h3>
          <p className="text-[#D4AF37] font-bold uppercase tracking-[0.3em] mt-3 italic text-xs">Análisis Legal en Proceso</p>
        </div>

        <div className="bg-white rounded-3xl p-8 mb-8 border-4 border-[#D4AF37]/20 relative overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => <div key={i} className="w-2 h-2 rounded-full bg-slate-200" />)}
            </div>
            <div className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest italic animate-pulse flex items-center gap-2">
              <Bell size={12} /> Vigilando tu caso
            </div>
          </div>

          <div className="bg-white border-4 border-[#D4AF37]/10 rounded-2xl p-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border-4 border-[#D4AF37] shadow-lg">
                <ShieldCheck className="text-[#D4AF37] w-6 h-6" />
              </div>
              <div>
                <div className="h-2 w-32 bg-slate-100 rounded-full mb-3 animate-pulse" />
                <div className="h-2 w-20 bg-slate-50 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-[10px] mt-6 uppercase font-bold tracking-widest italic text-center">
            En los próximos minutos. Revise la <span className="text-[#D4AF37]">campanita dorada</span> arriba.
          </p>
        </div>

        <button onClick={() => navegarPaso(1)} className="w-full p-5 bg-[#1a1a1a] text-white rounded-xl font-black text-xs tracking-widest shadow-xl uppercase italic hover:bg-black transition-all border-4 border-[#D4AF37]/30">
          VOLVER AL INICIO
        </button>
      </div>
    </div>
  );
}