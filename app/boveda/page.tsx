"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, FileText, Lock, Search, 
  Clock, CheckCircle2, AlertCircle, UploadCloud, MessageSquare, Loader2, Download, FileIcon, CheckCircle, ChevronLeft, Mail, LogOut, Bell
} from "lucide-react";
import { validarAccesoBoveda } from "../../sanity/lib/actions";
import { client } from "../../sanity/lib/client";
import { useRouter } from "next/navigation";

export default function BovedaPage() {
  const router = useRouter();
  const [acceso, setAcceso] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [subiendoArchivo, setSubiendoArchivo] = useState(false);
  const [credenciales, setCredenciales] = useState({ email: "", casoId: "" });
  const [datosCaso, setDatosCaso] = useState<any>(null);

  // 1. VALIDACIÓN DE ACCESO Y AUTO-LIMPIEZA DE NOTIFICACIÓN
  const validarAcceso = async () => {
    if (!credenciales.email || !credenciales.casoId) {
      return alert("Por favor, ingrese su correo y el ID del expediente enviado a su email.");
    }

    setCargando(true);
    try {
      const res = await validarAccesoBoveda(credenciales.email, credenciales.casoId);
      if (res.success) {
        setDatosCaso(res.datos);
        setAcceso(true);

        // 🔥 LÓGICA DE CAMPANA: Si el cliente entra y hay notificación pendiente, la apagamos en Sanity
        if (res.datos.notificacionPendiente) {
          await client.patch(res.datos._id).set({ notificacionPendiente: false }).commit();
        }
      } else {
        alert("Acceso denegado: Credenciales inválidas. Verifique el ID en su correo.");
      }
    } catch (error) {
      alert("Error de conexión con el servidor legal.");
    } finally {
      setCargando(false);
    }
  };

  // 2. CARGA DE COMPROBANTE DE PAGO (Mantiene estado 'respondido')
  const subirComprobante = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubiendoArchivo(true);
    try {
      const asset = await client.assets.upload('image', file);
      await client
        .patch(datosCaso._id)
        .set({
          comprobantePago: {
            _type: 'image',
            asset: { _type: 'reference', _ref: asset._id }
          },
          estado: 'respondido' 
        })
        .commit();

      alert("Comprobante enviado. ASF validará su pago en breve.");
      const refresh = await client.fetch(`*[_type == "caso" && _id == $id][0]`, { id: datosCaso._id });
      setDatosCaso(refresh);
    } catch (error) {
      alert("Error al subir el comprobante.");
    } finally {
      setSubiendoArchivo(false);
    }
  };

  // 3. MANEJO DE CARGA DE EVIDENCIAS TÉCNICAS
  const manejarCargaArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !datosCaso) return;

    setSubiendoArchivo(true);
    try {
      const asset = await client.assets.upload('file', file, { filename: file.name });
      
      await client
        .patch(datosCaso._id)
        .setIfMissing({ documentosPrueba: [] })
        .append('documentosPrueba', [{
          _key: Math.random().toString(36).substring(2, 9), 
          _type: 'file',
          asset: { _type: 'reference', _ref: asset._id },
          nombreOriginal: file.name,
          fechaCarga: new Date().toISOString()
        }])
        .commit();

      alert("Documento cargado exitosamente.");

      // Refetch con expansión de URL para descarga inmediata
      const dataActualizada = await client.fetch(`
        *[_type == "caso" && _id == $id][0]{
          ...,
          "documentosPrueba": documentosPrueba[]{
            ...,
            "url": asset->url
          }
        }
      `, { id: datosCaso._id });

      setDatosCaso(dataActualizada);
    } catch (error) {
      console.error("Error técnico en carga:", error);
      alert("Error al subir el documento.");
    } finally {
      setSubiendoArchivo(false);
    }
  };

  const pasos = ['analisis', 'respondido', 'gestion', 'concluido'];
  const indiceActual = datosCaso ? pasos.indexOf(datosCaso.estado) : 0;

  // --- RENDERIZADO DE PANTALLA DE BLOQUEO ---
  if (!acceso) {
    return (
      <main className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white border-4 border-[#D4AF37] p-10 rounded-[3rem] shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B]" />
          
          <button onClick={() => router.push('/')} className="mb-8 flex items-center gap-2 text-slate-400 hover:text-[#D4AF37] font-black uppercase text-[10px] tracking-widest italic transition-all mx-auto">
            <ChevronLeft size={16} /> Volver al Inicio
          </button>

          <div className="w-24 h-24 bg-[#1a1a1a] text-[#D4AF37] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl border-2 border-[#D4AF37]">
            <Lock size={40} />
          </div>
          <h1 className="text-3xl font-black text-[#1a1a1a] uppercase tracking-tighter mb-2 italic">Acceso a Bóveda</h1>
          <p className="text-slate-400 text-[10px] mb-10 uppercase tracking-[0.3em] font-bold italic">Protocolo de Seguridad Nivel Militar</p>
          
          <div className="space-y-5 text-left">
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={18} />
              <input 
                type="email" 
                placeholder="EMAIL DE REGISTRO" 
                className="w-full p-5 pl-14 bg-white border-4 border-[#D4AF37]/20 rounded-2xl outline-none focus:border-[#D4AF37] font-black text-xs text-[#1a1a1a] transition-all"
                onChange={(e) => setCredenciales({...credenciales, email: e.target.value})}
              />
            </div>
            <div className="relative group">
              <FileText className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={18} />
              <input 
                type="text" 
                placeholder="ID DE EXPEDIENTE" 
                className="w-full p-5 pl-14 bg-white border-4 border-[#D4AF37]/20 rounded-2xl outline-none focus:border-[#D4AF37] font-black text-xs text-[#1a1a1a] transition-all"
                onChange={(e) => setCredenciales({...credenciales, casoId: e.target.value})}
              />
            </div>
            <button 
              onClick={validarAcceso}
              disabled={cargando} 
              className="w-full p-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a1a1a] font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 mt-6 shadow-2xl hover:scale-[1.02] active:scale-95 border-2 border-white italic text-xs"
            >
              {cargando ? <Loader2 className="animate-spin" /> : <><ShieldCheck size={20} /> DESBLOQUEAR EXPEDIENTE</>}
            </button>
          </div>
          <p className="mt-10 text-[9px] text-slate-400 font-bold uppercase italic tracking-widest leading-relaxed text-center">
            Abogados Sin Fronteras • Conexión Segura TLS 1.3
          </p>
        </div>
      </main>
    );
  }

  // --- RENDERIZADO DE BÓVEDA AUTORIZADA ---
  return (
    <main className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans selection:bg-[#D4AF37]">
      <nav className="bg-[#1a1a1a] h-24 flex items-center px-8 border-b-4 border-[#D4AF37] sticky top-0 z-50 shadow-2xl">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-5">
            <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8860B] p-3 rounded-2xl text-[#1a1a1a] shadow-lg border-2 border-white">
              <ShieldCheck size={28} />
            </div>
            <div className="text-left">
              <span className="text-white font-black uppercase text-lg tracking-tighter italic block">Bóveda Privada <span className="text-[#D4AF37]">ASF</span></span>
              <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] opacity-80">Expediente Digital Protegido</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end hidden md:flex text-right">
              <div className="flex items-center gap-4">
                {/* 🔔 CAMPANA DORADA PARPADEANTE */}
                {datosCaso?.notificacionPendiente && (
                  <div className="relative animate-bounce">
                    <Bell size={22} className="text-[#D4AF37] fill-[#D4AF37] drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#1a1a1a]"></span>
                  </div>
                )}
                <p className="text-white text-xs font-black uppercase italic mb-1">{datosCaso?.nombreCliente || "Cliente Registrado"}</p>
              </div>
              <span className="text-[#D4AF37] text-[10px] font-black tracking-widest uppercase border-b-2 border-[#D4AF37]/30 pb-0.5">ID: {datosCaso?._id?.substring(0, 8).toUpperCase()}</span>
            </div>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-500 p-3 rounded-xl transition-all border border-white/10 group cursor-pointer"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 text-left">
          
          {/* BARRA DE ESTADOS */}
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-[#D4AF37]">
            <h2 className="text-xs font-black text-[#1a1a1a] uppercase mb-12 flex items-center gap-3 tracking-[0.3em] italic">
              <Clock className="text-[#D4AF37]" size={22} /> Estatus de la Defensa Oficial
            </h2>
            <div className="flex justify-between relative px-6 text-left">
              <div className="absolute h-1 bg-slate-100 top-5 left-12 right-12 z-0"></div>
              <div 
                className="absolute h-1 bg-[#D4AF37] top-5 left-12 z-0 transition-all duration-1000 shadow-[0_0_10px_#D4AF37]"
                style={{ width: `${(indiceActual / 3) * 92}%` }}
              ></div>
              
              {['Análisis', 'Presupuesto', 'Gestión', 'Concluido'].map((step, i) => {
                const stepKey = i === 0 ? 'analisis' : i === 1 ? 'respondido' : i === 2 ? 'gestion' : 'concluido';
                const isActive = pasos.indexOf(stepKey) <= indiceActual;
                return (
                  <div key={step} className="relative z-10 flex flex-col items-center gap-4">
                    <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center transition-all duration-700 border-4 ${isActive ? 'bg-[#1a1a1a] text-[#D4AF37] border-[#D4AF37] shadow-xl' : 'bg-white text-slate-200 border-slate-100'}`}>
                      {isActive ? <CheckCircle2 size={24} /> : <span className="text-sm font-black">{i + 1}</span>}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest italic ${isActive ? 'text-[#1a1a1a]' : 'text-slate-300'}`}>{step}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* COMUNICACIÓN LEGAL */}
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-[#D4AF37] relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            <h2 className="text-xs font-black uppercase mb-10 flex items-center gap-3 tracking-[0.3em] text-[#1a1a1a] italic">
              <MessageSquare size={22} className="text-[#D4AF37]" /> Comunicación del Departamento Legal
            </h2>

            <div className="bg-[#F9FAFB] border-4 border-[#D4AF37]/10 p-10 rounded-[2.5rem] relative z-10 text-left">
              <div className="flex justify-between items-center mb-8 border-b-2 border-slate-200 pb-5">
                <div className="flex items-center gap-3 text-left">
                  <div className={`w-3 h-3 rounded-full animate-ping ${indiceActual >= 2 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                  <p className="text-[#1a1a1a] text-xs font-black uppercase tracking-widest italic text-left">Dictamen Técnico Actualizado</p>
                </div>
                <span className="text-[9px] text-[#D4AF37] font-black uppercase tracking-widest italic bg-[#1a1a1a] px-3 py-1 rounded-full">Cifrado AES-256</span>
              </div>

              <p className="text-slate-700 text-base leading-relaxed font-bold italic mb-12 text-left">
                "{datosCaso?.actualizacion || "El departamento legal está procesando la información técnica de su caso bajo estrictos protocolos de confidencialidad."}"
              </p>
              
              {/* ÁREA DE PAGO */}
              {datosCaso?.presupuestoEstimado && !datosCaso?.pagoValidado && (
                <div className="pt-10 border-t-2 border-dashed border-slate-200 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-left">
                    <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-2 italic text-left">Honorarios de Gestión</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-[#1a1a1a]">$</span>
                      <p className="text-5xl font-black text-[#1a1a1a] tracking-tighter">{datosCaso.presupuestoEstimado}</p>
                    </div>
                  </div>
                  <label className="bg-[#1a1a1a] text-white hover:text-[#D4AF37] px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all cursor-pointer shadow-2xl italic border-2 border-[#D4AF37] hover:scale-[1.05] active:scale-95 text-center">
                    {subiendoArchivo ? "PROCESANDO..." : "SUBIR COMPROBANTE DE PAGO"}
                    <input type="file" className="hidden" onChange={subirComprobante} accept="image/*" disabled={subiendoArchivo} />
                  </label>
                </div>
              )}

              {datosCaso?.comprobantePago && !datosCaso?.pagoValidado && (
                <div className="mt-8 bg-amber-500/10 border-2 border-amber-500/20 p-4 rounded-2xl flex items-center gap-3 animate-pulse text-left">
                  <AlertCircle className="text-amber-500" size={18} />
                  <p className="text-[9px] text-amber-600 font-black uppercase italic tracking-widest text-left">Pago en revisión por el Departamento Administrativo.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: REPOSITORIO */}
        <div className="space-y-8 text-left">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-[#D4AF37]">
            <h2 className="text-xs font-black text-[#1a1a1a] uppercase mb-4 flex items-center gap-3 tracking-[0.3em] italic text-left">
              <FileText className="text-[#D4AF37]" size={22} /> Repositorio
            </h2>
            <p className="text-slate-400 text-[10px] mb-8 font-black uppercase tracking-[0.2em] italic text-left">Archivos de la Causa</p>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest italic ml-2 text-left">Documentos Emitidos por ASF</p>
                {datosCaso?.documentosBoveda ? (
                   datosCaso.documentosBoveda.map((doc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-[#F9FAFB] border-2 border-slate-100 rounded-2xl hover:border-[#D4AF37] transition-all group text-left">
                      <div className="flex items-center gap-4 text-left">
                        <div className="p-2 bg-white rounded-lg border border-slate-100 text-[#D4AF37]"><FileIcon size={20} /></div>
                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter italic text-left">EXP_DOC_{i+1}</span>
                      </div>
                      <a href={doc.url} download className="text-slate-400 hover:text-[#D4AF37] group-hover:scale-110 transition-all cursor-pointer"><Download size={22}/></a>
                    </div>
                   ))
                ) : (
                  <div className="p-8 bg-[#F9FAFB] rounded-[2rem] border-4 border-dashed border-slate-100 text-center text-left">
                    <p className="text-[10px] text-slate-400 italic font-bold text-left">Sin documentos oficiales aún.</p>
                  </div>
                )}
              </div>

              {/* CARGA DE EVIDENCIAS */}
              <div className="pt-8 border-t-2 border-slate-100 text-left">
                <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest italic ml-2 mb-4 text-left">Cargar Evidencias Adicionales</p>
                <label className="w-full p-10 border-4 border-dashed border-[#D4AF37]/30 rounded-[2.5rem] flex flex-col items-center justify-center gap-5 cursor-pointer hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 transition-all group relative overflow-hidden">
                  <div className="p-5 bg-[#1a1a1a] rounded-[1.5rem] shadow-xl text-[#D4AF37] group-hover:scale-110 transition-all border-2 border-white">
                    {subiendoArchivo ? <Loader2 className="animate-spin" /> : <UploadCloud size={32} />}
                  </div>
                  <div className="text-center">
                    <span className="text-[11px] font-black text-[#1a1a1a] uppercase tracking-[0.2em] block mb-1">
                      {subiendoArchivo ? "TRANSMITIENDO..." : "ANEXAR DOCUMENTO"}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">PDF, JPG, PNG • Máx 10MB</span>
                  </div>
                  <input type="file" className="hidden" onChange={manejarCargaArchivo} disabled={subiendoArchivo} />
                </label>
              </div>

              {/* HISTORIAL */}
              <div className="p-8 bg-[#1a1a1a] rounded-[2.5rem] border-b-8 border-[#D4AF37] shadow-xl text-left">
                <p className="text-[9px] font-black text-[#D4AF37] uppercase mb-6 tracking-[0.3em] italic text-left">Historial de Pruebas</p>
                <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar text-left">
                  {datosCaso?.documentosPrueba?.map((doc: any, i: number) => {
                    const esPDF = doc.url?.toLowerCase().endsWith('.pdf');
                    return (
                      <a 
                        key={i} 
                        href={doc.url}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 text-white text-[10px] font-bold uppercase tracking-tighter bg-white/5 p-3 rounded-xl border border-white/10 text-left hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] transition-all cursor-pointer group"
                      >
                        <div className="p-1.5 bg-[#D4AF37]/10 rounded-lg group-hover:bg-[#D4AF37] transition-colors text-left">
                          <CheckCircle size={16} className="text-[#D4AF37]" /> 
                        </div>
                        <div className="flex flex-col flex-1 overflow-hidden text-left">
                          <span className="truncate group-hover:text-[#D4AF37] transition-colors text-left">{doc.nombreOriginal || `PRUEBA_${i+1}`}</span>
                          <span className="text-[7px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity text-left uppercase">{esPDF ? "VISUALIZAR ↗" : "DESCARGAR"}</span>
                        </div>
                      </a>
                    );
                  })}
                  {(!datosCaso?.documentosPrueba || datosCaso.documentosPrueba.length === 0) && (
                    <div className="text-center py-4"><p className="text-white/60 text-[10px] italic font-black uppercase text-left">Sin archivos anexados</p></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="mt-auto py-12 border-t-4 border-[#D4AF37]/20 text-center">
          <p className="text-slate-400 text-[10px] font-black tracking-[0.5em] uppercase italic">Abogados Sin Fronteras Venezuela • 2026</p>
      </footer>
    </main>
  );
}