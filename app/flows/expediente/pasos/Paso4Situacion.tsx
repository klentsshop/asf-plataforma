"use client";
import { ShieldCheck, Loader2 } from "lucide-react";
import { PasoProps } from "../expediente.types";
// Importación dinámica para el grabador para evitar errores de SSR
import dynamic from 'next/dynamic';

const Recorder = dynamic(() => import('@/components/Recorder').then(mod => mod.Recorder), { 
  ssr: false 
});

export function Paso4Situacion({
  seleccion,
  setSeleccion,
  iniciarProcesoLegal,
  grabando,
  detenerGrabacion,
  iniciarGrabacion,
  cargando,
}: PasoProps) {
  return (
    <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border-4 border-[#D4AF37] text-center">
        <div className="w-16 h-16 bg-[#1a1a1a] text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-[#D4AF37]">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-2xl font-black mb-2 italic uppercase text-[#00244C] tracking-tighter">
          Cuéntanos tu situación
        </h2>

        <p className="text-slate-400 text-[10px] mb-8 uppercase font-bold tracking-[0.2em] italic">
          Resguardo bajo secreto profesional
        </p>

        <div className="space-y-6">
          <textarea
            placeholder="Escribe brevemente tu caso aquí..."
            className="w-full h-32 p-4 bg-white border-4 border-[#D4AF37]/30 rounded-2xl focus:border-[#D4AF37] outline-none text-left transition-all font-black text-xs text-slate-700 placeholder:text-slate-300"
            onChange={(e) =>
              setSeleccion({ ...seleccion, descripcion: e.target.value })
            }
          />

          <Recorder
            grabando={grabando}
            detenerGrabacion={detenerGrabacion}
            iniciarGrabacion={iniciarGrabacion}
            audioUrl={seleccion.audioUrl}
            cargando={cargando}
          />

          <button
            onClick={iniciarProcesoLegal}
            disabled={cargando}
            className="w-full p-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a1a1a] rounded-2xl font-black text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl border-2 border-white italic disabled:opacity-50"
          >
            {cargando ? (
              <><Loader2 className="animate-spin" /> ANALIZANDO...</>
            ) : (
              "QUIERO MI CONSULTA GRATIS"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}