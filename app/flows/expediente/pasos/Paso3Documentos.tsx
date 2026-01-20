"use client";
import { FileText } from "lucide-react";
import { PasoProps } from "../expediente.types";

export function Paso3Documentos({ seleccion, setSeleccion, navegarPaso }: PasoProps) {
  return (
    <div className="w-full max-w-md animate-in zoom-in-95 duration-500">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border-4 border-[#D4AF37] text-center">
        <div className="w-16 h-16 bg-[#1a1a1a] text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-[#D4AF37]">
          <FileText size={32} />
        </div>
        <h2 className="text-2xl font-black mb-8 italic uppercase text-[#00244C] tracking-tighter">
          ¿Posee documentos?
        </h2>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => {
              setSeleccion({ ...seleccion, tieneDocumentos: "Si" });
              navegarPaso(4);
            }}
            className="p-5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a1a1a] rounded-xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-xl uppercase tracking-widest italic border-2 border-white"
          >
            SÍ, LOS TENGO
          </button>

          <button
            onClick={() => {
              setSeleccion({ ...seleccion, tieneDocumentos: "No" });
              navegarPaso(4);
            }}
            className="p-5 bg-white border-4 border-[#D4AF37]/30 text-[#D4AF37] rounded-xl font-black text-sm hover:border-[#D4AF37] transition-all text-xs uppercase tracking-widest italic"
          >
            NO, REQUIERO GESTIÓN
          </button>
        </div>
      </div>
    </div>
  );
}