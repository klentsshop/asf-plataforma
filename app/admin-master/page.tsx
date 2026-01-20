"use client";

import { useState, useEffect } from "react";
import { 
  ShieldCheck, Users, DollarSign, AlertCircle, 
  CheckCircle2, XCircle, Eye, Loader2, Scale, 
  FileText, ArrowRight, ExternalLink, ChevronLeft, TrendingUp,
  UserCheck
} from "lucide-react";
import { client } from "@/sanity/lib/client";

export default function AdminMaster() {
  const [abogadosPendientes, setAbogadosPendientes] = useState<any[]>([]);
  const [pagosPendientes, setPagosPendientes] = useState<any[]>([]);
  const [casosHuerfanos, setCasosHuerfanos] = useState<any[]>([]);
  const [abogadosAprobados, setAbogadosAprobados] = useState<any[]>([]); // 🔥 Para el Selector Maestro
  const [cargando, setCargando] = useState(true);
  const [casoEnMatch, setCasoEnMatch] = useState<string | null>(null); // Estado para abrir el selector manual

  const cargarDataMaestra = async () => {
    try {
      setCargando(true);
      const abogQuery = `*[_type == "abogado" && estatus == "pendiente"] | order(_createdAt desc){
        ..., "inpreUrl": pdfInpreabogado.asset->url
      }`;
      const pagosQuery = `*[_type == "caso" && defined(comprobantePago) && pagoValidado != true]{
        ..., "comprobanteUrl": comprobantePago.asset->url
      }`;
      const huerfanosQuery = `*[_type == "caso" && (estado == "analisis" || !defined(abogadoAsignado)) && !defined(respuestaAbogado)] | order(_createdAt desc)`;
      const aprobadosQuery = `*[_type == "abogado" && estatus == "aprobado"]{_id, nombre, especialidad, ubicacion}`;

      const [abog, pagos, huerfanos, aprobados] = await Promise.all([
        client.fetch(abogQuery),
        client.fetch(pagosQuery),
        client.fetch(huerfanosQuery),
        client.fetch(aprobadosQuery)
      ]);

      setAbogadosPendientes(abog);
      setPagosPendientes(pagos);
      setCasosHuerfanos(huerfanos);
      setAbogadosAprobados(aprobados);
    } catch (e) {
      console.error("Error cargando administración", e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarDataMaestra(); }, []);

  const asignarManual = async (casoId: string, abogadoId: string, abogadoNombre: string) => {
    const confirmar = confirm(`¿Asignar este caso oficialmente al Abg. ${abogadoNombre}?`);
    if (!confirmar) return;

    try {
      await client.patch(casoId).set({
        abogadoAsignado: { _type: 'reference', _ref: abogadoId },
        actualizacion: "SISTEMA: Caso asignado manualmente por coordinación ASF."
      }).commit();
      
      alert("Match manual exitoso.");
      setCasoEnMatch(null);
      cargarDataMaestra();
    } catch (error) {
      alert("Error al vincular.");
    }
  };

  const aprobarAbogado = async (id: string, email: string, nombre: string) => {
  const claveTemporal = Math.random().toString(36).slice(-8);

  try {
    // 1️⃣ Actualizamos en Sanity
    await client.patch(id).set({ 
      estatus: 'aprobado', 
      password: claveTemporal 
    }).commit();

    // 2️⃣ Disparamos correo seguro
    const resp = await fetch('/api/aprobacion-abogado', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, nombre, password: claveTemporal })
    });

    const data = await resp.json();

    // 3️⃣ Validación explícita del envío
    if (!data?.success) {
      alert("⚠ Se aprobó correctamente, pero hubo un error enviando las credenciales. Por favor reintente el envío.");
      return;
    }

    // 4️⃣ Flujo normal
    alert("✔ Aprobado. Credenciales enviadas exitosamente.");
    cargarDataMaestra();

  } catch (e) {
    console.error("Error en aprobarAbogado:", e);
    alert("❌ Error técnico en la aprobación.");
  }
};

  const validarPago = async (id: string) => {
    const confirmacion = confirm("¿Confirma que el depósito ha sido verificado en la cuenta ASF?");
    if (!confirmacion) return;

    try {
      await client.patch(id).set({ 
        pagoValidado: true, 
        estado: 'gestion',
        actualizacion: "ASF: Pago validado. Su abogado ha iniciado la gestión oficial."
      }).commit();
      
      alert("Pago validado exitosamente.");
      cargarDataMaestra();
    } catch (e) { alert("Error al validar flujo financiero."); }
  };

  if (cargando) return (
    <div className="h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-20 h-20 bg-[#1a1a1a] rounded-full border-4 border-[#D4AF37] flex items-center justify-center shadow-2xl mb-4 animate-pulse">
        <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
      </div>
      <p className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-[0.4em] italic">Protocolo de Seguridad Máster</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F3F4F6] text-slate-800 p-8 font-sans selection:bg-[#D4AF37]">
      
      <header className="
    max-w-7xl mx-auto
    flex flex-col md:flex-row
    justify-between items-start md:items-center

    mb-16
    bg-white

    /* MOBILE */
    p-4 rounded-xl border-2

    /* DESKTOP */
    md:p-10 md:rounded-full md:border-4

    shadow-2xl border-[#D4AF37]
    relative overflow-hidden
  "
>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="flex items-center gap-8 text-left relative z-10">
          <button onClick={() => window.location.href = '/'} className="p-5 bg-[#1a1a1a] text-[#D4AF37] border-2 border-white rounded-full hover:scale-110 transition-all shadow-xl">
            <ChevronLeft size={28} />
          </button>
          <div className="text-left">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter text-[#1a1a1a] leading-none">Master <span className="text-[#D4AF37]">Control</span></h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em] mt-3 italic">Gestión de Bóveda Central • Protocolo ASF</p>
          </div>
        </div>
        <div className="mt-8 md:mt-0 bg-[#1a1a1a] px-10 py-6 rounded-full border-4 border-[#D4AF37]/30 flex items-center gap-6 shadow-2xl">
          <div className="bg-[#D4AF37] p-3 rounded-full text-[#1a1a1a] border-2 border-white shadow-lg"><Scale size={24}/></div>
          <div className="text-left">
            <p className="text-[10px] font-black text-[#D4AF37] uppercase italic tracking-widest leading-none mb-1">Total Pendientes</p>
            <p className="text-3xl font-black text-white leading-none italic">{casosHuerfanos.length + pagosPendientes.length}</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* COLUMNA 1: ABOGADOS PENDIENTES */}
        <section className="space-y-10">
          <div className="flex justify-center">
            <div className="bg-[#1a1a1a] py-4 px-10 rounded-full border-4 border-[#D4AF37] shadow-2xl flex items-center gap-4">
              <Users size={22} className="text-[#D4AF37]" /> 
              <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-white italic">Credenciales ({abogadosPendientes.length})</h2>
            </div>
          </div>
          <div className="space-y-10">
            {abogadosPendientes.map((abog) => (
              <div key={abog._id} className="bg-white p-12 rounded-[4rem] border-4 border-[#D4AF37] shadow-2xl text-left transition-all hover:scale-[1.02] relative">
                <div className="flex justify-between items-start mb-10">
                  <div className="text-left overflow-hidden">
                    <p className="font-black uppercase text-2xl italic text-[#1a1a1a] leading-none tracking-tighter truncate">{abog.nombre}</p>
                    <p className="text-[10px] text-[#D4AF37] font-black uppercase italic mt-5 tracking-widest bg-slate-50 px-6 py-3 rounded-full border-2 border-slate-100 inline-block">Inpre: {abog.inpreabogado}</p>
                  </div>
                  {abog.inpreUrl && (
                    <a href={abog.inpreUrl} target="_blank" className="p-5 bg-[#1a1a1a] text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-[#1a1a1a] transition-all border-2 border-white shadow-xl"><Eye size={24}/></a>
                  )}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => aprobarAbogado(abog._id, abog.email, abog.nombre)} className="flex-1 bg-[#1a1a1a] text-[#D4AF37] py-6 rounded-full text-[11px] font-black uppercase italic tracking-widest shadow-xl border-2 border-[#D4AF37] transition-all hover:scale-105 active:scale-95">Aprobar</button>
                  <button className="flex-1 bg-white text-slate-300 py-6 rounded-full text-[11px] font-black uppercase italic tracking-widest border-2 border-slate-100 transition-all hover:text-red-500">Rechazar</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* COLUMNA 2: VERIFICACIÓN DE PAGOS */}
        <section className="space-y-10">
          <div className="flex justify-center">
            <div className="bg-[#1a1a1a] py-4 px-10 rounded-full border-4 border-[#D4AF37] shadow-2xl flex items-center gap-4">
              <DollarSign size={22} className="text-emerald-400" /> 
              <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-white italic">Verificación ({pagosPendientes.length})</h2>
            </div>
          </div>
          <div className="space-y-10">
            {pagosPendientes.map((pago) => (
              <div key={pago._id} className="bg-white p-12 rounded-[4rem] border-4 border-emerald-500 shadow-2xl text-left animate-in zoom-in-95 relative">
                <div className="flex items-center gap-6 mb-10 text-left">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full border-4 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-inner shrink-0"><CheckCircle2 size={32}/></div>
                  <div className="text-left overflow-hidden">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic leading-none mb-3 truncate">ID: {pago._id.substring(0,8).toUpperCase()}</p>
                    <p className="text-4xl font-black text-[#1a1a1a] italic leading-none tracking-tighter">${pago.presupuestoEstimado || "0"}</p>
                  </div>
                </div>
                <div className="aspect-video bg-[#1a1a1a] rounded-[3rem] mb-10 flex items-center justify-center overflow-hidden relative group border-4 border-slate-50 shadow-inner cursor-zoom-in">
                   {pago.comprobanteUrl ? (
                      <img src={pago.comprobanteUrl} className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" onClick={() => window.open(pago.comprobanteUrl, '_blank')} />
                   ) : <div className="text-[10px] text-slate-500 font-black uppercase italic">Esperando Imagen</div>}
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <Eye className="text-white" size={40} />
                   </div>
                </div>
                <button onClick={() => validarPago(pago._id)} className="w-full bg-emerald-500 text-white py-6 rounded-full text-[12px] font-black uppercase italic tracking-[0.2em] shadow-xl hover:bg-emerald-600 border-2 border-white transition-all hover:scale-105">Validar Recibo</button>
              </div>
            ))}
          </div>
        </section>

        {/* COLUMNA 3: MATCH MANUAL CON SELECTOR MAESTRO */}
        <section className="space-y-10">
          <div className="flex justify-center">
            <div className="bg-[#1a1a1a] py-4 px-10 rounded-full border-4 border-[#D4AF37] shadow-2xl flex items-center gap-4">
              <AlertCircle size={22} className="text-blue-400" /> 
              <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-white italic">Match Manual ({casosHuerfanos.length})</h2>
            </div>
          </div>

          <div className="space-y-10">
            {casosHuerfanos.map((caso) => ( 
              <div key={caso._id} className="bg-white p-12 rounded-[5rem] border-4 border-[#D4AF37] shadow-2xl text-left flex flex-col gap-8 transition-all relative overflow-hidden">
                <div className="flex justify-between items-center text-left">
                  <span className="text-[10px] font-black bg-[#1a1a1a] text-[#D4AF37] px-6 py-3 rounded-full uppercase italic tracking-widest border-2 border-[#D4AF37]">{caso.categoria}</span>
                  <span className="text-[10px] text-slate-400 font-black uppercase italic tracking-widest">{caso.ubicacion}</span>
                </div>
                
                {casoEnMatch === caso._id ? (
                  /* SELECTOR DE ABOGADOS ACTIVADO */
                  <div className="space-y-4 animate-in slide-in-from-top-4">
                    <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-widest italic mb-2">Seleccione Abogado para Asignar:</p>
                    <div className="max-h-64 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                      {abogadosAprobados.map((abog) => (
                        <button 
                          key={abog._id}
                          onClick={() => asignarManual(caso._id, abog._id, abog.nombre)}
                          className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl flex flex-col items-start hover:border-[#D4AF37] hover:bg-white transition-all group"
                        >
                          <span className="text-[11px] font-black text-[#1a1a1a] uppercase italic group-hover:text-[#D4AF37]">{abog.nombre}</span>
                          <span className="text-[8px] text-slate-400 font-bold uppercase">{abog.especialidad} • {abog.ubicacion}</span>
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setCasoEnMatch(null)} className="w-full text-[8px] font-black text-red-400 uppercase tracking-widest py-2">Cancelar</button>
                  </div>
                ) : (
                  /* VISTA NORMAL DEL CASO */
                  <>
                    <div className="bg-[#F9FAFB] border-4 border-slate-50 p-10 rounded-[3rem] shadow-inner text-left">
                      <p className="text-xs text-slate-600 italic font-bold leading-relaxed truncate-2-lines">"{caso.description || caso.descripcion}"</p>
                    </div>
                    <button onClick={() => setCasoEnMatch(caso._id)} className="w-full bg-[#1a1a1a] text-[#D4AF37] py-7 rounded-full text-[11px] font-black uppercase italic tracking-[0.2em] shadow-2xl hover:bg-[#D4AF37] hover:text-[#1a1a1a] transition-all flex items-center justify-center gap-4 border-2 border-white">
                      Asignar Especialista <ArrowRight size={20} />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="mt-24 py-12 border-t-4 border-[#D4AF37]/10 text-center">
        <p className="text-slate-400 text-[10px] font-black tracking-[0.6em] uppercase italic">Control Maestro • ASF Venezuela • 2026</p>
      </footer>
    </main>
  );
}