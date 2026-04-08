"use client";
import { PasoProps } from "../expediente.types";
import { ShieldCheck, CheckCircle2, MessageCircle } from "lucide-react";

export function Paso7Propuesta({ notificacion, navegarPaso, casoIdGenerado }: PasoProps) {
  return (
    <div className="w-full max-w-2xl animate-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-4 border-[#D4AF37] text-center">
        <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.5em] mb-4 italic">Asesoría Especializada TASF</p>
        <h2 className="text-3xl font-black text-[#00244C] mb-10 uppercase tracking-tighter italic">Propuesta Legal</h2>
        
        <div className="bg-white p-8 rounded-3xl text-left border-4 border-[#D4AF37]/20 mb-10 italic text-slate-600 shadow-inner leading-relaxed font-bold">
          "{notificacion?.respuesta || "Analizando los detalles jurídicos de su caso..."}"
        </div>

        <div className="bg-[#1a1a1a] p-8 rounded-3xl mb-12 text-center shadow-2xl border-4 border-[#D4AF37]">
          <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-2">Costo de Gestión Inicial</p>
          <p className="text-white text-5xl font-black tracking-tighter italic">${notificacion?.monto || "0.00"}</p>
        </div>
        
        {/* 🚀 BLOQUE DE MOTIVACIÓN AL REGISTRO */}
        <div className="bg-[#D4AF37]/5 border-4 border-dashed border-[#D4AF37]/30 rounded-[2.5rem] p-8 mb-10 text-left relative overflow-hidden group">
          {/* Decoración sutil de fondo */}
          <ShieldCheck size={80} className="absolute -right-4 -top-4 text-[#D4AF37] opacity-10 group-hover:rotate-12 transition-transform duration-500" />

          <h4 className="text-[#00244C] font-black text-[10px] uppercase italic tracking-[0.2em] mb-5 flex items-center gap-2">
            <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-ping" />
            Beneficios de tu Activación Oficial:
          </h4>

          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="mt-0.5 bg-[#1a1a1a] p-1 rounded-full shadow-lg">
                <MessageCircle size={10} className="text-[#D4AF37]" />
              </div>
              <p className="text-[10px] text-slate-600 font-bold uppercase italic leading-tight tracking-tight">
                <span className="text-[#00244C]">Canal Directo:</span> Desbloquea el botón de WhatsApp para aclarar dudas antes de continuar el proceso.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-0.5 bg-[#1a1a1a] p-1 rounded-full shadow-lg">
                <CheckCircle2 size={10} className="text-[#D4AF37]" />
              </div>
              <p className="text-[10px] text-slate-600 font-bold uppercase italic leading-tight tracking-tight">
                <span className="text-[#00244C]">Privacidad de Caso:</span> Recibe y descarga tus documentos legales en un entorno cifrado.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-0.5 bg-[#1a1a1a] p-1 rounded-full shadow-lg">
                <ShieldCheck size={10} className="text-[#D4AF37]" />
              </div>
              <p className="text-[10px] text-slate-600 font-bold uppercase italic leading-tight tracking-tight">
                <span className="text-[#00244C]">Protección de Pago:</span> Tu dinero queda en custodia hasta que el servicio sea entregado.
              </p>
            </li>
          </ul>
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