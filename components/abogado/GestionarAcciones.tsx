"use client";

import { FileUp, Lock } from "lucide-react";

type Props = {
  casoSeleccionado: any; 
  cargando: boolean;
  manejarCargaInstrumentoAbogado: (e: any) => void;
  onConcluirCaso: () => void; 
};

export function GestionarAcciones({
  casoSeleccionado,
  cargando,
  manejarCargaInstrumentoAbogado,
}: Props) {
  // REGLA DE ORO DRA. LIZ: Solo habilitar si el pago está validado en Sanity
  const estaPagado = casoSeleccionado?.pagoValidado === true;
  const yaConcluido = casoSeleccionado?.estado === 'concluido';

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 1. Bloque de Carga de Instrumento (ÚNICO ELEMENTO AQUÍ) */}
      <div className={`p-10 border-2 border-dashed rounded-[2.5rem] text-center w-full transition-all 
        ${estaPagado 
          ? "bg-slate-50 border-slate-200 hover:bg-slate-100/50 cursor-pointer" 
          : "bg-slate-100 border-slate-300 opacity-60 cursor-not-allowed shadow-inner"
        }`}>
        
        <label className={`flex flex-col items-center gap-3 ${(!estaPagado || yaConcluido) && "pointer-events-none"}`}>
          {estaPagado && !yaConcluido ? (
            <FileUp
              size={32}
              className={`${cargando ? "animate-bounce text-[#D4AF37]" : "text-slate-300"} transition-all`}
            />
          ) : (
            <Lock size={32} className={`${!estaPagado && "animate-pulse"} text-slate-400`} />
          )}

          <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest leading-none text-center">
            {yaConcluido 
              ? "Expediente Cerrado" 
              : estaPagado 
                ? (cargando ? "Transmitiendo..." : "Cargar Instrumento Legal") 
                : "Bloqueado: Esperando Validación de Pago"}
          </span>

          <input
            type="file"
            className="hidden"
            onChange={manejarCargaInstrumentoAbogado}
            disabled={cargando || !estaPagado || yaConcluido}
          />
        </label>
      </div>

      {/* HEMOS ELIMINADO EL BOTÓN DE FINALIZAR DE AQUÍ PORQUE YA ESTÁ EN EL PADRE */}
    </div>
  );
}