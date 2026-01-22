"use client";

import { CheckCircle } from "lucide-react";

type Props = {
  datosCaso: any;
};

export function BovedaHistorial({ datosCaso }: Props) {
  // Extraemos la lista de documentos del objeto principal
  const documentosPrueba = datosCaso?.documentosPrueba || [];

  return (
    <div className="p-8 bg-[#1a1a1a] rounded-[2.5rem] border-b-8 border-[#D4AF37] shadow-xl text-left">
      <p className="text-[9px] font-black text-[#D4AF37] uppercase mb-6 tracking-[0.3em] italic text-left">
        Historial de Pruebas
      </p>

      <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar text-left">
        {documentosPrueba.map((doc: any, i: number) => {
          // Verificamos la extensión para decidir si visualiza o descarga
          const esPDF = doc.url?.toLowerCase().endsWith(".pdf");

          return (
            <a
              key={doc._key || i}
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 text-white text-[10px] font-bold uppercase tracking-tighter bg-white/5 p-3 rounded-xl border border-white/10 text-left hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] transition-all cursor-pointer group"
            >
              <div className="p-1.5 bg-[#D4AF37]/10 rounded-lg group-hover:bg-[#D4AF37] transition-colors text-left">
                <CheckCircle size={16} className="text-[#D4AF37]" />
              </div>

              <div className="flex flex-col flex-1 overflow-hidden text-left">
                <span className="truncate group-hover:text-[#D4AF37] transition-colors text-left">
                  {doc.nombreOriginal || `PRUEBA_${i + 1}`}
                </span>

                <span className="text-[7px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity text-left uppercase">
                  {esPDF ? "VISUALIZAR ↗" : "DESCARGAR"}
                </span>
              </div>
            </a>
          );
        })}

        {/* Estado vacío cuando no hay documentos */}
        {documentosPrueba.length === 0 && (
          <div className="text-center py-4">
            <p className="text-white/60 text-[10px] italic font-black uppercase text-left">
              Sin archivos anexados
            </p>
          </div>
        )}
      </div>
    </div>
  );
}