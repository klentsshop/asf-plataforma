"use client";

import { Loader2 } from "lucide-react";

type ExpedientesProps = {
  cargando: boolean;
  expedientesConcluidos: any[];
  manejarGestionar: (c: any) => void;
};

export function Expedientes({
  cargando,
  expedientesConcluidos,
  manejarGestionar
}: ExpedientesProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none mb-8">
        Procesos <span className="text-[#D4AF37]">Concluidos</span>
      </h1>

      {cargando ? (
        /* LOADER ORIGINAL */
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {expedientesConcluidos.length === 0 ? (
            /* EMPTY STATE ORIGINAL */
            <div className="md:col-span-2 bg-white p-20 rounded-[3rem] text-center border-4 border-dashed border-slate-100">
              <p className="text-slate-400 font-black uppercase italic">
                No tiene expedientes concluidos aún
              </p>
            </div>
          ) : (
            /* LISTA ORIGINAL */
            expedientesConcluidos.map((e) => (
              <div
                key={e._id}
                className="bg-white p-8 rounded-[3rem] shadow-xl border border-emerald-100 relative group overflow-hidden opacity-80"
              >
                <div className="absolute top-0 right-0 px-6 py-2 bg-emerald-500 text-white text-[8px] font-black uppercase italic tracking-widest">
                  CONCLUIDO
                </div>

                <h4 className="text-2xl font-black text-slate-700 uppercase italic mb-1">
                  {e.nombreCliente}
                </h4>

                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">
                  Expediente: {e.codigoExpediente}
                </p>

                <button
                  onClick={() => manejarGestionar(e)}
                  className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl text-[9px] font-black uppercase italic tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                >
                  Ver Historial Completo
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
