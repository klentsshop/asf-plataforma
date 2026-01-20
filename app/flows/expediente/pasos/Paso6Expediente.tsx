"use client";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PasoProps } from "../expediente.types";

export function Paso6Expediente({ notificacion }: PasoProps) {
  const router = useRouter();
  return (
    <div className="w-full max-w-2xl animate-in zoom-in-95 duration-500">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-4 border-[#D4AF37] text-center">
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="w-28 h-28 bg-[#1a1a1a] rounded-full flex items-center justify-center text-[#D4AF37] border-4 border-[#D4AF37] shadow-2xl">
              <ShieldCheck size={48} />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full border-4 border-white shadow-lg border-2 border-white">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-black text-[#00244C] mb-4 uppercase tracking-tighter italic">Expediente Creado</h2>
        <div className="bg-white border-4 border-[#D4AF37]/30 border-dashed p-8 rounded-[2.5rem] mb-10 shadow-inner">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mb-2 italic">ID Oficial de Expediente</p>
          <p className="text-2xl font-black text-[#1a1a1a] tracking-[0.1em] uppercase italic">
            {notificacion?.codigoExpediente || "PROCESANDO..."}
          </p>
        </div>

        <p className="text-slate-400 mb-10 font-bold italic text-center text-xs leading-relaxed tracking-wider uppercase">
          Su bóveda de seguridad está blindada. <br /> Se ha enviado una copia al correo.
        </p>

        <button onClick={() => router.push("/boveda")} className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a1a1a] p-6 rounded-2xl font-black tracking-[0.2em] transition-all hover:scale-[1.02] shadow-2xl uppercase text-xs italic border-2 border-white">
          IR A MI BÓVEDA SEGURA
        </button>
      </div>
    </div>
  );
}