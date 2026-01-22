"use client";

import { Loader2, Search, FileText, MapPin, ChevronLeft } from "lucide-react";

type BandejaProps = {
  cargando: boolean;
  casos: any[];
  manejarGestionar: (c: any) => void;
};

export function Bandeja({ cargando, casos, manejarGestionar }: BandejaProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none mb-8">
        Casos <span className="text-[#D4AF37]"></span>
      </h1>

      {cargando ? (
        /* LOADER */
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
          <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest italic animate-pulse">
            Consultando Matchmaker...
          </p>
        </div>
      ) : casos.length === 0 ? (
        /* EMPTY STATE */
        <div className="bg-white p-12 md:p-20 rounded-[3rem] border-4 border-dashed border-slate-100 text-center flex flex-col items-center">
          <Search className="text-slate-200 mb-4" size={60} />
          <p className="text-slate-400 font-black uppercase italic tracking-widest text-sm">
            No hay nuevos casos en su zona
          </p>
        </div>
      ) : (
        /* LISTA DE CASOS */
        <div className="space-y-4">
          {casos.map((s) => (
            <div
              key={s._id}
              className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between hover:border-[#D4AF37] transition-all group gap-6"
            >
              {/* BLOQUE DE INFORMACIÓN */}
              <div className="flex items-center gap-6 text-left w-full md:w-auto">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#D4AF37] group-hover:bg-[#1a1a1a] transition-all duration-500 shadow-inner shrink-0">
                  <FileText size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-black text-[#1a1a1a] text-lg uppercase leading-tight italic truncate">
                    {s.categoria}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
                    <MapPin size={12} className="text-[#D4AF37]" /> {s.ubicacion}
                  </p>
                </div>
              </div>

              {/* BOTÓN DE ACCIÓN: Se adapta al ancho en móvil */}
              <button
                onClick={() => manejarGestionar(s)}
                className="w-full md:w-auto bg-[#1a1a1a] text-[#D4AF37] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-white transition-all italic shadow-lg active:scale-95"
              >
                ANALIZAR
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}