"use client";
import { useState, useEffect } from "react";
import { Send, AlertTriangle } from "lucide-react";
import { filterSensitiveInfo } from "../../app/lib/utils/security";

export function MuroGestionAbogado({ mensaje, setMensaje, onSend, cargando, esSolvente }: any) {
  const [error, setError] = useState("");

  // REFUERZO 1: Validación proactiva mejorada
  useEffect(() => {
    if (mensaje.length > 5) {
      // Validamos tanto el original como una versión sin caracteres especiales
      const textoCompacto = mensaje.replace(/[\s\.\-\(\),]/g, '');
      const { isSafe: originalSafe } = filterSensitiveInfo(mensaje);
      const { isSafe: compactoSafe } = filterSensitiveInfo(textoCompacto);

      if (!originalSafe || !compactoSafe) {
        setError("Detección de Seguridad: No se permite compartir datos de contacto.");
      } else {
        setError("");
      }
    }
  }, [mensaje]);

  const validarYEnviar = () => {
    // REFUERZO 2: Limpieza radical antes de disparar a Sanity
    // Esto detecta 3.2.0.5.6.7... o (320) 567-...
    const mensajeLimpio = mensaje.replace(/[\s\.\-\(\),]/g, ''); 
    
    const v1 = filterSensitiveInfo(mensaje);          // Validación texto original
    const v2 = filterSensitiveInfo(mensajeLimpio);    // Validación texto ultra-compacto

    if (!v1.isSafe || !v2.isSafe) {
      setError("BLOQUEO DE SEGURIDAD: Se detectaron datos prohibidos.");
      return; // MUERTE DEL PROCESO: No se llama a onSend()
    }

    setError("");
    onSend(); 
  };

  return (
    <div className="space-y-4">
      <textarea
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        placeholder={esSolvente ? "Instrucciones técnicas para el cliente..." : "Redacte la propuesta legal..."}
        className={`w-full h-64 p-8 border-2 rounded-[2.5rem] outline-none text-sm italic shadow-inner transition-all leading-relaxed text-left resize-none
          ${error ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-100 focus:border-[#D4AF37] focus:bg-white"}`}
      />

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-[10px] font-black uppercase italic animate-bounce pl-4">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      <button
        // REFUERZO 3: Bloqueo físico del botón
        disabled={cargando || !mensaje || error !== ""}
        onClick={validarYEnviar}
        className="w-full bg-[#1a1a1a] text-[#D4AF37] py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl transition-all italic border-2 border-[#D4AF37]/20 hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Send size={18} /> {cargando ? "SINCRONIZANDO..." : "NOTIFICAR AVANCE TÉCNICO"}
      </button>
    </div>
  );
}