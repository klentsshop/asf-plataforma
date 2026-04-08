"use client";

import { ChevronLeft } from "lucide-react";

type Props = {
  casoSeleccionado: any;
  setVista: (v: string) => void;
  onLiberar: () => void; // 🛡️ Recibimos la función de liberación
};

export function GestionarHeader({ casoSeleccionado, setVista, onLiberar }: Props) {
  
  // Función para manejar el retroceso inteligente
  const manejarRegreso = () => {
    if (casoSeleccionado?.estado === "concluido") {
      setVista("expedientes");
    } else if (casoSeleccionado?.pagoValidado) {
      setVista("clientes");
    } else {
      // ⚠️ Si está en la bandeja (sin pago), ejecutamos la liberación oficial en Sanity
      onLiberar();
    }
  };

  return (
    <button
      onClick={manejarRegreso}
      className="mb-8 flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-[#1a1a1a] transition-all italic group"
    >
      <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-[#1a1a1a] group-hover:text-[#D4AF37] transition-all border border-slate-100">
        <ChevronLeft size={18} />
      </div>
      <span>
        {casoSeleccionado?.pagoValidado ? "Volver a Gestión" : "Volver y Liberar Expediente"}
      </span>
    </button>
  );
}