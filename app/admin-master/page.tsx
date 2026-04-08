"use client";

import { useState, useEffect, useRef } from "react"; // Añadido useRef para persistencia de datos
import { useRouter } from "next/navigation"; // Importado para la protección de ruta
import { 
  ShieldCheck, Users, DollarSign, AlertCircle, 
  CheckCircle2, XCircle, Eye, Loader2, Scale, 
  FileText, ArrowRight, ExternalLink, ChevronLeft, TrendingUp,
  UserCheck, RefreshCw, Bell // Añadidos iconos para el refresh
} from "lucide-react";
import { client } from "@/sanity/lib/client";
import { SeccionExpedientes } from "@/components/admin/SeccionExpedientes";
export default function AdminMaster() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  const [abogadosPendientes, setAbogadosPendientes] = useState<any[]>([]);
  const [pagosPendientes, setPagosPendientes] = useState<any[]>([]);
  const [casosHuerfanos, setCasosHuerfanos] = useState<any[]>([]);
  const [abogadosAprobados, setAbogadosAprobados] = useState<any[]>([]); 
  const [cargando, setCargando] = useState(true);
  const [casoEnMatch, setCasoEnMatch] = useState<string | null>(null);
  const [pestanaActiva, setPestanaActiva] = useState<'operaciones' | 'expedientes'>('operaciones');
  
  // --- NUEVOS ESTADOS PARA EL REFRESH ---
  const [segundos, setSegundos] = useState(60);
  const totalAnterior = useRef(0); // Para comparar si hay nuevos casos y sonar la campana
  const [expedientesClientes, setExpedientesClientes] = useState<any[]>([]);
  const [expedientesAbogados, setExpedientesAbogados] = useState<any[]>([]);
  // --- CAPA DE SEGURIDAD MÁSTER ---
  useEffect(() => {
    const auth = sessionStorage.getItem("asf_admin_auth");
    if (auth !== "true") {
      router.replace("/");
    } else {
      setAutorizado(true);
    }
  }, [router]);

  const cargarDataMaestra = async (isAutoRefresh = false) => {
    try {
      // Solo mostramos el loader principal en la primera carga
      if (!isAutoRefresh) setCargando(true);

      const abogQuery = `*[_type == "abogado" && estatus == "pendiente"] | order(_createdAt desc){
        ..., "inpreUrl": pdfInpreabogado.asset->url,
  "selfieUrl": fotoSelfieInpre.asset->url
      }`;
      const pagosQuery = `*[_type == "caso" && defined(comprobantePago) && pagoValidado != true]{
        ..., "comprobanteUrl": comprobantePago.asset->url
      }`;
      const huerfanosQuery = `*[_type == "caso" && !defined(abogadoAsignado) && estado == "analisis" && !defined(respuestaAbogado)] | order(_createdAt desc)`;
      const aprobadosQuery = `*[_type == "abogado" && estatus == "aprobado"]{_id, nombre, especialidad, ubicacion}`;
      const expedientesClientesQuery = `*[_type == "caso"] | order(_createdAt desc){
  _id,
  "nombreCliente": cliente->nombre,
  "categoria": select(
    categoria == "global" => "LABORAL",
    categoria == "gestiones" => "ADMINISTRATIVO",
    categoria
  ),
  estado,
  // ESTO TRAE EL NOMBRE DEL ABOGADO ASIGNADO AL CASO
  "nombreAbogadoAsignado": abogadoAsignado->nombre,
  "pruebas": documentosPrueba[]{ "url": asset->url, "nombre": nombreOriginal },
  "boveda": documentosBoveda[]{ "url": asset->url, "nombre": nombreOriginal },
  "pagoUrl": comprobantePago.asset->url
}`;
      const expedientesAbogadosQuery = `*[_type == "abogado"] | order(nombre asc){
  _id, 
  nombre, 
  email, 
  inpreabogado, 
  estatus,
  "inpreUrl": pdfInpreabogado.asset->url,
  "selfieUrl": fotoSelfieInpre.asset->url, // 👈 ¡ESTA ES LA CLAVE!
  "tituloUrl": titulo.asset->url,
  "rifUrl": rif.asset->url,
  
  // ESTO BUSCA TODOS LOS CASOS DONDE ESTE ABOGADO ESTÁ ASIGNADO
  "casosTotales": count(*[_type == "caso" && references(^._id)]),
  "casosConcluidos": count(*[_type == "caso" && references(^._id) && estado == "concluido"])
}`;
      
      
      
      const [abog, pagos, huerfanos, aprobados, expClientes, expAbog] = await Promise.all([
      client.fetch(abogQuery),
      client.fetch(pagosQuery),
      client.fetch(huerfanosQuery),
      client.fetch(aprobadosQuery),
      client.fetch(expedientesClientesQuery),
      client.fetch(expedientesAbogadosQuery)
      ]);

      // Lógica de sonido: Si la suma de pendientes es mayor que antes, suena la campana
      const nuevoTotal = abog.length + pagos.length + huerfanos.length;
      if (isAutoRefresh && nuevoTotal > totalAnterior.current) {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log("Interacción requerida para audio"));
      }
      totalAnterior.current = nuevoTotal;

      setAbogadosPendientes(abog);
      setPagosPendientes(pagos);
      setCasosHuerfanos(huerfanos);
      setAbogadosAprobados(aprobados);
      setExpedientesClientes(expClientes); 
      setExpedientesAbogados(expAbog);
    } catch (e) {
      console.error("Error cargando administración", e);
    } finally {
      setCargando(false);
    }
  };

  // --- CICLO DE VIDA DEL REFRESH (Solo si está autorizado) ---
  useEffect(() => {
    if (!autorizado) return;

    cargarDataMaestra();

    const intervaloRefresco = setInterval(() => {
      setSegundos((prev) => {
        if (prev <= 1) {
          cargarDataMaestra(true);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervaloRefresco);
  }, [autorizado]);

  // Si no está autorizado por el PIN, no renderizamos nada para evitar el "flicker" de datos sensibles
  if (!autorizado) return null;

  const asignarManual = async (casoId: string, abogadoId: string, abogadoNombre: string) => {
    const confirmar = confirm(`¿Asignar este caso oficialmente al Abg. ${abogadoNombre}?`);
    if (!confirmar) return;

    try {
      await client.patch(casoId).set({
        abogadoAsignado: { _type: 'reference', _ref: abogadoId },
        actualizacion: "SISTEMA: Caso asignado manualmente por coordinación TASF."
      }).commit();
      
      alert("Match manual exitoso.");
      setCasoEnMatch(null);
      cargarDataMaestra();
    } catch (error) {
      alert("Error al vincular.");
    }
  };
  const rechazarAbogado = async (id: string, email: string, nombre: string)  => {
  const confirmar = confirm("¿Está seguro de denegar el acceso a este abogado? Esta acción es irreversible.");
  if (!confirmar) return;

  try {
    await client.patch(id).set({ estatus: 'rechazado' }).commit();
    const resp = await fetch('/api/aprobacion-abogado', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email, 
        nombre, 
        tipoAccion: 'rechazo' // 👈 Esta es la clave para el IF en el backend
      })
    });
   alert("❌ Postulación denegada y correo de políticas enviado.");
    cargarDataMaestra();
  } catch (e) {
    alert("Error al procesar rechazo.");
  }
};
  const aprobarAbogado = async (id: string, email: string, nombre: string) => {
  const claveTemporal = Math.random().toString(36).slice(-8);

  try {
    await client.patch(id).set({ 
      estatus: 'aprobado', 
      password: claveTemporal 
    }).commit();

    const resp = await fetch('/api/aprobacion-abogado', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, nombre, password: claveTemporal })
    });

    const data = await resp.json();

    if (!data?.success) {
      alert("⚠ Se aprobó correctamente, pero hubo un error enviando las credenciales. Por favor reintente el envío.");
      return;
    }

    alert("✔ Aprobado. Credenciales enviadas exitosamente.");
    cargarDataMaestra();

  } catch (e) {
    console.error("Error en aprobarAbogado:", e);
    alert("❌ Error técnico en la aprobación.");
  }
};

  const validarPago = async (id: string) => {
    const confirmacion = confirm("¿Confirma que el depósito ha sido verificado en la cuenta TASF?");
    if (!confirmacion) return;

    try {
      await client.patch(id).set({ 
        pagoValidado: true, 
        estado: 'gestion',
        actualizacion: "TASF: Pago validado. Su abogado ha iniciado la gestión oficial."
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
        flex flex-col lg:flex-row
        justify-between items-center
        mb-10 lg:mb-16
        bg-white
        p-6 lg:p-10 
        rounded-[2.5rem] lg:rounded-full 
        border-4
        shadow-2xl border-[#D4AF37]
        relative overflow-hidden
      ">
        {/* DECORACIÓN DE FONDO */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        
        {/* BLOQUE DE TÍTULO (Centrado en móvil, a la izquierda en escritorio) */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left relative z-10 w-full md:w-auto">
          <button 
            onClick={() => window.location.href = '/'} 
            className="hidden md:flex p-5 bg-[#1a1a1a] text-[#D4AF37] border-2 border-white rounded-full hover:scale-110 transition-all shadow-xl"
          >
            <ChevronLeft size={28} />
          </button>
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter text-[#1a1a1a] leading-none">
              Master <span className="text-[#D4AF37]">Control</span>
            </h1>
            <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] mt-3 italic flex items-center gap-2">
              <RefreshCw size={10} className={`animate-spin ${segundos < 5 ? 'text-[#D4AF37]' : ''}`} />
              Sincronización {segundos}s
            </p>
          </div>
        </div>

        {/* SELECTOR DE PESTAÑAS (Ocupa el ancho completo en móvil para que no se corte) */}
        <div className="flex w-full md:w-auto bg-slate-100 p-1.5 rounded-2xl md:rounded-full border-2 border-slate-200 mt-6 lg:mt-0 relative z-10 shadow-inner">
          <button 
            onClick={() => setPestanaActiva('operaciones')}
            className={`flex-1 md:flex-none px-4 md:px-8 py-3 rounded-xl md:rounded-full text-[9px] md:text-[10px] font-black uppercase italic tracking-widest transition-all duration-300 ${
              pestanaActiva === 'operaciones' 
                ? 'bg-[#1a1a1a] text-[#D4AF37] shadow-xl scale-100 md:scale-105' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Operaciones
          </button>
          <button 
            onClick={() => setPestanaActiva('expedientes')}
            className={`flex-1 md:flex-none px-4 md:px-8 py-3 rounded-xl md:rounded-full text-[9px] md:text-[10px] font-black uppercase italic tracking-widest transition-all duration-300 ${
              pestanaActiva === 'expedientes' 
                ? 'bg-[#1a1a1a] text-[#D4AF37] shadow-xl scale-100 md:scale-105' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Expedientes
          </button>
        </div>

        {/* CONTADORES (Total Pendientes) */}
        <div className="flex flex-wrap gap-4 mt-6 lg:mt-0 relative z-10 justify-center">
          <div className="bg-[#1a1a1a] px-6 md:px-8 py-4 rounded-full border-4 border-[#D4AF37]/30 flex items-center gap-4 shadow-2xl">
            <div className="bg-[#D4AF37] p-2 rounded-full text-[#1a1a1a] border-2 border-white">
              <Bell size={18} className={segundos < 3 ? 'animate-bounce' : ''}/>
            </div>
            <div className="text-left">
              <p className="text-[7px] md:text-[8px] font-black text-[#D4AF37] uppercase italic leading-none mb-1">Total Pendientes</p>
              <p className="text-xl md:text-2xl font-black text-white leading-none italic">
                {casosHuerfanos.length + pagosPendientes.length}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* VISTA 1: OPERACIONES (3 COLUMNAS) */}
      {pestanaActiva === 'operaciones' && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in duration-500">
        
        {/* COLUMNA 1: ABOGADOS PENDIENTES */}
        <section className="space-y-10">
  <div className="flex justify-center">
    <div className="bg-[#1a1a1a] py-4 px-10 rounded-full border-4 border-[#D4AF37] shadow-2xl flex items-center gap-4">
      <Users size={22} className="text-[#D4AF37]" /> 
      <h2 className="text-[12px] font-black uppercase tracking-[0.4em] text-white italic">
        Validación de Credenciales ({abogadosPendientes.length})
      </h2>
    </div>
  </div>

  <div className="space-y-10">
    {abogadosPendientes.map((abog) => (
      <div key={abog._id} className="bg-white p-12 rounded-[4rem] border-4 border-[#D4AF37] shadow-2xl text-left transition-all hover:scale-[1.01] relative overflow-hidden">
        
        {/* ENCABEZADO: DATOS DEL ABOGADO */}
        <div className="flex justify-between items-start mb-10">
          <div className="text-left overflow-hidden">
            <p className="font-black uppercase text-2xl italic text-[#1a1a1a] leading-none tracking-tighter truncate">
              {abog.nombre}
            </p>
            <p className="text-[10px] text-[#D4AF37] font-black uppercase italic mt-5 tracking-widest bg-slate-50 px-6 py-3 rounded-full border-2 border-slate-100 inline-block">
              Inpre: {abog.inpreabogado}
            </p>
          </div>
          <div className="bg-[#D4AF37]/10 px-4 py-2 rounded-2xl border border-[#D4AF37]/20">
             <p className="text-[8px] font-black text-[#D4AF37] uppercase tracking-widest">Estatus: Pendiente</p>
          </div>
        </div>

        {/* 🏛️ PANEL DE COMPARACIÓN BIOMÉTRICA (NUEVO) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          
          {/* Foto 1: El Carnet */}
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest italic">1. Documento Oficial (INPRE)</p>
            <a href={abog.inpreUrl} target="_blank" className="block group relative aspect-video rounded-3xl overflow-hidden border-2 border-slate-100 shadow-inner bg-slate-50">
              <img src={abog.inpreUrl} alt="Carnet" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-[#1a1a1a]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Eye size={30} className="text-[#D4AF37]" />
              </div>
            </a>
          </div>

          {/* Foto 2: La Selfie */}
          <div className="space-y-3">
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest italic">2. Validación de Identidad (Selfie)</p>
            <a href={abog.selfieUrl} target="_blank" className="block group relative aspect-video rounded-3xl overflow-hidden border-2 border-slate-100 shadow-inner bg-slate-50">
              {abog.selfieUrl ? (
                <img src={abog.selfieUrl} alt="Selfie" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-widest">Sin Selfie cargada</div>
              )}
              <div className="absolute inset-0 bg-[#1a1a1a]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Eye size={30} className="text-[#D4AF37]" />
              </div>
            </a>
          </div>
          
        </div>

        {/* ACCIONES */}
        <div className="flex gap-4">
          <button 
            onClick={() => aprobarAbogado(abog._id, abog.email, abog.nombre)} 
            className="flex-1 bg-[#1a1a1a] text-[#D4AF37] py-6 rounded-full text-[11px] font-black uppercase italic tracking-widest shadow-xl border-2 border-[#D4AF37] transition-all hover:bg-[#D4AF37] hover:text-[#1a1a1a] hover:scale-105 active:scale-95"
          >
            Aprobar Credenciales
          </button>
          <button 
          onClick={() => rechazarAbogado(abog._id, abog.email, abog.nombre)} // 🔥 Añadidos email y nombre
         className="flex-1 bg-[#1a1a1a] text-white py-6 rounded-full text-[11px] font-black uppercase italic tracking-widest border-2 border-white/10 transition-all duration-300 hover:bg-red-600 hover:border-red-400 hover:scale-105 active:scale-95 shadow-lg"
         >
          Rechazar
          </button>
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
                  <span className="text-[10px] font-black bg-[#1a1a1a] text-[#D4AF37] px-6 py-3 rounded-full uppercase italic tracking-widest border-2 border-[#D4AF37]">
                  {caso.categoria === "global" ? "LABORAL" : caso.categoria === "gestiones" ? "ADMINISTRATIVO" : caso.categoria}</span>
                  <span className="text-[10px] text-slate-400 font-black uppercase italic tracking-widest">{caso.ubicacion}</span>
                </div>
                
                {casoEnMatch === caso._id ? (
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
      )}
      {/* VISTA 2: EXPEDIENTES Y SOPORTES */}
      {pestanaActiva === 'expedientes' && (
        <div className="max-w-7xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
          {/* Este es el componente que acabamos de crear con toda la lógica visual */}
          <SeccionExpedientes 
            clientes={expedientesClientes} 
            abogados={expedientesAbogados} 
          />
          
          {/* Footer interno de la sección para dar contexto (Opcional, muy discreto) */}
          <div className="mt-8 text-center">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] italic">
              Base de Datos Auditada: {expedientesClientes.length} Clientes | {expedientesAbogados.length} Abogados
            </p>
          </div>
        </div>
      )}
      <footer className="mt-24 py-12 border-t-4 border-[#D4AF37]/10 text-center">
        <p className="text-slate-400 text-[10px] font-black tracking-[0.6em] uppercase italic">Control Maestro • TASF Venezuela • 2026</p>
      </footer>
    </main>
  );
}