"use client";
import { useState } from "react";
import { Star, Send } from "lucide-react";

export function BovedaResena({ onSend, cargando }: any) {
  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviado, setEnviado] = useState(false);

  const enviarResena = () => {
    if (rating === 0) return alert("Por favor, selecciona una puntuación.");
    onSend({ rating, resenaTexto: comentario });
    setEnviado(true);
  };

  if (enviado) return (
    <div className="bg-emerald-50 p-6 md:p-8 rounded-[2.5rem] border-2 border-emerald-100 text-center animate-fade-in">
      <p className="text-emerald-700 font-black uppercase text-[9px] md:text-[10px] tracking-widest italic leading-relaxed">
        ¡Gracias por su confianza! Su reseña ha sido publicada.
      </p>
    </div>
  );

  return (
    <div className="bg-white p-5 md:p-8 rounded-[2.5rem] border-4 border-[#D4AF37] shadow-2xl space-y-6 mx-auto w-full">
      <div className="text-center">
        <p className="text-[#1a1a1a] font-black uppercase text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] mb-4 italic leading-tight px-2">
          ¿Cómo calificaría su <br className="md:hidden" /> experiencia en ASF?
        </p>
        
        {/* GAP REDUCIDO EN MÓVIL (gap-1) PARA EVITAR DESBORDE */}
        <div className="flex justify-center gap-1 md:gap-3">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setRating(num)}
              className="transition-transform hover:scale-110 active:scale-90 p-1"
            >
              {/* TAMAÑO DINÁMICO: 26 en móvil, 32 en escritorio */}
              <Star
                className={`${num <= rating ? "text-[#D4AF37]" : "text-slate-200"} transition-colors w-7 h-7 md:w-8 md:h-8`}
                fill={num <= rating ? "#D4AF37" : "none"}
              />
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="Cuéntenos brevemente cómo le ayudamos..."
        className="w-full h-24 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none text-[11px] md:text-sm italic focus:border-[#D4AF37] resize-none transition-all placeholder:text-slate-300"
      />

      <button
        disabled={cargando || rating === 0}
        onClick={enviarResena}
        className="w-full bg-[#1a1a1a] text-[#D4AF37] py-4 rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all disabled:opacity-30 active:scale-95 shadow-xl border-2 border-[#D4AF37]/20"
      >
        <Send size={14} className="md:w-4 md:h-4" /> 
        {cargando ? "PROCESANDO..." : "PUBLICAR MI RESEÑA"}
      </button>
    </div>
  );
}