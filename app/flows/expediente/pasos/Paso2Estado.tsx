"use client";
import { estadosVenezuela } from "../../../lib/constants";
import { PasoProps } from "../expediente.types";

export function Paso2Estado({ seleccion, setSeleccion, navegarPaso }: PasoProps) {
  return (
    <div className="w-full max-w-6xl animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white/95 p-10 rounded-[2.5rem] shadow-2xl border-4 border-[#D4AF37] text-center">
        <h2 className="text-2xl font-black text-[#1a1a1a] mb-8 uppercase italic tracking-tighter">
          ¿En qué estado se encuentra el caso?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {estadosVenezuela.map((e: string) => (
            <button
              key={e}
              onClick={() => {
                setSeleccion({ ...seleccion, ubicacion: e });
                navegarPaso(3);
              }}
              className="p-3 bg-white border-2 border-slate-200 rounded-xl font-bold text-slate-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all text-[10px] uppercase tracking-widest min-h-[50px] flex items-center justify-center shadow-sm hover:shadow-md"
            >
              {e}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}