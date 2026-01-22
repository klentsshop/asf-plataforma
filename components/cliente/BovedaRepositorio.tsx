"use client";

import { FileText, Download, FileIcon } from "lucide-react";

type Props = {
  datosCaso: any;
};

export function BovedaRepositorio({ datosCaso }: Props) {
  return (
    <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-[#D4AF37] text-left">
      <h2 className="text-xs font-black text-[#1a1a1a] uppercase mb-4 flex items-center gap-3 tracking-[0.3em] italic text-left">
        <FileText className="text-[#D4AF37]" size={22} /> Repositorio
      </h2>
      <p className="text-slate-400 text-[10px] mb-8 font-black uppercase tracking-[0.2em] italic text-left">
        Archivos de la Causa
      </p>

      <div className="space-y-6">
        {/* Documentos Emitidos por ASF */}
        <div className="space-y-3">
          <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest italic ml-2 text-left">
            Documentos Emitidos por ASF
          </p>

          {datosCaso?.documentosBoveda ? (
            datosCaso.documentosBoveda.map((doc: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between p-5 bg-[#F9FAFB] border-2 border-slate-100 rounded-2xl hover:border-[#D4AF37] transition-all group text-left"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="p-2 bg-white rounded-lg border border-slate-100 text-[#D4AF37]">
                    <FileIcon size={20} />
                  </div>
                  <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter italic text-left">
                    EXP_DOC_{i + 1}
                  </span>
                </div>

                <a
                  href={doc.url}
                  download
                  className="text-slate-400 hover:text-[#D4AF37] group-hover:scale-110 transition-all cursor-pointer"
                >
                  <Download size={22} />
                </a>
              </div>
            ))
          ) : (
            <div className="p-8 bg-[#F9FAFB] rounded-[2rem] border-4 border-dashed border-slate-100 text-center text-left">
              <p className="text-[10px] text-slate-400 italic font-bold text-left">
                Sin documentos oficiales aún.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
