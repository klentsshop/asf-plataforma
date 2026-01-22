"use client";

import { Loader2, MessageSquare } from "lucide-react";

type MisClientesProps = {
  cargando: boolean;
  clientesActivos: any[];
  manejarGestionar: (c: any) => void;
};

export function MisClientes({ cargando, clientesActivos, manejarGestionar }: MisClientesProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none mb-8">
        Procesos <span className="text-[#D4AF37]">Activos</span>
      </h1>

      {cargando ? (
        /* LOADER */
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
        </div>
      ) : clientesActivos.length === 0 ? (
        /* EMPTY STATE */
        <div className="md:col-span-2 bg-white p-12 md:p-20 rounded-[3rem] text-center border-4 border-dashed border-slate-100">
          <p className="text-slate-400 font-black uppercase italic">
            Esperando validación de pagos administrativos
          </p>
        </div>
      ) : (
        /* LISTA */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {clientesActivos.map((c) => (
            <div
              key={c._id}
              className="bg-white p-6 md:p-8 rounded-[3rem] shadow-xl border border-emerald-100 relative group overflow-hidden transition-all hover:border-emerald-500"
            >
              <div className="absolute top-0 right-0 px-4 md:px-6 py-2 text-[7px] md:text-[8px] font-black uppercase italic tracking-widest bg-emerald-500 text-white shadow-lg">
                Cliente Solvente
              </div>

              <h4 className="text-xl md:text-2xl font-black text-[#1a1a1a] uppercase italic mb-1 truncate pr-10 md:pr-0">
                {c.nombreCliente || "Cliente Registrado"}
              </h4>

              <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">
                {c.categoria} • ID: {c._id.substring(0, 6).toUpperCase()}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => manejarGestionar(c)}
                  className="flex-1 bg-[#1a1a1a] text-[#D4AF37] py-4 rounded-2xl text-[9px] font-black uppercase italic tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg"
                >
                  Gestionar Bóveda
                </button>

                <button
                  className="px-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-blue-500 transition-colors shadow-inner"
                >
                  <MessageSquare size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}