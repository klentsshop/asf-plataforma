"use client";
import { useState, useEffect } from "react";
import { Send, AlertTriangle, ShieldCheck, Paperclip, FileUp, Lock, Wallet2 } from "lucide-react";
import { filterSensitiveInfo } from "@/app/lib/utils/security";

// ✅ Props unificadas con la nueva prop pagoValidado
export function MuroGestionCliente({ onSend, cargando, manejarArchivo, tieneArchivo, pagoValidado }: any) {
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const LIMITE = 280;

  // 🛡️ Validación proactiva (Original e intacta)
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
    // 🛡️ SEGURIDAD TASF: Limpieza y validación (Intacta)
    const textoParaValidar = mensaje.replace(/[\s\.\-\(\),]/g, '');
    const v1 = filterSensitiveInfo(mensaje);          
    const v2 = filterSensitiveInfo(textoParaValidar); 

    if (!v1.isSafe || !v2.isSafe) {
      setError("BLOQUEO DE SEGURIDAD: Se detectaron datos de contacto.");
      return; 
    }

    if (mensaje.length > LIMITE) return;

    // 🚀 LÓGICA DE ENVÍO CORREGIDA
    // Si hay archivo pero no mensaje, igual permitimos enviar (o viceversa)
    if (mensaje || tieneArchivo) {
      setError(""); 
      // Enviamos el mensaje al padre
      onSend(mensaje); 
      // Limpiamos el campo de texto local
      setMensaje(""); 
      // Nota: 'manejarArchivo' ya debió haber subido el archivo al estado del padre
      // al momento de seleccionarlo.
    }
  };

  // 🛡️ LÓGICA DE BLOQUEO POR PAGO (Paywall TASF)
  if (!pagoValidado) {
    return (
      <div className="bg-[#1a1a1a] p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border-4 border-[#D4AF37] text-center relative overflow-y-auto max-h-[85vh] md:max-h-none animate-in fade-in zoom-in-95 duration-700">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        
        <div className="w-20 h-20 bg-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-2xl">
          <Lock className="text-[#1a1a1a]" size={32} />
        </div>

        <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tighter mb-2">
          Canal <span className="text-[#D4AF37]">Restringido</span>
        </h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-8 italic">
          Validación de Honorarios Pendiente
        </p>

        <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5 md:p-8 mb-8 text-left space-y-6">
          <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.2em] italic border-b border-[#D4AF37]/20 pb-2">
            Información de Depósito Oficial:
          </p>
          
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-[13px] md:text-[15px] text-white font-black italic leading-tight break-all block">Banco de Venezuela ( Cuenta corriente No. <br className="md:hidden" /> 01020215910000228578)</span>
              <span className="text-slate-400 text-[12px] md:text-[14px] font-medium tracking-tight ">Liz Pineda CI: 16268588</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-[13px] md:text-[15px] text-white font-black italic leading-tight">Bancolombia (Cuenta de Ahorros No. 10800008109)</span>
              <span className="text-slate-400 text-[12px] md:text-[14px] font-medium tracking-tight">Liz Pineda Pasaporte: 5005042972</span>
            </div>
          </div>
        </div>

        <p className="text-slate-500 text-[9px] font-bold uppercase italic leading-relaxed mb-8 px-4">
          Una vez realizado el pago, su abogado será habilitado para iniciar la gestión técnica de su caso.
        </p>

        <div className="flex items-center justify-center gap-2 text-[#D4AF37] opacity-60 animate-pulse">
          <Wallet2 size={14} />
          <span className="text-[8px] font-black uppercase tracking-widest">Esperando confirmación administrativa</span>
        </div>
      </div>
    );
  }

  // 🔓 RETORNO ORIGINAL (Solo si pagoValidado === true)
  return (
    <div className="bg-white p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-2xl border-4 border-[#D4AF37]/20 space-y-4 md:space-y-6 animate-in fade-in duration-500">
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
          className={`w-full h-32 p-4 md:p-6 bg-slate-50 border-4 rounded-[1.5rem] md:rounded-[2.5rem] outline-none text-sm italic resize-none shadow-inner transition-all leading-relaxed
            ${error ? "border-red-400 bg-red-50" : "border-transparent focus:border-[#D4AF37]"}`}
        />
      </div>

      <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl border-2 border-dashed transition-all flex items-center justify-between ${tieneArchivo ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
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
  // 🔥 CAMBIO AQUÍ: Eliminamos "|| !tieneArchivo" para que el texto sea OBLIGATORIO
  disabled={cargando || !mensaje.trim() || error !== "" || mensaje.length > LIMITE}
  onClick={manejarEnvio}
  className="w-full bg-[#1a1a1a] text-[#D4AF37] py-5 rounded-[2.2rem] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30"
>
  <Send size={18} /> 
  {/* ✍️ CAMBIO AQUÍ: Un texto más claro para diferenciarlo del pago */}
  {cargando ? "PROCESANDO REPORTE..." : "ENVIAR REPORTE AL ABOGADO"}
</button>
      
      <p className="text-center text-[7px] text-slate-400 font-bold uppercase tracking-[0.2em] italic leading-relaxed px-10">
        Protocolo de seguridad activo: Su mensaje será filtrado por el sistema TASF
      </p>
    </div>
  );
}