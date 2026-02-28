"use client";
import { useState, useEffect } from "react";
import { Send, AlertTriangle, ShieldCheck, Paperclip, FileUp } from "lucide-react";
import { filterSensitiveInfo } from "@/app/lib/utils/security";

// Props unificadas para el Dashboard Cliente
export function MuroGestionCliente({ onSend, cargando, manejarArchivo, tieneArchivo }: any) {
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const LIMITE = 280;

  // Validación proactiva (Original)
  useEffect(() => {
    if (mensaje.length > 0) {
      const { isSafe } = filterSensitiveInfo(mensaje);
      if (!isSafe) {
        setError("Seguridad TASF: Datos de contacto detectados.");
      } else {
        setError("");
      }
    }
  }, [mensaje]);

  const manejarEnvio = () => {
    // 🛡️ RECUPERADA: Limpieza total de caracteres (Puntos, guiones, paréntesis)
    const textoParaValidar = mensaje.replace(/[\s\.\-\(\),]/g, '');
    
    const v1 = filterSensitiveInfo(mensaje);          
    const v2 = filterSensitiveInfo(textoParaValidar); 

    // BLOQUEO RADICAL (Original)
    if (!v1.isSafe || !v2.isSafe) {
      setError("BLOQUEO DE SEGURIDAD: Se detectaron datos de contacto.");
      return; 
    }

    if (mensaje.length > LIMITE) return;

    setError(""); // Limpieza previa al envío (Original)
    onSend(mensaje);
    setMensaje(""); 
  };

  return (
    <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-[#D4AF37]/20 space-y-6 animate-in fade-in duration-500">
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
          className={`w-full h-32 p-6 bg-slate-50 border-4 rounded-[2.5rem] outline-none text-sm italic resize-none shadow-inner transition-all leading-relaxed
            ${error ? "border-red-400 bg-red-50" : "border-transparent focus:border-[#D4AF37]"}`}
        />
      </div>

      {/* 📎 ZONA DE ADJUNTOS INTEGRADA (UX Mejorada) */}
      <div className={`p-4 rounded-2xl border-2 border-dashed transition-all flex items-center justify-between ${tieneArchivo ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
        <label className="flex items-center gap-3 cursor-pointer w-full">
          <Paperclip size={18} className={tieneArchivo ? 'text-emerald-500' : 'text-[#D4AF37]'} />
          <div className="flex flex-col text-left">
             <span className="text-[9px] font-black uppercase italic text-slate-500">
               {tieneArchivo ? "Documento listo para transmitir" : "¿Anexar documento de prueba?"}
             </span>
             <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest">
               PDF, JPG o PNG (Máximo 10MB)
             </span>
          </div>
          <input type="file" className="hidden" onChange={manejarArchivo} />
        </label>
        {tieneArchivo && <FileUp size={16} className="text-emerald-500 animate-bounce" />}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-[9px] font-black uppercase italic animate-bounce pl-4">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      <button
        // Habilitado si hay mensaje O hay archivo
        disabled={cargando || (!mensaje && !tieneArchivo) || error !== "" || mensaje.length > LIMITE}
        onClick={manejarEnvio}
        className="w-full bg-[#1a1a1a] text-[#D4AF37] py-5 rounded-[2.2rem] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30"
      >
        <Send size={18} /> {cargando ? "TRANSMITIENDO..." : "ENVIAR REPORTE AL ABOGADO"}
      </button>
      
      <p className="text-center text-[7px] text-slate-400 font-bold uppercase tracking-[0.2em] italic leading-relaxed px-10">
        Protocolo de seguridad activo: Su mensaje será filtrado por el sistema TASF
      </p>
    </div>
  );
}