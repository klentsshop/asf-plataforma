"use client";

import { FileIcon, Download, MessageSquare } from "lucide-react";

type Props = {
  casoSeleccionado: any;
};

export function GestionarEvidencias({ casoSeleccionado }: Props) {
  return (
    <div className="p-10 border-r-2 border-slate-50 bg-slate-50/30 space-y-8 text-left h-full overflow-y-auto">
      <h3 className="text-xs font-black text-[#1a1a1a] uppercase tracking-widest italic border-b-2 border-[#D4AF37]/20 pb-4">
        Evidencias y Comunicación
      </h3>

      <div className="space-y-6">
        {/* DESCRIPCIÓN INICIAL DEL CASO */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-left">
          <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest mb-2 italic">Relato Inicial</p>
          <p className="text-xs font-medium text-slate-600 italic leading-relaxed">
            "{casoSeleccionado?.descripcion}"
          </p>
        </div>

        {/* NUEVO BLOQUE: RESPUESTA DEL CLIENTE DESDE BÓVEDA */}
        {casoSeleccionado?.mensajeCliente && (
          <div className="bg-[#D4AF37]/5 border-2 border-dashed border-[#D4AF37]/30 p-6 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:rotate-12 transition-transform">
              <MessageSquare size={30} className="text-[#D4AF37]" />
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
              </span>
              <p className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-widest italic">
                Último mensaje del cliente
              </p>
            </div>

            <p className="text-[11px] text-slate-700 font-bold italic leading-relaxed pl-3 border-l-2 border-[#D4AF37]">
              "{casoSeleccionado.mensajeCliente}"
            </p>
            
            <p className="text-[7px] text-slate-400 font-black uppercase mt-3 tracking-widest">
              Recibido vía Bóveda Digital ASF
            </p>
          </div>
        )}

        {/* AUDIO DEL RELATO */}
        {casoSeleccionado?.audioUrl && (
          <div className="bg-[#1a1a1a] p-6 rounded-3xl shadow-xl">
             <p className="text-[8px] font-black text-[#D4AF37] uppercase tracking-[0.3em] mb-3 italic">Audio de Evidencia</p>
            <audio src={casoSeleccionado.audioUrl} controls className="w-full h-8" />
          </div>
        )}

        {/* LISTADO DE DOCUMENTOS */}
        <div className="space-y-3">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Documentos Adjuntos</p>
          {casoSeleccionado?.documentosPrueba?.map((doc: any, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-[#D4AF37] transition-all group shadow-sm"
            >
              <div className="flex items-center gap-3 overflow-hidden text-left">
                <FileIcon size={20} className="text-[#D4AF37] shrink-0" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] font-black text-slate-700 uppercase truncate italic">
                    {doc.nombreOriginal || `PRUEBA_${i + 1}`}
                  </span>
                  <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">
                    Archivo de Respaldo
                  </span>
                </div>
              </div>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                download={doc.nombreOriginal}
                className="text-[#D4AF37] hover:scale-120 transition-transform p-1"
              >
                <Download size={18} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}