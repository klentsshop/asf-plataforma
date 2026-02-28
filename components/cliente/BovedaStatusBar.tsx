"use client";

import { Clock, CheckCircle2 } from "lucide-react";

type Props = {
  indiceActual: number;
};

export function BovedaStatusBar({ indiceActual }: Props) {
  const pasos = ['analisis', 'respondido', 'gestion', 'concluido'];

  return (
    <div className="bg-white p-6 md:p-10 rounded-[3rem] shadow-2xl border-4 border-[#D4AF37] w-full overflow-hidden">
      <h2 className="text-[10px] md:text-xs font-black text-[#1a1a1a] uppercase mb-8 md:mb-12 flex items-center gap-3 tracking-[0.3em] italic">
        <Clock className="text-[#D4AF37]" size={22} /> Estado de mi Caso
      </h2>

      <div className="flex justify-between items-start relative px-2 md:px-6">
        
        {/* Barra base (Alineación corregida al centro del icono) */}
        <div className="absolute h-1 bg-slate-100 top-5 md:top-6 left-10 right-10 z-0"></div>

        {/* Barra activa dorada (Cálculo dinámico preciso) */}
        <div
          className="absolute h-1 bg-[#D4AF37] top-5 md:top-6 left-10 z-0 transition-all duration-1000 shadow-[0_0_10px_#D4AF37]"
          style={{ width: `calc(${(indiceActual / 3) * 100}% - ${(indiceActual / 3) * 20}px)` }}
        ></div>

        {/* Steps */}
        {['Análisis', 'Presupuesto', 'Gestión', 'Concluido'].map((step, i) => {
          const stepKey = i === 0 ? 'analisis' : i === 1 ? 'respondido' : i === 2 ? 'gestion' : 'concluido';
          const isActive = pasos.indexOf(stepKey) <= indiceActual;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-3 md:gap-4 w-1/4">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-[1rem] flex items-center justify-center transition-all duration-700 border-4 shrink-0 ${
                  isActive
                    ? 'bg-[#1a1a1a] text-[#D4AF37] border-[#D4AF37] shadow-xl'
                    : 'bg-white text-slate-200 border-slate-100'
                }`}
              >
                {isActive ? <CheckCircle2 size={20} className="md:w-6 md:h-6" /> : <span className="text-xs md:text-sm font-black">{i + 1}</span>}
              </div>

              <span
                className={`text-[8px] md:text-[10px] font-black uppercase tracking-tighter md:tracking-widest italic text-center leading-tight ${
                  isActive ? 'text-[#1a1a1a]' : 'text-slate-300'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
