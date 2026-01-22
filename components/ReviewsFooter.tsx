"use client";
import { Star } from "lucide-react";

export function ReviewsFooter({ reviews }: { reviews: any[] }) {
  if (!reviews || reviews.length === 0) return null;

  return (
    // Se reduce el padding top (pt-2) para pegarlo a la sección anterior
    <section className="bg-[#1a1a1a] pt-2 pb-12 border-t border-[#D4AF37]/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-10">
          <div className="h-1 w-12 bg-[#D4AF37] mb-4 rounded-full" />
          <h2 className="text-[#D4AF37] text-center text-[10px] font-black uppercase tracking-[0.4em] italic">
            Testimonios de Bóveda Privada
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((resena, i) => (
            <div 
              key={i} 
              className="bg-white/5 border-2 border-white/10 p-8 rounded-[3rem] hover:border-[#D4AF37]/50 transition-all group relative text-center"
            >
              {/* Comillas decorativas en dorado */}
              <span className="absolute top-4 right-6 text-5xl text-[#D4AF37]/10 font-serif">"</span>
              
              {/* Estrellas centradas con justify-center */}
              <div className="flex gap-1 mb-4 justify-center">
                {[...Array(5)].map((_, starI) => (
                  <Star 
                    key={starI} 
                    size={14} 
                    fill={starI < resena.rating ? "#D4AF37" : "none"} 
                    className={starI < resena.rating ? "text-[#D4AF37]" : "text-white/10"}
                  />
                ))}
              </div>
              
              <p className="text-white text-sm italic leading-relaxed mb-6 font-medium relative z-10">
                "{resena.resenaTexto}"
              </p>
              
              {/* Ajuste de alineación del cliente para mantener el centro */}
              <div className="flex flex-col items-center gap-3 border-t border-white/10 pt-5">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#1a1a1a] font-black text-xs shadow-lg">
                  {resena.clienteNombre?.charAt(0) || "C"}
                </div>
                <div>
                  <p className="text-white font-black text-[10px] uppercase tracking-widest">
                    {resena.clienteNombre || "Cliente Verificado"}
                  </p>
                  <p className="text-[#D4AF37] text-[8px] font-bold uppercase italic tracking-tighter">
                    Expediente Finalizado
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}