"use client";

import { ChevronLeft } from "lucide-react";

type Props = {
  casoSeleccionado: any;
  setVista: (v: string) => void;
};

export function GestionarHeader({ casoSeleccionado, setVista }: Props) {
  return (
    <button
      onClick={() =>
        setVista(
          casoSeleccionado?.estado === "concluido"
            ? "expedientes"
            : casoSeleccionado?.pagoValidado
            ? "clientes"
            : "bandeja"
        )
      }
      className="mb-8 flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-[#1a1a1a] transition-all italic"
    >
      <ChevronLeft size={18} />
      Volver a la Lista
    </button>
  );
}
