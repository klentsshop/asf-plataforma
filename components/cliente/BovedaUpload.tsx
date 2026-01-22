"use client";

import { UploadCloud, Loader2 } from "lucide-react";

type Props = {
  subiendoArchivo: boolean;
  manejarCargaArchivo: (e: any) => void;
};

export function BovedaUpload({ subiendoArchivo, manejarCargaArchivo }: Props) {
  return (
    <div className="pt-8 border-t-2 border-slate-100 text-left">
      <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest italic ml-2 mb-4 text-left">
        Cargar Evidencias Adicionales
      </p>

      <label className="w-full p-10 border-4 border-dashed border-[#D4AF37]/30 rounded-[2.5rem] flex flex-col items-center justify-center gap-5 cursor-pointer hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all group relative overflow-hidden">
        {/* Decoración de fondo suave */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-[#D4AF37]/10 transition-all" />

        <div className="p-5 bg-[#1a1a1a] rounded-[1.5rem] shadow-xl text-[#D4AF37] group-hover:scale-110 transition-all border-2 border-white relative z-10">
          {subiendoArchivo ? (
            <Loader2 className="animate-spin" size={32} />
          ) : (
            <UploadCloud size={32} />
          )}
        </div>

        <div className="text-center relative z-10">
          <span className="text-[11px] font-black text-[#1a1a1a] uppercase tracking-[0.2em] block mb-1">
            {subiendoArchivo ? "TRANSMITIENDO..." : "ANEXAR DOCUMENTO"}
          </span>

          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
            PDF, JPG, PNG • Máx 10MB
          </span>
        </div>

        <input
          type="file"
          className="hidden"
          onChange={manejarCargaArchivo}
          disabled={subiendoArchivo}
          accept=".pdf, .jpg, .jpeg, .png"
        />
      </label>
    </div>
  );
}