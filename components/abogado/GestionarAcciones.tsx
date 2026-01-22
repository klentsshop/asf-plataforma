"use client";

import { FileUp, Lock, CheckCircle2 } from "lucide-react";

type Props = {
  casoSeleccionado: any; 
  cargando: boolean;
  manejarCargaInstrumentoAbogado: (e: any) => void;
  onConcluirCaso: () => void; // Nueva prop para la lógica de cierre
};

export function GestionarAcciones({
  casoSeleccionado,
  cargando,
  manejarCargaInstrumentoAbogado,
  onConcluirCaso // Recibimos la función
}: Props) {
  // REGLA DE ORO DRA. LIZ: Solo habilitar si el pago está validado en Sanity
  const estaPagado = casoSeleccionado?.pagoValidado === true;
  const yaConcluido = casoSeleccionado?.estado === 'concluido';

  // Función con doble confirmación para seguridad extrema
  const confirmarCierre = () => {
    const primeraConfirmacion = confirm("⚠️ ADVERTENCIA LEGAL: ¿Está seguro de marcar este caso como CONCLUIDO?");
    if (primeraConfirmacion) {
      const segundaConfirmacion = confirm("Confirmación final: Esto habilitará la reseña pública del cliente y cerrará el ciclo del expediente. ¿Proceder?");
      if (segundaConfirmacion) {
        onConcluirCaso();
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      {/* 1. Bloque de Carga de Instrumento (Tu código original) */}
      <div className={`p-10 border-2 border-dashed rounded-[2.5rem] text-center w-full transition-all 
        ${estaPagado 
          ? "bg-slate-50 border-slate-200 hover:bg-slate-100/50 cursor-pointer" 
          : "bg-slate-100 border-slate-300 opacity-60 cursor-not-allowed shadow-inner"
        }`}>
        
        <label className={`flex flex-col items-center gap-3 ${(!estaPagado || yaConcluido) && "pointer-events-none"}`}>
          {estaPagado ? (
            <FileUp
              size={32}
              className={`${cargando ? "animate-bounce text-[#D4AF37]" : "text-slate-300"} transition-all`}
            />
          ) : (
            <Lock size={32} className="text-slate-400 animate-pulse" />
          )}

          <span className="text-[10px] font-black text-slate-400 uppercase italic tracking-widest leading-none">
            {estaPagado 
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

      {/* 2. Botón de Concluir Caso (Doble Blindaje) */}
      {estaPagado && !yaConcluido && (
        
        <button
          onClick={confirmarCierre}
          disabled={cargando}
          className="w-full py-5 bg-[#1a1a1a] border-2 border-[#D4AF37] text-[#D4AF37] rounded-[2rem] font-black text-[9px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all duration-300 shadow-xl italic hover:bg-[#D4AF37] hover:text-[#1a1a1a] active:scale-95 disabled:opacity-50"
        >
          {cargando ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin h-3 w-3 border-2 border-[#D4AF37] border-t-transparent rounded-full" />
              PROCESANDO CIERRE...
            </span>
          ) : (
            <>
              <CheckCircle2 size={16} />
              FINALIZAR EXPEDIENTE Y SOLICITAR RESEÑA
            </>
          )}
        </button>
      )}

      {yaConcluido && (
        <div className="w-full py-5 bg-black/40 text-[#D4AF37]/50 rounded-[2rem] font-black text-[9px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 border-2 border-[#D4AF37]/20 italic">
          <CheckCircle2 size={16} />
          EXPEDIENTE CONCLUIDO
        </div>
      )}
    </div>
  );
}
