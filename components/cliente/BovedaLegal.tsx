"use client";

import { MessageSquare, AlertCircle, Loader2 } from "lucide-react";
// CORRECCIÓN DE RUTA: Subimos un nivel para entrar a la carpeta admin
import { MuroGestionCliente } from "../admin/MuroGestionCliente";
import { BovedaResena } from "./BovedaResena"; // Importamos el nuevo componente

type Props = {
  datosCaso: any;
  subiendoArchivo: boolean;
  subirComprobante: (e: any) => void;
  indiceActual: number;
  enviarMensajeAlAbogado: (mensaje: string) => void; 
  enviarResenaFinal: (resena: { rating: number; resenaTexto: string }) => void; // Nueva Prop
};

export function BovedaLegal({ 
  datosCaso, 
  subiendoArchivo, 
  subirComprobante, 
  indiceActual, 
  enviarMensajeAlAbogado,
  enviarResenaFinal // Recibimos la prop
}: Props) {
  return (
    <div className="bg-white p-5 md:p-10 rounded-[3rem] shadow-2xl border-4 border-[#D4AF37] relative overflow-hidden text-left">
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full -mr-16 -mt-16 blur-3xl" />

      <h2 className="text-[10px] md:text-xs font-black uppercase mb-6 md:mb-10 flex items-center gap-3 tracking-[0.2em] md:tracking-[0.3em] text-[#1a1a1a] italic leading-tight">
        <MessageSquare size={20} className="text-[#D4AF37] shrink-0" /> 
        <span>Comunicación del <br className="md:hidden" /> Departamento Legal</span>
      </h2>

      <div className="bg-[#F9FAFB] border-4 border-[#D4AF37]/10 p-5 md:p-10 rounded-[2.5rem] relative z-10 text-left">

        {/* Header comunicación */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b-2 border-slate-200 pb-5 gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className={`w-3 h-3 rounded-full animate-ping shrink-0 ${indiceActual >= 2 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            <p className="text-[#1a1a1a] text-[10px] md:text-xs font-black uppercase tracking-widest italic text-left leading-none">
              Dictamen Técnico Actualizado
            </p>
          </div>
          <span className="text-[8px] md:text-[9px] text-[#D4AF37] font-black uppercase tracking-widest italic bg-[#1a1a1a] px-3 py-1 rounded-full border border-[#D4AF37]/30">
            Cifrado AES-256
          </span>
        </div>

        {/* Mensaje legal */}
        <p className="text-slate-700 text-sm md:text-base leading-relaxed font-bold italic mb-12 text-left">
          "{datosCaso?.actualizacion || 
          "El departamento legal está procesando la información técnica de su caso bajo estrictos protocolos de confidencialidad."}"
        </p>

        {/* Pago - Presupuesto */}
        {datosCaso?.presupuestoEstimado && !datosCaso?.pagoValidado && (
          <div className="pt-10 border-t-2 border-dashed border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-left w-full md:w-auto">
              <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-2 italic text-left">
                Honorarios de Gestión
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#1a1a1a]">$</span>
                <p className="text-4xl md:text-5xl font-black text-[#1a1a1a] tracking-tighter">
                  {datosCaso.presupuestoEstimado}
                </p>
              </div>
            </div>

            <label className="w-full md:w-auto bg-[#1a1a1a] text-white hover:text-[#D4AF37] px-6 md:px-10 py-5 rounded-2xl text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer shadow-2xl italic border-2 border-[#D4AF37] hover:scale-[1.05] active:scale-95 text-center flex items-center justify-center gap-3">
              {subiendoArchivo ? (
                <><Loader2 className="animate-spin" size={18} /> PROCESANDO...</>
              ) : (
                "SUBIR COMPROBANTE DE PAGO"
              )}
              <input type="file" className="hidden" onChange={subirComprobante} accept="image/*" disabled={subiendoArchivo} />
            </label>
          </div>
        )}

        {/* Advertencia pago en revisión */}
        {datosCaso?.comprobantePago && !datosCaso?.pagoValidado && (
          <div className="mt-8 bg-amber-500/10 border-2 border-amber-500/20 p-4 rounded-2xl flex items-center gap-3 animate-pulse text-left">
            <AlertCircle className="text-amber-500 shrink-0" size={18} />
            <p className="text-[8px] md:text-[9px] text-amber-600 font-black uppercase italic tracking-widest text-left leading-tight">
              Pago en revisión por el Departamento Administrativo.
            </p>
          </div>
        )}

        {/* BLOQUEO DE SEGURIDAD / MURO DEL CLIENTE */}
        <MuroGestionCliente 
          onSend={enviarMensajeAlAbogado} 
          cargando={subiendoArchivo} 
        />

        {/* SECCIÓN DE RESEÑA: Solo aparece si el estado es concluido y no hay rating previo */}
        {datosCaso?.estado === 'concluido' && !datosCaso?.rating && (
          <div className="mt-10 pt-6 md:pt-10 border-t-4 border-[#D4AF37]/20 w-full">
            <BovedaResena 
              onSend={enviarResenaFinal} 
              cargando={subiendoArchivo} 
            />
          </div>
        )}
      </div>
    </div>
  );
}