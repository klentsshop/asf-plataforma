"use client";
import { useState, useEffect } from "react";
import { Send, AlertTriangle, Sparkles } from "lucide-react";
import { filterSensitiveInfo } from "../../app/lib/utils/security";

// 🟢 Mantenemos todas las props e inyectamos ofertaMonto para la validación
export function MuroGestionAbogado({ mensaje, setMensaje, onSend, cargando, esSolvente, datosCaso, ofertaMonto }: any) {
  const [error, setError] = useState("");

  // 📝 ESTRUCTURA DE LA PLANTILLA OFICIAL TASF (Recuperada al 100%)
  const plantilla = `Buen día ${datosCaso?.cliente?.nombre || "Estimado Cliente"}, con mucho gusto *Tu Abogado Sin Fronteras* te asistirá en tu caso.

Las fases del proceso son las siguientes: 
1. 
2. 
3.....

Tiempo aproximado de entrega: 
Valor total: Dependerá del precio del (vehículo, inmueble, trámite,etc) 
Valor aproximado: `;

  // ✨ AUTO-CARGA: Solo para Asesoría Gratuita y solo si el campo está vacío
  useEffect(() => {
    if (!esSolvente && mensaje === "") {
      setMensaje(plantilla);
    }
  }, [esSolvente]);

  // REFUERZO 1: Validación proactiva (Sin cambios en la lógica para evitar bucles)
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
    // 🛡️ CANDADO DE HONORARIOS: No permite enviar si el monto es inválido
    const montoInvalido = !ofertaMonto || ofertaMonto === "0" || ofertaMonto === "0.00" || ofertaMonto.trim() === "";
    
    if (!esSolvente && montoInvalido) {
        setError("ERROR: Debe definir un presupuesto válido en el recuadro superior antes de notificar al cliente.");
        return;
    }

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
        <div className="space-y-4">
          {/* 🏛️ INDICADOR DE PROTOCOLO TASF */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full w-fit animate-pulse">
            <Sparkles size={12} className="text-[#D4AF37]" />
            <span className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest italic">
              Protocolo de Asesoría Gratuita Activado
            </span>
          </div>

          {/* 💡 MENSAJE MOTIVADOR E INSTRUCCIÓN TÉCNICA (Recuperado texto original) */}
          <div className="px-8 py-5 bg-slate-100/50 border-l-4 border-[#D4AF37] rounded-r-[1.5rem] shadow-sm">
            <p className="text-[10px] text-slate-600 leading-relaxed italic">
              <span className="font-black text-[#D4AF37] uppercase tracking-tighter mr-1">Instrucción Colega:</span>
              Redacte la propuesta legal, la aceptación de este caso depende de su claridad técnica inicial. Desglose los puntos clave de su estrategia, justifique sus honorarios en base a la complejidad detectada y ofrezca una ruta de acción clara. Recuerde que la ambigüedad en esta etapa es la principal causa de desistimiento por parte del cliente. Sea explicativo, técnico y convincente.
            </p>
          </div>
        </div>
      )}

      <textarea
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        // Placeholder original recuperado íntegramente
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
        // 🟢 BLOQUEO FÍSICO: Se añade la condición de ofertaMonto al disabled original
        disabled={cargando || !mensaje || error !== "" || (!esSolvente && (!ofertaMonto || ofertaMonto === "0" || ofertaMonto === "0.00"))}
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