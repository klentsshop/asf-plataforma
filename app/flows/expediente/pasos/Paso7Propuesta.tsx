"use client";
import { PasoProps } from "../expediente.types";

export function Paso7Propuesta({ notificacion, navegarPaso, casoIdGenerado }: PasoProps) {
  return (
    <div className="w-full max-w-2xl animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-4 border-[#D4AF37] text-center">
        <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.5em] mb-4 italic">Asesoría Especializada ASF</p>
        <h2 className="text-3xl font-black text-[#00244C] mb-10 uppercase tracking-tighter italic">Propuesta Legal</h2>
        
        <div className="bg-white p-8 rounded-3xl text-left border-4 border-[#D4AF37]/20 mb-10 italic text-slate-600 shadow-inner leading-relaxed font-bold">
          "{notificacion?.respuesta || "Analizando los detalles jurídicos de su caso..."}"
        </div>

        <div className="bg-[#1a1a1a] p-8 rounded-3xl mb-12 text-center shadow-2xl border-4 border-[#D4AF37]">
          <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-2">Costo de Gestión Inicial</p>
          <p className="text-white text-5xl font-black tracking-tighter italic">${notificacion?.monto || "0.00"}</p>
        </div>

        <button 
          onClick={() => {
            if (casoIdGenerado) localStorage.setItem("asf_caso_id", casoIdGenerado);
            navegarPaso(8);
          }} 
          className="w-full p-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a1a1a] rounded-2xl font-black text-sm shadow-2xl uppercase italic tracking-[0.2em] hover:scale-[1.02] transition-all border-2 border-white"
        >
          ACTIVAR DEFENSA OFICIAL
        </button>
      </div>
    </div>
  );
}