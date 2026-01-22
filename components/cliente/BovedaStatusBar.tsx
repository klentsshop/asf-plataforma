"use client";

import { Clock, CheckCircle2 } from "lucide-react";

type Props = {
  indiceActual: number;
};

export function BovedaStatusBar({ indiceActual }: Props) {
  const pasos = ['analisis', 'respondido', 'gestion', 'concluido'];

  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-[#D4AF37]">
      <h2 className="text-xs font-black text-[#1a1a1a] uppercase mb-12 flex items-center gap-3 tracking-[0.3em] italic">
        <Clock className="text-[#D4AF37]" size={22} /> Estatus de la Defensa Oficial
      </h2>

      <div className="flex justify-between relative px-6 text-left">
        
        {/* Barra base */}
        <div className="absolute h-1 bg-slate-100 top-5 left-12 right-12 z-0"></div>

        {/* Barra activa dorada */}
        <div
          className="absolute h-1 bg-[#D4AF37] top-5 left-12 z-0 transition-all duration-1000 shadow-[0_0_10px_#D4AF37]"
          style={{ width: `${(indiceActual / 3) * 92}%` }}
        ></div>

        {/* Steps */}
        {['Análisis', 'Presupuesto', 'Gestión', 'Concluido'].map((step, i) => {
          const stepKey = i === 0 ? 'analisis' : i === 1 ? 'respondido' : i === 2 ? 'gestion' : 'concluido';
          const isActive = pasos.indexOf(stepKey) <= indiceActual;

          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-4">
              <div
                className={`w-12 h-12 rounded-[1rem] flex items-center justify-center transition-all duration-700 border-4 ${
                  isActive
                    ? 'bg-[#1a1a1a] text-[#D4AF37] border-[#D4AF37] shadow-xl'
                    : 'bg-white text-slate-200 border-slate-100'
                }`}
              >
                {isActive ? <CheckCircle2 size={24} /> : <span className="text-sm font-black">{i + 1}</span>}
              </div>

              <span
                className={`text-[10px] font-black uppercase tracking-widest italic ${
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
