"use client";

import { useState, useEffect } from "react";
import { CheckCircle, FolderOpen, ArrowRightCircle } from "lucide-react";
import { client } from "../../sanity/lib/client";

type Props = {
  datosCaso: any;
};

export function BovedaHistorial({ datosCaso }: Props) {
  const [otrosCasos, setOtrosCasos] = useState<any[]>([]);
  
  // 🔑 CAMBIO CLAVE: Usamos el ID interno de Sanity que validamos en Vision
  const clienteId = datosCaso?.cliente?._id;

  useEffect(() => {
    if (clienteId) {
      // Usamos el query exacto que nos dio éxito en el Vision Tool
      client.fetch(
        `*[_type == "caso" && cliente._ref == $clienteId] | order(secuenciaExpediente desc){
          _id,
          codigoExpediente,
          titulo,
          estado
        }`, { clienteId: clienteId }
      ).then(setOtrosCasos).catch(console.error);
    }
  }, [clienteId]);

 const cambiarDeCaso = (id: string) => {
    // 1. Seteamos el nuevo ID como prioridad en la sesión
    sessionStorage.setItem("asf_id", id);
    
    // 2. En lugar de reload(), usamos la redirección directa a la raíz de la bóveda
    // Esto obliga a BovedaPage a leer el nuevo asf_id desde cero.
    window.location.href = "/boveda"; 
  };

  const documentosPrueba = datosCaso?.documentosPrueba || [];

  return (
    <div className="space-y-6 text-left">
      {/* SECCIÓN A: SELECTOR DE EXPEDIENTES (Dorado) */}
      {otrosCasos.length > 1 && (
        <div className="p-6 bg-[#D4AF37] rounded-[2.5rem] shadow-xl text-left border-b-8 border-[#b8962d] animate-in slide-in-from-right-4 duration-500">
          <p className="text-[9px] font-black text-[#1a1a1a] uppercase mb-4 tracking-[0.3em] italic">
            Mis Expedientes Oficiales
          </p>
          <div className="space-y-2">
            {otrosCasos.map((caso) => (
              <button
                key={caso._id}
                onClick={() => cambiarDeCaso(caso._id)}
                disabled={caso._id === datosCaso?._id}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                  caso._id === datosCaso?._id 
                  ? "bg-white/20 border-white/40 cursor-default" 
                  : "bg-white/10 border-transparent hover:bg-white/30 cursor-pointer"
                }`}
              >
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black text-[#1a1a1a] uppercase">{caso.codigoExpediente}</span>
                  <span className="text-[8px] font-bold text-[#1a1a1a]/70 uppercase truncate w-32">{caso.titulo}</span>
                </div>
                {caso._id === datosCaso?._id ? (
                  <FolderOpen size={14} className="text-[#1a1a1a]" />
                ) : (
                  <ArrowRightCircle size={14} className="text-[#1a1a1a]/40" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN B: DOCUMENTOS (Negro) */}
      <div className="p-8 bg-[#1a1a1a] rounded-[2.5rem] border-b-8 border-[#D4AF37] shadow-xl text-left">
        <p className="text-[9px] font-black text-[#D4AF37] uppercase mb-6 tracking-[0.3em] italic text-left">
          Historial de Pruebas
        </p>

        <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar text-left">
          {documentosPrueba.map((doc: any, i: number) => {
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

          {documentosPrueba.length === 0 && (
            <div className="text-center py-4">
              <p className="text-white/60 text-[10px] italic font-black uppercase text-left">
                Sin archivos anexados
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}