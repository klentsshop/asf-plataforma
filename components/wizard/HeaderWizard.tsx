"use client";
import { Star, ChevronLeft, Loader2 } from "lucide-react";

export function HeaderWizard({ paso, isPending, navegarPaso }: any) {
  return (
    <section className={`relative transition-all duration-700 ${paso === 1 ? 'pt-6 pb-20' : 'py-8'} bg-[#1a1a1a] overflow-hidden border-b-4 border-[#D4AF37]/50`}>
      <div className="container mx-auto px-6 text-center relative z-10">
        
        {/* TÍTULO DINÁMICO */}
        <h1 className="text-3xl md:text-6xl font-black text-white mb-1 tracking-tighter uppercase text-center italic">
          {paso < 5 ? "¿Qué trámite " : paso === 7 ? "Asesoría " : "Validación "} 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E3B4] to-[#B8860B]">
            {paso < 5 ? "desea gestionar?" : paso === 7 ? "Especializada" : "en curso"}
          </span>
        </h1>
        
        {/* BLOQUE DE LAS ESTRELLAS ORIGINALES (Solo en Paso 1) */}
        {paso === 1 && (
          <div className="relative inline-block mt-0 text-center w-full">
            <p className="text-slate-400 text-xs md:text-base font-bold tracking-[0.3em] uppercase italic mb-10 text-center">
              Servicios Jurídicos Premium en Venezuela
            </p>
            
            {/* EL ARCO DE 8 ESTRELLAS BLANCAS - Recuperado del código original */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[500px] h-24 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <Star 
                  key={i} 
                  className="absolute text-white fill-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]" 
                  size={18} 
                  style={{ 
                    left: `${(i * 14.2)}%`, 
                    top: `${20 + Math.pow(i - 3.5, 2) * 5}%`, 
                    opacity: 1 - (Math.abs(i - 3.5) * 0.08) 
                  }} 
                />
              ))}
            </div>
          </div>
        )}

        {/* BOTÓN VOLVER */}
        {(paso > 1 && paso < 5) || paso === 7 ? (
          <button 
            onClick={() => navegarPaso(paso === 7 ? 1 : paso - 1)} 
            className="mt-4 text-[#D4AF37] text-xs font-black flex items-center justify-center gap-2 mx-auto uppercase tracking-widest hover:opacity-70 transition"
          >
            {isPending ? <Loader2 className="animate-spin w-4 h-4" /> : <ChevronLeft size={16} />} Volver
          </button>
        ) : null}
      </div>
    </section>
  );
}