"use client";

import { MessageSquare, AlertCircle, Loader2 } from "lucide-react";
// CORRECCIÓN DE RUTA: Subimos un nivel para entrar a la carpeta admin
import { MuroGestionCliente } from "../admin/MuroGestionCliente";
import { BovedaResena } from "./BovedaResena"; 

type Props = {
  datosCaso: any;
  subiendoArchivo: boolean;
  subirComprobante: (e: any) => void;
  indiceActual: number;
  enviarMensajeAlAbogado: (mensaje: string) => void; 
  enviarResenaFinal: (resena: { rating: number; resenaTexto: string }) => void; 
  manejarCargaArchivo: (e: any) => void;
};

export function BovedaLegal({ 
  datosCaso, 
  subiendoArchivo, 
  subirComprobante, 
  indiceActual, 
  enviarMensajeAlAbogado,
  enviarResenaFinal,
  manejarCargaArchivo,
}: Props) {
  // Verificación de estado para control de interfaz (Lógica intacta)
  const esCasoCerrado = datosCaso?.estado === 'concluido';

  return (
    <div className="bg-white p-6 md:p-12 rounded-[3.5rem] shadow-2xl border-4 border-[#D4AF37] relative overflow-hidden text-left w-full">
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full -mr-16 -mt-16 blur-3xl" />

      {/* 1. CABECERA DE COMUNICACIÓN (Aplanada para evitar el embudo) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-6 border-b-2 border-slate-100 gap-4 relative z-10">
        <h2 className="text-[10px] md:text-xs font-black uppercase flex items-center gap-3 tracking-[0.2em] md:tracking-[0.3em] text-[#1a1a1a] italic leading-tight text-left">
          <MessageSquare size={22} className="text-[#D4AF37] shrink-0" /> 
          <span>Comunicación del <br className="md:hidden" /> Departamento Legal</span>
        </h2>
        <span className="text-[8px] md:text-[9px] text-[#D4AF37] font-black uppercase tracking-widest italic bg-[#1a1a1a] px-4 py-1.5 rounded-full border border-[#D4AF37]/30 shrink-0">
          Cifrado AES-256
        </span>
      </div>

      {/* 2. CUERPO DE LA RESPUESTA (Sin cuadros internos redundantes) */}
      <div className="relative z-10 w-full space-y-12">
        
        {/* Sección Dictamen Técnico */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-left">
            <div className={`w-3 h-3 rounded-full animate-pulse shrink-0 ${indiceActual >= 2 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
            <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest italic leading-none text-left">
              Dictamen Técnico Actualizado
            </p>
          </div>
          <p className="text-slate-800 text-base md:text-lg leading-relaxed font-bold italic pl-1 text-left">
            "{datosCaso?.actualizacion || 
            "El departamento legal está procesando la información técnica de su caso bajo estrictos protocolos de confidencialidad."}"
          </p>
        </div>

        {/* 3. PAGO / PRESUPUESTO (Diseño integrado de alta gama) */}
        {datosCaso?.presupuestoEstimado && !datosCaso?.pagoValidado && (
          <div className="bg-slate-50 p-8 md:p-10 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-left w-full md:w-auto">
              <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-2 italic leading-none">
                Honorarios de Gestión
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#1a1a1a]">$</span>
                <p className="text-5xl md:text-6xl font-black text-[#1a1a1a] tracking-tighter leading-none">
                  {datosCaso.presupuestoEstimado}
                </p>
              </div>
            </div>

            <label className="w-full md:w-auto bg-[#1a1a1a] text-white hover:text-[#D4AF37] px-8 md:px-12 py-5 rounded-2xl text-[10px] md:text-[12px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer shadow-2xl italic border-2 border-[#D4AF37] hover:scale-[1.05] active:scale-95 text-center flex items-center justify-center gap-3">
              {subiendoArchivo ? (
                <><Loader2 className="animate-spin" size={18} /> PROCESANDO...</>
              ) : (
                "SUBIR COMPROBANTE"
              )}
              <input type="file" className="hidden" onChange={subirComprobante} accept="image/*" disabled={subiendoArchivo} />
            </label>
          </div>
        )}

        {/* Advertencia de Pago en Revisión */}
        {datosCaso?.comprobantePago && !datosCaso?.pagoValidado && (
          <div className="bg-amber-500/10 border border-amber-500/20 p-5 rounded-2xl flex items-center gap-4 animate-pulse">
            <AlertCircle className="text-amber-600 shrink-0" size={20} />
            <p className="text-[9px] md:text-[10px] text-amber-700 font-black uppercase italic tracking-widest leading-tight">
              Pago en revisión por el Departamento Administrativo.
            </p>
          </div>
        )}

        {/* 4. MURO DE GESTIÓN (Flujo continuo y profesional) */}
        {!esCasoCerrado && (
          <div className="pt-4">
            <MuroGestionCliente 
              onSend={enviarMensajeAlAbogado} 
              cargando={subiendoArchivo} 
              pagoValidado={datosCaso?.pagoValidado}
              manejarArchivo={manejarCargaArchivo} 
              tieneArchivo={!!datosCaso?.archivoPendiente || (datosCaso?.documentosPrueba?.length > 0)}
            />
          </div>
        )}

        {/* 5. SECCIÓN DE RESEÑA FINAL (Solo al concluir) */}
        {esCasoCerrado && !datosCaso?.rating && (
          <div className="mt-10 pt-10 border-t-4 border-slate-100 w-full animate-in fade-in slide-in-from-top-4 duration-700">
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