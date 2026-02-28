"use client";
import { useState } from "react";
import { FileText, User, Briefcase, Eye, Search, ShieldCheck, CheckCircle, Scale, Award,Camera } from "lucide-react";

export function SeccionExpedientes({ clientes, abogados }: any) {
  const [subTab, setSubTab] = useState<'clientes' | 'abogados'>('clientes');
  const [filtro, setFiltro] = useState("");

  const dataFiltrada = (subTab === 'clientes' ? clientes : abogados).filter((item: any) => {
    const nombreABuscar = subTab === 'clientes' ? item.nombreCliente : item.nombre;
    return nombreABuscar?.toLowerCase().includes(filtro.toLowerCase());
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Selector Interno */}
      <div className="flex justify-center gap-4">
        <button 
          onClick={() => setSubTab('clientes')}
          className={`px-8 py-3 rounded-full text-xs font-black uppercase italic transition-all border-2 ${subTab === 'clientes' ? 'bg-[#D4AF37] border-white text-[#1a1a1a] shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-400'}`}
        >
          Directorio Casos / Clientes
        </button>
        <button 
          onClick={() => setSubTab('abogados')}
          className={`px-8 py-3 rounded-full text-xs font-black uppercase italic transition-all border-2 ${subTab === 'abogados' ? 'bg-[#D4AF37] border-white text-[#1a1a1a] shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-400'}`}
        >
          Directorio Abogados
        </button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-md mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text"
          placeholder={`Buscar por nombre...`}
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-full text-sm italic outline-none focus:border-[#D4AF37] transition-all shadow-inner"
        />
      </div>

      {/* Lista de Expedientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dataFiltrada.map((item: any) => (
          <div key={item._id} className="bg-white p-8 rounded-[3rem] border-4 border-slate-50 shadow-2xl hover:border-[#D4AF37] transition-all group relative overflow-hidden">
            
            {/* Indicador de Estado (Solo Clientes/Casos) */}
            {subTab === 'clientes' && (
              <div className="absolute top-6 right-8">
                <span className={`text-[10px] font-black uppercase px-4 py-1.5 rounded-full italic tracking-widest ${item.estado === 'concluido' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                  {item.estado || "En Proceso"}
                </span>
              </div>
            )}

            <div className="flex items-center gap-5 mb-8">
              <div className="p-4 bg-slate-50 rounded-full text-[#D4AF37] group-hover:bg-[#1a1a1a] transition-colors shadow-inner">
                {subTab === 'clientes' ? <User size={24} /> : <Briefcase size={24} />}
              </div>
              <div className="text-left">
                <p className="text-lg font-black uppercase italic text-[#1a1a1a] leading-none tracking-tighter">
                  {subTab === 'clientes' ? item.nombreCliente : item.nombre}
                </p>
                
                {/* RELACIÓN CRUZADA Y ESTADÍSTICAS (Legibilidad Aumentada) */}
                {subTab === 'clientes' ? (
                  <div className="mt-3 flex flex-col gap-2">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none">{item.categoria}</p>
                    {item.nombreAbogadoAsignado ? (
                      <div className="flex items-center gap-2 bg-[#D4AF37]/10 px-3 py-1.5 rounded-lg border border-[#D4AF37]/20 w-fit">
                        <Scale size={14} className="text-[#D4AF37]" />
                        <p className="text-[11px] font-black text-[#D4AF37] uppercase italic leading-none">
                          Abog. {item.nombreAbogadoAsignado}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[10px] font-black text-rose-500 uppercase italic bg-rose-50 px-3 py-1 rounded-lg border border-rose-100 w-fit">
                        Sin asignar
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 flex flex-col gap-3">
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-none">{item.email}</p>
                    <div className="flex gap-3">
                      <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-3 py-2 rounded-xl flex items-center gap-2 border border-slate-200">
                        Casos: {item.casosTotales || 0}
                      </span>
                      <span className="text-[10px] font-black bg-emerald-50 text-emerald-600 px-3 py-2 rounded-xl flex items-center gap-2 border border-emerald-100 shadow-sm">
                        <Award size={14} /> Éxito: {item.casosConcluidos || 0}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {subTab === 'clientes' ? (
                <>
                  {/* DOCUMENTOS DE PRUEBA (AZULES) */}
                  {item.pruebas?.map((doc: any, i: number) => (
                    <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-blue-50/50 border-2 border-blue-100/50 rounded-2xl hover:bg-blue-100 transition-all group/item shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <FileText size={18} className="text-blue-500 shrink-0" />
                        <span className="text-[11px] font-black uppercase italic text-slate-600 truncate">{doc.nombre || "Prueba"}</span>
                      </div>
                      <Eye size={16} className="text-[#D4AF37] opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </a>
                  ))}

                  {/* DOCUMENTOS DE BÓVEDA (VERDES) */}
                  {item.boveda?.map((doc: any, i: number) => (
                    <a key={i} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-emerald-50/50 border-2 border-emerald-100/50 rounded-2xl hover:bg-emerald-100 transition-all group/item shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                        <span className="text-[11px] font-black uppercase italic text-slate-600 truncate">{doc.nombre || "Bóveda"}</span>
                      </div>
                      <Eye size={16} className="text-[#D4AF37] opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    </a>
                  ))}

                  {/* COMPROBANTE DE PAGO */}
                  {item.pagoUrl && (
                    <a href={item.pagoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-amber-50/50 border-2 border-amber-100/50 rounded-2xl hover:bg-amber-100 transition-all group/item">
                      <div className="flex items-center gap-3">
                        <CheckCircle size={18} className="text-amber-500 shrink-0" />
                        <span className="text-[11px] font-black uppercase italic text-slate-600">Comprobante de Pago</span>
                      </div>
                      <Eye size={16} className="text-[#D4AF37]" />
                    </a>
                  )}
                </>
              ) : (
                <>
                  {/* DOCUMENTOS ABOGADO */}
                  {item.inpreUrl && (
                    <a href={item.inpreUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all shadow-sm">
                      <span className="text-[11px] font-black uppercase italic text-slate-700 tracking-wider">Credencial Inpre</span>
                      <Eye size={20} className="text-[#D4AF37]" />
                    </a>
                  )}
                  {item.selfieUrl && (
                   <a href={item.selfieUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 bg-emerald-50/30 border-2 border-emerald-100/50 rounded-[1.5rem] hover:bg-emerald-100 transition-all shadow-sm">
                   <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[11px] font-black uppercase italic text-emerald-700 tracking-wider">Validación Facial (Selfie)</span>
                    </div>
                   <Camera size={20} className="text-emerald-500" />
                     </a>
                    )}
                  {item.tituloUrl && (
                    <a href={item.tituloUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all shadow-sm">
                      <span className="text-[11px] font-black uppercase italic text-slate-700 tracking-wider">Título Profesional</span>
                      <Eye size={20} className="text-[#D4AF37]" />
                    </a>
                  )}
                  {item.rifUrl && (
                    <a href={item.rifUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all shadow-sm">
                      <span className="text-[11px] font-black uppercase italic text-slate-700 tracking-wider">RIF Legal</span>
                      <Eye size={20} className="text-[#D4AF37]" />
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}