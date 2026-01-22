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
    <div className="bg-emerald-50 p-8 rounded-[2.5rem] border-2 border-emerald-100 text-center animate-fade-in">
      <p className="text-emerald-700 font-black uppercase text-[10px] tracking-widest italic">
        ¡Gracias por su confianza! Su reseña ha sido publicada.
      </p>
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border-4 border-[#D4AF37] shadow-2xl space-y-6">
      <div className="text-center">
        <p className="text-[#1a1a1a] font-black uppercase text-[10px] tracking-[0.3em] mb-4 italic">
          ¿Cómo calificaría su experiencia en ASF?
        </p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setRating(num)}
              className="transition-transform hover:scale-125 active:scale-90"
            >
              <Star
                size={32}
                fill={num <= rating ? "#D4AF37" : "none"}
                className={num <= rating ? "text-[#D4AF37]" : "text-slate-200"}
              />
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
        placeholder="Cuéntenos brevemente cómo le ayudamos..."
        className="w-full h-24 p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none text-sm italic focus:border-[#D4AF37] resize-none transition-all"
      />

      <button
        disabled={cargando || rating === 0}
        onClick={enviarResena}
        className="w-full bg-[#1a1a1a] text-[#D4AF37] py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all disabled:opacity-30"
      >
        <Send size={16} /> {cargando ? "PROCESANDO..." : "PUBLICAR MI RESEÑA"}
      </button>
    </div>
  );
}