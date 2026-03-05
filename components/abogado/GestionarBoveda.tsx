"use client";

import { DollarSign, Lock } from "lucide-react"; 
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

  // 🛡️ LÓGICA DE BLOQUEO: Si el caso ya se cerró
  const esConcluido = casoSeleccionado?.estado === 'concluido';

  return (
    <div className={`lg:col-span-2 p-5 md:p-10 space-y-6 md:space-y-8 ${esConcluido ? 'opacity-80' : ''}`}>
      {/* SECCIÓN SUPERIOR: ID Y PRESUPUESTO (100% ORIGINAL) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-black text-[#1a1a1a] uppercase italic tracking-tighter">
              Seguimiento del Caso
            </h3>
            {esConcluido && <Lock size={20} className="text-slate-400" />}
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Ref: {casoSeleccionado?._id.substring(0, 8)} 
            {esConcluido && " • EXPEDIENTE CERRADO"}
          </p>
        </div>

        <div className="bg-slate-50 px-5 py-4 rounded-2xl border-2 border-slate-100 text-center md:text-right w-full md:w-auto">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">
            {esConcluido ? "Monto Final" : casoSeleccionado?.pagoValidado ? "Acuerdo Actual" : "Presupuesto"}
          </p>
          <div className="flex items-center gap-2 text-2xl font-black text-[#1a1a1a] italic leading-none">
            <DollarSign size={24} className="text-[#D4AF37]" />
            <input
              type="text"
              value={ofertaMonto}
              onChange={(e) => setOfertaMonto(e.target.value)}
              placeholder="0.00"
              className={`w-24 bg-transparent outline-none border-b-2 border-dashed border-slate-200 focus:border-[#D4AF37] ${(casoSeleccionado?.pagoValidado || esConcluido) ? "opacity-50" : ""}`}
              disabled={casoSeleccionado?.pagoValidado || esConcluido}
            />
          </div>
        </div>
      </div>

      {/* REEMPLAZO DEL TEXTAREA POR EL MURO INTELIGENTE */}
      <div className={esConcluido ? "pointer-events-none grayscale-[0.5]" : ""}>
        {esConcluido ? (
          <div className="p-8 bg-slate-100 border-2 border-dashed border-slate-300 rounded-[2.5rem] text-center space-y-2">
            <p className="text-xs font-black text-slate-500 uppercase italic tracking-widest">
              🔒 Comunicación Finalizada
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase italic">
              Este caso ha sido marcado como concluido. El historial es de solo lectura.
            </p>
          </div>
        ) : (
          <MuroGestionAbogado 
            mensaje={mensajeLegal}
            setMensaje={setMensajeLegal}
            onSend={enviarActualizacionYPrecio}
            cargando={cargando}
            esSolvente={casoSeleccionado?.pagoValidado}
            datosCaso={casoSeleccionado}
          />
        )}
      </div>
    </div>
  );
}