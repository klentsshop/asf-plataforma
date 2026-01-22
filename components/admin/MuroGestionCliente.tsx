"use client";
import { useState, useEffect } from "react";
import { Send, AlertTriangle, ShieldCheck } from "lucide-react";
import { filterSensitiveInfo } from "@/app/lib/utils/security";

export function MuroGestionCliente({ onSend, cargando }: any) {
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const LIMITE = 280;

  // Validación proactiva mientras el cliente escribe
  useEffect(() => {
    if (mensaje.length > 0) {
      const { isSafe } = filterSensitiveInfo(mensaje);
      if (!isSafe) {
        setError("Seguridad ASF: Datos de contacto detectados.");
      } else {
        setError("");
      }
    }
  }, [mensaje]);

  const manejarEnvio = () => {
    // 1. Limpieza total de caracteres no alfabéticos para la prueba de seguridad
    // Quitamos espacios, puntos, guiones, comas y paréntesis
    const textoParaValidar = mensaje.replace(/[\s\.\-\(\),]/g, '');
    
    const v1 = filterSensitiveInfo(mensaje);          // Validación texto original
    const v2 = filterSensitiveInfo(textoParaValidar); // Validación texto compacto

    // 2. BLOQUEO RADICAL: Si cualquiera de las dos falla, NO HAY ENVÍO
    if (!v1.isSafe || !v2.isSafe) {
      setError("BLOQUEO DE SEGURIDAD: Se detectaron datos de contacto.");
      return; // Aquí matamos el proceso, el mensaje nunca sale hacia Sanity
    }

    if (mensaje.length > LIMITE) return;

    setError("");
    onSend(mensaje);
    setMensaje(""); 
  };
  return (
    <div className="mt-10 pt-10 border-t-2 border-dashed border-slate-200 space-y-5">
      <div className="flex justify-between items-center px-2">
        <p className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-widest italic flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#D4AF37]" /> Canal de Comunicación Oficial
        </p>
        <span className={`text-[10px] font-black italic ${mensaje.length > LIMITE ? 'text-red-500' : 'text-slate-400'}`}>
          {mensaje.length} / {LIMITE}
        </span>
      </div>
      
      <div className="relative">
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escriba su mensaje al abogado... (Sea breve y técnico)"
          className={`w-full h-32 p-6 bg-white border-4 rounded-[2.5rem] outline-none text-sm italic resize-none shadow-inner transition-all leading-relaxed
            ${error ? "border-red-400 bg-red-50" : "border-slate-100 focus:border-[#D4AF37]"}`}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-[9px] font-black uppercase italic animate-bounce pl-4">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      <button
        disabled={cargando || !mensaje || error !== "" || mensaje.length > LIMITE}
        onClick={manejarEnvio}
        className="w-full bg-[#1a1a1a] text-[#D4AF37] py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl transition-all italic border-2 border-[#D4AF37]/20 hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Send size={18} /> {cargando ? "TRANSMITIENDO..." : "ENVIAR MENSAJE AL ABOGADO"}
      </button>
      
      <p className="text-center text-[8px] text-slate-400 font-bold uppercase tracking-widest italic">
        Su mensaje será filtrado por el protocolo de seguridad ASF
      </p>
    </div>
  );
}