"use client";

import { DollarSign } from "lucide-react";
// Importamos el componente del muro inteligente
import { MuroGestionAbogado } from "../admin/MuroGestionAbogado";

type Props = {
  casoSeleccionado: any;
  ofertaMonto: string;
  setOfertaMonto: (v: string) => void;
  mensajeLegal: string;
  setMensajeLegal: (v: string) => void;
  // Añadimos estas dos para conectar con el botón del muro
  enviarActualizacionYPrecio: () => void;
  cargando: boolean;
};

export function GestionarBoveda({
  casoSeleccionado,
  ofertaMonto,
  setOfertaMonto,
  mensajeLegal,
  setMensajeLegal,
  enviarActualizacionYPrecio,
  cargando
}: Props) {
  return (
    <div className="lg:col-span-2 p-10 space-y-8">
      {/* SECCIÓN SUPERIOR: ID Y PRESUPUESTO (100% ORIGINAL) */}
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h3 className="text-2xl font-black text-[#1a1a1a] uppercase italic tracking-tighter">
            Bóveda de Control
          </h3>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Ref: {casoSeleccionado?._id.substring(0, 8)}
          </p>
        </div>

        <div className="bg-slate-50 px-6 py-4 rounded-2xl border-2 border-slate-100 text-right">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">
            {casoSeleccionado?.pagoValidado ? "Acuerdo Actual" : "Presupuesto"}
          </p>
          <div className="flex items-center gap-2 text-2xl font-black text-[#1a1a1a] italic leading-none">
            <DollarSign size={24} className="text-[#D4AF37]" />
            <input
              type="text"
              value={ofertaMonto}
              onChange={(e) => setOfertaMonto(e.target.value)}
              placeholder="0.00"
              className={`w-24 bg-transparent outline-none border-b-2 border-dashed border-slate-200 focus:border-[#D4AF37] ${casoSeleccionado?.pagoValidado ? "opacity-50" : ""}`}
              disabled={casoSeleccionado?.pagoValidado}
            />
          </div>
        </div>
      </div>

      {/* REEMPLAZO DEL TEXTAREA POR EL MURO INTELIGENTE */}
      {/* Nota: He inyectado la lógica de seguridad visual aquí. 
          El muro ahora controla el estado 'mensajeLegal' que viene del Dashboard.
      */}
      <MuroGestionAbogado 
        mensaje={mensajeLegal}
        setMensaje={setMensajeLegal}
        onSend={enviarActualizacionYPrecio}
        cargando={cargando}
        esSolvente={casoSeleccionado?.pagoValidado}
      />
    </div>
  );
}