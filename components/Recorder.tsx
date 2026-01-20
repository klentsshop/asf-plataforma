"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Mic, Square, Loader2, Play, CheckCircle2 } from "lucide-react";

export function Recorder({
  grabando,
  detenerGrabacion,
  iniciarGrabacion,
  audioUrl,
  cargando,
}: any) {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const aliveRef = useRef(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Onda cifrada premium (estática)
  const bars = useMemo(() => {
    return Array.from({ length: 18 }, () => Math.floor(Math.random() * 18) + 6);
  }, []);

  useEffect(() => {
    setMounted(true);
    aliveRef.current = true;
    return () => { aliveRef.current = false; };
  }, []);

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setIsPlaying(false);
      };
      audioRef.current = audio;
    } else {
      audioRef.current = null;
    }
  }, [audioUrl]);

  const handleGrabButton = (e: any) => {
    e.preventDefault();
    if (!aliveRef.current || cargando) return;
    grabando ? detenerGrabacion() : iniciarGrabacion();
  };

  const handlePlay = () => {
    if (!audioRef.current) return;
    try {
      setIsPlaying(true);
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } catch (e) {
      console.log("Error reproduciendo audio", e);
    }
  };

  if (!mounted) {
    return (
      <div className="w-full h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl animate-pulse" />
    );
  }

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-300">

      {/* BOTÓN PRINCIPAL */}
      <button
        type="button"
        disabled={cargando}
        onClick={handleGrabButton}
        className={`w-full p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300
          ${grabando ? 'border-red-500 bg-red-50 animate-pulse' :
            audioUrl ? 'border-emerald-500 bg-emerald-50' :
            'border-[#D4AF37]/40 hover:bg-[#D4AF37]/5'}
          ${cargando ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform
            ${grabando ? 'bg-red-500 text-white scale-110' :
              audioUrl ? 'bg-emerald-500 text-white' :
              'bg-[#D4AF37]/10 text-[#D4AF37]'}
        `}
        >
          {cargando ? (
            <Loader2 className="animate-spin w-6 h-6" />
          ) : grabando ? (
            <Square size={20} fill="white" />
          ) : audioUrl ? (
            <CheckCircle2 size={24} />
          ) : (
            <Mic size={24} />
          )}
        </div>

        <span className={`text-[10px] font-black tracking-widest uppercase
          ${grabando ? 'text-red-600' :
            audioUrl ? 'text-emerald-700' :
            'text-[#00244C]'}`}
        >
          {cargando ? "Procesando audio..." :
            grabando ? "Grabando... (Clic para detener)" :
              audioUrl ? "Relato Cargado con Éxito" :
                "Grabar Relato de Voz"}
        </span>
      </button>

      {/* REPRODUCTOR FINAL */}
      {audioUrl && !grabando && aliveRef.current && (
        <div className="bg-white p-3 rounded-2xl flex items-center gap-3 border border-emerald-200 shadow-sm animate-in slide-in-from-top-2">
          
          {/* PLAY */}
          <div
            onClick={handlePlay}
            className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm cursor-pointer hover:scale-105 transition"
          >
            <Play size={14} fill="white" />
          </div>

          {/* ONDA PREMIUM */}
          <div className="flex-1 flex gap-1 items-end px-2 h-8">
            {bars.map((h, i) => (
              <div
                key={i}
                style={{ height: h }}
                className={`w-1 rounded-full transition-all duration-200
                  ${isPlaying
                    ? 'bg-emerald-500 opacity-90 scale-y-[1.05]'
                    : 'bg-emerald-300 opacity-70 scale-y-[1]'
                  }
                `}
              />
            ))}
          </div>

          {/* SELLO LEGAL */}
          <div className="flex flex-col items-end ml-1">
            <span className="text-[9px] font-black text-emerald-600 uppercase italic leading-none">
              Cifrado
            </span>
            <span className="text-[7px] text-emerald-400 font-bold uppercase tracking-tighter">
              Seguro
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
