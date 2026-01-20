"use client";

import React, { useState, useEffect } from "react";
import { 
  Scale, Users, Clock, CheckCircle, MessageSquare, 
  MapPin, FileText, ChevronRight, Bell, Search, Menu,
  ShieldCheck, Info, FileUp, Send, ChevronLeft, DollarSign,
  Mic, Play, Download, AlertTriangle, FileIcon, KeyRound, LogOut, Loader2
} from "lucide-react";
import { client } from "../../sanity/lib/client";
import { SecuritySettings } from "@/components/SecuritySettings";

// --- SUB-COMPONENTES LOCALES ---

const NavItem = ({ icon, label, active = false, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-[#1a1a1a] text-[#D4AF37] shadow-lg shadow-black/10' : 'text-slate-500 hover:bg-slate-50 hover:text-[#1a1a1a]'}`}
  >
    {icon}
    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </div>
);

// --- COMPONENTE PRINCIPAL ---

export default function AbogadoDashboard() {
  const [vista, setVista] = useState("bandeja"); 
  const [casos, setCasos] = useState<any[]>([]);
  const [clientesActivos, setClientesActivos] = useState<any[]>([]);
  const [expedientesConcluidos, setExpedientesConcluidos] = useState<any[]>([]); 
  const [casoSeleccionado, setCasoSeleccionado] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [mensajeLegal, setMensajeLegal] = useState("");
  const [ofertaMonto, setOfertaMonto] = useState(""); 
  const [abogadoInfo, setAbogadoInfo] = useState({ id: "", nombre: "", especialidad: "", ubicacion: "" });

  // 1. RECUPERAR SESIÓN Y DATOS DE MATCH DEL ABOGADO
  useEffect(() => {
    const id = localStorage.getItem("asf_abogado_id");
    if (!id) {
        window.location.href = "/login-abogado";
        return;
    }

    const cargarPerfil = async () => {
      try {
        const perfil = await client.fetch(`*[_type == "abogado" && _id == $id][0]`, { id });
        if (perfil) {
          setAbogadoInfo({ 
            id: perfil._id, 
            nombre: perfil.nombre, 
            especialidad: perfil.especialidad, 
            ubicacion: perfil.ubicacion 
          });
        }
      } catch (error) {
        console.error("Error de sesión:", error);
      }
    };
    cargarPerfil();
  }, []);

  // 2. CARGA FILTRADA POR MATCHMAKER O CLIENTES ASIGNADOS
  useEffect(() => {
    const cargarDatos = async () => {
      if (!abogadoInfo.id || !abogadoInfo.especialidad) return;
      try {
        setCargando(true);
        if (vista === "bandeja") {
          const queryBolsa = `*[_type == "caso" && estado == "analisis" && categoria == $esp && ubicacion == $ub && !defined(respuestaAbogado)] | order(_createdAt desc)`;
          const data = await client.fetch(queryBolsa, { esp: abogadoInfo.especialidad, ub: abogadoInfo.ubicacion });
          setCasos(data);
        } else if (vista === "clientes") {
          const queryClientes = `*[_type == "caso" && abogadoAsignado._ref == $id && estado == "gestion" && pagoValidado == true] | order(_updatedAt desc){
            ...,
            "nombreCliente": cliente->nombre,
            "emailCliente": cliente->email,
            "documentosPrueba": documentosPrueba[]{
               ...,
               "url": asset->url
            }
          }`;
          const data = await client.fetch(queryClientes, { id: abogadoInfo.id });
          setClientesActivos(data);
        } else if (vista === "expedientes") {
          const queryExpedientes = `*[_type == "caso" && abogadoAsignado._ref == $id && estado == "concluido"] | order(_updatedAt desc){
            ...,
            "nombreCliente": cliente->nombre
          }`;
          const data = await client.fetch(queryExpedientes, { id: abogadoInfo.id });
          setExpedientesConcluidos(data);
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
    const timer = setInterval(cargarDatos, 20000);
    return () => clearInterval(timer);
  }, [vista, abogadoInfo]);

  // 3. ESCUCHA DE PAGO EN TIEMPO REAL (PUSH)
  useEffect(() => {
    if (vista === "gestionar" && casoSeleccionado) {
      const subscription = client
        .listen(`*[_type == "caso" && _id == $id]`, { id: casoSeleccionado._id })
        .subscribe((update) => {
          const nuevoDoc = update.result;
          if (nuevoDoc && (nuevoDoc as any).pagoValidado) {
            setCasoSeleccionado(nuevoDoc);
          }
        });
      return () => subscription.unsubscribe();
    }
  }, [vista, casoSeleccionado]);

  const manejarGestionar = (s: any) => {
    setCasoSeleccionado(s);
    setVista("gestionar");
    setOfertaMonto(s.presupuestoEstimado || "");
  };

  const cerrarSesion = () => {
    localStorage.clear();
    window.location.replace("/login-abogado");
  };

  // 🔥 NUEVA FUNCIÓN: CARGA DE INSTRUMENTOS LEGALES AL REPOSITORIO
  const manejarCargaInstrumentoAbogado = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !casoSeleccionado) return;

    setCargando(true);
    try {
      const asset = await client.assets.upload('file', file, { filename: file.name });
      
      await client
        .patch(casoSeleccionado._id)
        .setIfMissing({ documentosBoveda: [] })
        .append('documentosBoveda', [{
          _key: Math.random().toString(36).substring(2, 9),
          _type: 'file',
          asset: { _type: 'reference', _ref: asset._id },
          nombreOriginal: file.name,
          fechaCarga: new Date().toISOString()
        }])
        .commit();

      alert("Instrumento Legal cargado y enviado al Repositorio del cliente.");
      
      const refresh = await client.fetch(`*[_id == $id][0]{
        ...,
        "documentosPrueba": documentosPrueba[]{ ..., "url": asset->url }
      }`, { id: casoSeleccionado._id });
      setCasoSeleccionado(refresh);
    } catch (error) {
      console.error("Error cargando instrumento:", error);
      alert("Error al subir el archivo al repositorio.");
    } finally {
      setCargando(false);
    }
  };

  // 🔥 SINCRONIZACIÓN DE BÓVEDA CON NOTIFICACIÓN Y CORREO
  const enviarActualizacionYPrecio = async () => {
    const esSolvente = casoSeleccionado?.pagoValidado === true;
    
    if (!mensajeLegal) return alert("Indique el reporte técnico o requerimiento para el cliente.");
    if (!esSolvente && !ofertaMonto) return alert("Debe indicar los honorarios para enviar la propuesta inicial al cliente.");

    try {
      setCargando(true);
      const uniqueKey = Math.random().toString(36).substring(2, 9);
      const statusInstitucional = `Actualización ASF: ${mensajeLegal}`;
      
      const updateFields: any = {
        respuestaAbogado: statusInstitucional,
        actualizacion: statusInstitucional,
        notificacionPendiente: true, // 🔔 Activa la campana dorada
        abogadoAsignado: { _type: 'reference', _ref: abogadoInfo.id }
      };

      if (!esSolvente) {
        updateFields.estado = 'respondido';
      }

      if (ofertaMonto) {
        updateFields.presupuestoEstimado = ofertaMonto;
      }

      await client.patch(casoSeleccionado._id)
        .set(updateFields)
        .setIfMissing({ muroGestion: [] })
        .append('muroGestion', [{
          _key: uniqueKey,
          mensaje: statusInstitucional,
          fecha: new Date().toISOString(),
          emisor: 'Abogados Sin Fronteras' 
        }])
        .commit();

      const destinoEmail = casoSeleccionado.emailCliente || casoSeleccionado.cliente?.email;

      if (destinoEmail) {
        await fetch('/api/notificar-actualizacion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: destinoEmail,
            nombre: casoSeleccionado.nombreCliente || "Cliente ASF",
            mensaje: mensajeLegal,
            esSolvente: esSolvente
          })
        });
      }

      alert(esSolvente ? "Bóveda Sincronizada" : "Propuesta Enviada al Cliente.");
      setMensajeLegal("");
      setOfertaMonto("");
      setVista(esSolvente ? "clientes" : "bandeja");
      
    } catch (error) {
      console.error("Error en sincronización:", error);
      alert("Error crítico al sincronizar con la Bóveda Técnica.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans selection:bg-[#D4AF37]">
      {/* NAVBAR PREMIUM */}
      <nav className="bg-[#1a1a1a] h-16 flex items-center shrink-0 z-50 border-b-2 border-[#D4AF37]/30 px-8 justify-between shadow-xl">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setVista("bandeja")}>
          <div className="bg-gradient-to-br from-[#D4AF37] to-[#B8860B] p-1.5 rounded-lg shadow-lg">
            <Scale className="text-white w-5 h-5" />
          </div>
          <span className="text-white font-black tracking-tighter uppercase text-sm italic">
            Panel <span className="text-[#D4AF37]">Profesional ASF</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 border-l border-white/10 pl-6">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-white leading-none uppercase tracking-widest italic">{abogadoInfo.nombre || "Especialista"}</p>
              <span className="text-[8px] text-[#D4AF37] font-bold uppercase italic">{abogadoInfo.especialidad} • {abogadoInfo.ubicacion}</span>
            </div>
            <button onClick={cerrarSesion} title="Cerrar Sesión" className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center text-[#1a1a1a] shadow-xl hover:bg-white transition-all group border border-white/20">
               <LogOut size={18} className="group-hover:scale-110 transition-transform"/>
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* SIDEBAR LUXURY WHITE */}
        <aside className="w-full md:w-64 bg-white border-r-2 border-slate-200 p-6 flex flex-col justify-between shrink-0 text-left">
          <div className="space-y-8">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic pl-4">Menú de Gestión</p>
              <nav className="space-y-2">
                <NavItem onClick={() => setVista("bandeja")} icon={<Clock size={18}/>} label="Bolsa de Casos" active={vista === "bandeja"} />
                <NavItem onClick={() => setVista("clientes")} icon={<Users size={18}/>} label="Mis Clientes" active={vista === "clientes"} />
                <NavItem onClick={() => setVista("expedientes")} icon={<FileText size={18}/>} label="Expedientes" active={vista === "expedientes"} />
                <NavItem onClick={() => setVista("seguridad")} icon={<KeyRound size={18}/>} label="Seguridad" active={vista === "seguridad"} />
              </nav>
            </div>
          </div>
          <div className="bg-[#1a1a1a] p-5 rounded-[2rem] border-2 border-[#D4AF37]/40 shadow-2xl text-left">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={14} className="text-[#D4AF37]"/>
              <p className="text-[9px] font-black text-[#D4AF37] uppercase italic tracking-widest">Identidad Legal</p>
            </div>
            <p className="text-white text-[10px] font-bold italic tracking-tighter opacity-80 uppercase leading-none">Abogado Verificado</p>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <section className="flex-1 p-8 overflow-y-auto bg-[#F8F9FA]">
          <div className="max-w-5xl mx-auto space-y-8 text-left">
            
            {/* VISTA 1: Casos Activos */}
            {vista === "bandeja" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none mb-8">Casos <span className="text-[#D4AF37]">Por Analizar</span></h1>
                {cargando ? (
                  <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest italic animate-pulse">Consultando Matchmaker...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {casos.length === 0 ? (
                      <div className="bg-white p-20 rounded-[3rem] border-4 border-dashed border-slate-100 text-center flex flex-col items-center">
                        <Search className="text-slate-200 mb-4" size={60} />
                        <p className="text-slate-400 font-black uppercase italic tracking-widest text-sm">No hay nuevos casos en su zona</p>
                      </div>
                    ) : (
                      casos.map((s) => (
                        <div key={s._id} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-center justify-between hover:border-[#D4AF37] transition-all group">
                          <div className="flex items-center gap-6 text-left">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#D4AF37] group-hover:bg-[#1a1a1a] transition-all duration-500 shadow-inner"><FileText size={24} /></div>
                            <div>
                              <h4 className="font-black text-[#1a1a1a] text-lg uppercase leading-tight italic">{s.categoria}</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12} className="text-[#D4AF37]" /> {s.ubicacion}</p>
                            </div>
                          </div>
                          <button onClick={() => manejarGestionar(s)} className="bg-[#1a1a1a] text-[#D4AF37] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#D4AF37] hover:text-white transition-all italic">ANALIZAR</button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* VISTA 2: MIS CLIENTES */}
            {vista === "clientes" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none mb-8">Mis <span className="text-[#D4AF37]">Clientes</span></h1>
                {cargando ? (
                   <div className="flex justify-center py-24"><Loader2 className="animate-spin text-[#D4AF37]" size={40} /></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {clientesActivos.length === 0 ? (
                      <div className="md:col-span-2 bg-white p-20 rounded-[3rem] text-center border-4 border-dashed border-slate-100">
                        <p className="text-slate-400 font-black uppercase italic">Esperando validación de pagos administrativos</p>
                      </div>
                    ) : (
                      clientesActivos.map((c) => (
                        <div key={c._id} className="bg-white p-8 rounded-[3rem] shadow-xl border border-emerald-100 relative group overflow-hidden transition-all hover:border-emerald-500">
                          <div className="absolute top-0 right-0 px-6 py-2 text-[8px] font-black uppercase italic tracking-widest bg-emerald-500 text-white shadow-lg">
                            Cliente Solvente
                          </div>
                          <h4 className="text-2xl font-black text-[#1a1a1a] uppercase italic mb-1">{c.nombreCliente || "Cliente Registrado"}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">{c.categoria} • ID: {c._id.substring(0,6).toUpperCase()}</p>
                          <div className="flex gap-3">
                            <button onClick={() => manejarGestionar(c)} className="flex-1 bg-[#1a1a1a] text-[#D4AF37] py-4 rounded-2xl text-[9px] font-black uppercase italic tracking-widest hover:bg-black transition-all">Gestionar Bóveda</button>
                            <button className="px-4 bg-slate-50 text-slate-400 rounded-2xl hover:text-blue-500 transition-colors"><MessageSquare size={18}/></button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* VISTA 3: EXPEDIENTES */}
            {vista === "expedientes" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tighter uppercase italic leading-none mb-8">Archivo de <span className="text-[#D4AF37]">Expedientes</span></h1>
                {cargando ? (
                   <div className="flex justify-center py-24"><Loader2 className="animate-spin text-[#D4AF37]" size={40} /></div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {expedientesConcluidos.length === 0 ? (
                      <div className="md:col-span-2 bg-white p-20 rounded-[3rem] text-center border-4 border-dashed border-slate-100">
                        <p className="text-slate-400 font-black uppercase italic">No tiene expedientes concluidos aún</p>
                      </div>
                    ) : (
                      expedientesConcluidos.map((e) => (
                        <div key={e._id} className="bg-white p-8 rounded-[3rem] shadow-xl border border-emerald-100 relative group overflow-hidden opacity-80">
                          <div className="absolute top-0 right-0 px-6 py-2 bg-emerald-500 text-white text-[8px] font-black uppercase italic tracking-widest">CONCLUIDO</div>
                          <h4 className="text-2xl font-black text-slate-700 uppercase italic mb-1">{e.nombreCliente}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">Expediente: {e.codigoExpediente}</p>
                          <button onClick={() => manejarGestionar(e)} className="w-full bg-slate-100 text-slate-500 py-4 rounded-2xl text-[9px] font-black uppercase italic tracking-widest hover:bg-emerald-500 hover:text-white transition-all">Ver Historial Completo</button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {/* VISTA 4: GESTIONAR */}
            {vista === "gestionar" && (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <button onClick={() => setVista(casoSeleccionado?.estado === "concluido" ? "expedientes" : (casoSeleccionado?.pagoValidado ? "clientes" : "bandeja"))} className="mb-8 flex items-center gap-3 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-[#1a1a1a] transition-all italic">
                  <ChevronLeft size={18}/> Volver a la Lista
                </button>
                
                <div className="bg-white rounded-[3.5rem] shadow-2xl border-2 border-[#D4AF37]/10 overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-2 bg-[#D4AF37]" />
                  <div className="grid grid-cols-1 lg:grid-cols-3">
                    <div className="p-10 border-r-2 border-slate-50 bg-slate-50/30 space-y-8 text-left">
                      <h3 className="text-xs font-black text-[#1a1a1a] uppercase tracking-widest italic border-b-2 border-[#D4AF37]/20 pb-4">Evidencias Cargadas</h3>
                      <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-left">
                          <p className="text-xs font-medium text-slate-600 italic leading-relaxed">"{casoSeleccionado?.descripcion}"</p>
                        </div>
                        {casoSeleccionado?.audioUrl && (<div className="bg-[#1a1a1a] p-6 rounded-3xl shadow-xl"><audio src={casoSeleccionado.audioUrl} controls className="w-full h-8" /></div>)}
                        
                        <div className="space-y-3">
                          {casoSeleccionado?.documentosPrueba?.map((doc: any, i: number) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-[#D4AF37] transition-all group shadow-sm">
                              <div className="flex items-center gap-3 overflow-hidden text-left">
                                <FileIcon size={20} className="text-[#D4AF37] shrink-0"/>
                                <div className="flex flex-col overflow-hidden">
                                  <span className="text-[10px] font-black text-slate-700 uppercase truncate italic">{doc.nombreOriginal || `PRUEBA_${i+1}`}</span>
                                  <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">Documento Digital</span>
                                </div>
                              </div>
                              <a href={doc.url} target="_blank" rel="noopener noreferrer" download={doc.nombreOriginal} className="text-[#D4AF37] hover:scale-120 transition-transform p-1"><Download size={18} /></a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-2 p-10 space-y-8">
                      <div className="flex items-center justify-between">
                         <div className="text-left"><h3 className="text-2xl font-black text-[#1a1a1a] uppercase italic tracking-tighter">Bóveda de Control</h3><p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Ref: {casoSeleccionado?._id.substring(0,8)}</p></div>
                         
                         <div className="bg-slate-50 px-6 py-4 rounded-2xl border-2 border-slate-100 text-right">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{casoSeleccionado?.pagoValidado ? "Acuerdo Actual" : "Presupuesto"}</p>
                           <div className="flex items-center gap-2 text-2xl font-black text-[#1a1a1a] italic leading-none">
                             <DollarSign size={24} className="text-[#D4AF37]"/>
                             <input 
                              type="text" 
                              value={ofertaMonto} 
                              onChange={(e) => setOfertaMonto(e.target.value)} 
                              placeholder="0.00" 
                              className={`w-24 bg-transparent outline-none border-b-2 border-dashed border-slate-200 focus:border-[#D4AF37] ${casoSeleccionado?.pagoValidado ? 'opacity-50' : ''}`} 
                             />
                           </div>
                         </div>
                      </div>
                      
                      <textarea 
                        value={mensajeLegal} 
                        onChange={(e) => setMensajeLegal(e.target.value)} 
                        placeholder={casoSeleccionado?.pagoValidado ? "Ej: Solicito acta de matrimonio y capitulaciones para continuar con la demanda de divorcio..." : "Redacte la propuesta legal para el cliente..."} 
                        className="w-full h-60 p-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] focus:border-[#D4AF37] focus:bg-white outline-none text-sm italic shadow-inner transition-all leading-relaxed text-left" 
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 🔑 SECCIÓN DE CARGA CORREGIDA Y VINCULADA */}
                        <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl text-center">
                          <label className="cursor-pointer flex flex-col items-center gap-2">
                            <FileUp 
                              size={28} 
                              className={`${cargando ? 'animate-bounce text-[#D4AF37]' : 'text-slate-300'} transition-all`}
                            />
                            <span className="text-[9px] font-black text-slate-400 uppercase italic">
                              {cargando ? 'Transmitiendo...' : 'Cargar Instrumento'}
                            </span>
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={manejarCargaInstrumentoAbogado}
                              disabled={cargando}
                            />
                          </label>
                        </div>
                        
                        <button 
                          disabled={cargando} 
                          onClick={enviarActualizacionYPrecio} 
                          className={`w-full ${cargando ? 'bg-slate-300' : 'bg-[#1a1a1a]'} text-[#D4AF37] rounded-3xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-2xl transition-all italic border-2 border-[#D4AF37]/20`}
                        >
                          <Send size={20}/> {cargando ? "Sincronizando..." : "Notificar Avance Técnica"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {vista === "seguridad" && (
              <div className="animate-in fade-in slide-in-from-right-10 duration-500 max-w-2xl mx-auto">
                <SecuritySettings abogadoId={abogadoInfo.id} />
              </div>
            )}

          </div>
        </section>
      </div>
    </main>
  );
}