"use client";
import { useState, useEffect } from "react";
import { Send, AlertTriangle, Sparkles } from "lucide-react";
import { filterSensitiveInfo } from "../../app/lib/utils/security";

export function MuroGestionAbogado({ mensaje, setMensaje, onSend, cargando, esSolvente, datosCaso }: any) {
  const [error, setError] = useState("");

  // 📝 ESTRUCTURA DE LA PLANTILLA OFICIAL TASF
  const plantilla = `Buen día ${datosCaso?.cliente?.nombre || "Estimado Cliente"}, con mucho gusto *Tu Abogado Sin Fronteras* te asistirá en tu caso.

Las fases del proceso son las siguientes: 
1. 
2. 

Tiempo aproximado de entrega: 
Valor total: 
Valor aproximado: `;

  // ✨ AUTO-CARGA: Solo para Asesoría Gratuita y solo si el campo está vacío
  useEffect(() => {
    if (!esSolvente && mensaje === "") {
      setMensaje(plantilla);
    }
  }, [esSolvente]);

  // REFUERZO 1: Validación proactiva (Mantenida línea por línea)
  useEffect(() => {
    if (mensaje.length > 5) {
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
    // REFUERZO 2: Limpieza radical antes de disparar
    const mensajeLimpio = mensaje.replace(/[\s\.\-\(\),]/g, ''); 
    const v1 = filterSensitiveInfo(mensaje);
    const v2 = filterSensitiveInfo(mensajeLimpio);

    if (!v1.isSafe || !v2.isSafe) {
      setError("BLOQUEO DE SEGURIDAD: Se detectaron datos prohibidos.");
      return; 
    }

    setError("");
    onSend(); 
  };

  return (
    <div className="space-y-4 text-left">
      {!esSolvente && (
        <div className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full w-fit animate-pulse">
          <Sparkles size={12} className="text-[#D4AF37]" />
          <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest italic">
            Protocolo de Asesoría Gratuita Activado
          </span>
        </div>
      )}

      <textarea
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        placeholder={esSolvente ? "Instrucciones técnicas para el cliente..." : "Redacte la propuesta legal, Colega, la aceptación de este caso depende de su claridad técnica inicial. Desglose los puntos clave de su estrategia, justifique sus honorarios en base a la complejidad detectada y ofrezca una ruta de acción clara. Recuerde que la ambigüedad en esta etapa es la principal causa de desistimiento por parte del cliente. Sea explicativo, técnico y convincente."}
        className={`w-full h-80 p-8 border-2 rounded-[2.5rem] outline-none text-sm italic shadow-inner transition-all leading-relaxed resize-none
          ${error ? "bg-red-50 border-red-200" : "bg-slate-50 border-slate-100 focus:border-[#D4AF37] focus:bg-white"}`}
      />

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-[10px] font-black uppercase italic animate-bounce pl-4">
          <AlertTriangle size={14} /> {error}
        </div>
      )}

      <button
        // REFUERZO 3: Bloqueo físico (Mantenido)
        disabled={cargando || !mensaje || error !== ""}
        onClick={validarYEnviar}
        className="w-full bg-[#1a1a1a] text-[#D4AF37] py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl transition-all italic border-2 border-[#D4AF37]/20 hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Send size={18} /> {cargando ? "SINCRONIZANDO..." : "NOTIFICAR AVANCE TÉCNICO"}
      </button>

      {!esSolvente && (
        <p className="text-[8px] text-slate-400 text-center uppercase font-bold italic tracking-widest px-10 leading-relaxed">
          La estructura superior es obligatoria para la validez de la asesoría gratuita TASF
        </p>
      )}
    </div>
  );
}