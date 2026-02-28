"use client";

import { useState, useEffect } from "react";
import { 
  Scale, User, Fingerprint, Mail, Briefcase, 
  FileUp, Send, Loader2, CheckCircle, 
  Image as ImageIcon, ChevronLeft, ShieldCheck, 
  Phone, MapPin, Camera, AlertCircle
} from "lucide-react";
import { client } from "@/sanity/lib/client";
import { useRouter } from "next/navigation";
// IMPORTANTE: Asegúrate que esta ruta sea correcta según tu proyecto
import { registrarPostulacionAbogado } from "@/sanity/lib/actions";

export default function RegistroAbogado() {
  const router = useRouter();
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [validando, setValidando] = useState(false);
  
  // 📸 ESTADOS PARA LAS DOS FOTOS
  const [archivoInpre, setArchivoInpre] = useState<File | null>(null);
  const [archivoSelfie, setArchivoSelfie] = useState<File | null>(null);
  
  const [errores, setErrores] = useState<{ cedula?: string; email?: string; inpre?: string }>({});
  
  const ramasLegales = [
    { title: '🏡 Civil(Propiedades)', value: 'propiedades' },
    { title: '👨‍👩‍👧‍👦 Familia(Relaciones)', value: 'familias' },
    { title: '💼 Mercantil(Negocios)', value: 'negocios' },
    { title: '⚖️ Penal(Defensas)', value: 'penal' },
    { title: '📄 Administrativo(Trámites)', value: 'gestiones' },
    { title: '⚖️ Laboral(Trabajadores)', value: 'global' },
  ];

  const estadosVenezuela = [
    "Amazonas", "Anzoátegui", "Apure", "Aragua", "Barinas", "Bolívar", "Carabobo", "Cojedes", 
    "Delta Amacuro", "Distrito Capital", "Falcón", "Guárico", "Lara", "Mérida", "Miranda", 
    "Monagas", "Nueva Esparta", "Portuguesa", "Sucre", "Táchira", "Trujillo", "Vargas", "Yaracuy", "Zulia"
  ];

  const [datos, setDatos] = useState({
    nombre: "", cedula: "", email: "", rama: "", inpre: "", telefono: "", ubicacion: ""
  });

  // 🛡️ VALIDADOR VISUAL EN TIEMPO REAL (DEBOUNCE)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (datos.cedula || datos.email || datos.inpre) {
        setValidando(true);
        const nuevosErrores: any = {};

        try {
          if (datos.cedula) {
            const exCed = await client.fetch(`*[(_type == "cliente" || _type == "abogado") && cedula == $val][0]`, { val: datos.cedula });
            if (exCed) nuevosErrores.cedula = "🚨 Documento ya registrado.";
          }
          if (datos.email) {
            const exMail = await client.fetch(`*[(_type == "cliente" || _type == "abogado") && email == $val][0]`, { val: datos.email });
            if (exMail) nuevosErrores.email = "🚨 Correo ya en uso.";
          }
          if (datos.inpre) {
            const exInpre = await client.fetch(`*[_type == "abogado" && inpreabogado == $val][0]`, { val: datos.inpre });
            if (exInpre) nuevosErrores.inpre = "🚨 Número INPRE ya registrado.";
          }

          setErrores(nuevosErrores);
        } catch (err) {
          console.error("Error validando:", err);
        } finally {
          setValidando(false);
        }
      }
    }, 600);
    return () => clearTimeout(delayDebounce);
  }, [datos.cedula, datos.email, datos.inpre]);

  const manejarRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errores).length > 0) return alert("Por favor, corrija los datos duplicados.");
    if (!archivoInpre || !archivoSelfie) return alert("Por favor, suba tanto el carnet como la selfie de validación.");
    
    setCargando(true);
    try {
      // 1. Subir Foto del Carnet
      const assetInpre = await client.assets.upload('file', archivoInpre);
      
      // 2. Subir Foto Selfie
      const assetSelfie = await client.assets.upload('file', archivoSelfie);

      // 3. Llamar a la acción del servidor (ESTO CREA EL ABOGADO CORRECTAMENTE)
      const res = await registrarPostulacionAbogado(datos, assetInpre._id, assetSelfie._id);

      if (res.success) {
        // 4. Enviar notificación por correo
        await fetch('/api/registro-abogado', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: datos.nombre, 
            email: datos.email, 
            inpre: datos.inpre,
            ubicacion: datos.ubicacion
          })
        });
        setEnviado(true);
      } else {
        alert(res.error || "Error en el registro.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error en el registro técnico.");
    } finally {
      setCargando(false);
    }
  };

  const hayErrores = Object.keys(errores).length > 0;

  if (enviado) return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-6 text-center font-sans relative">
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af3710_1px,transparent_1px),linear-gradient(to_bottom,#d4af3710_1px,transparent_1px)] bg-[size:45px_45px] z-0" />
       <div className="max-w-md bg-white p-12 rounded-[3.5rem] shadow-2xl border-4 border-[#D4AF37] relative z-10 animate-in zoom-in-95">
        <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-500 shadow-lg">
          <CheckCircle className="text-emerald-500" size={40} />
        </div>
        <h2 className="text-3xl font-black text-[#1a1a1a] uppercase italic tracking-tighter leading-none">Postulación Recibida</h2>
        <p className="text-slate-500 text-sm mt-4 font-bold italic leading-relaxed">
          Su documentación y selfie de validación han sido enviadas. En un plazo máximo de **3 días hábiles** recibirá sus claves.
        </p>
        <button onClick={() => router.push('/')} className="mt-8 px-10 py-4 bg-[#1a1a1a] text-[#D4AF37] rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl border-2 border-[#D4AF37]/50">Volver al Inicio</button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F3F4F6] py-16 px-6 flex flex-col items-center relative font-sans selection:bg-[#D4AF37] overflow-x-hidden">
      
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af371a_1px,transparent_1px),linear-gradient(to_bottom,#d4af371a_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <button onClick={() => router.push('/')} className="absolute top-8 left-8 flex items-center gap-3 text-[#1a1a1a] hover:opacity-70 transition-all group z-50 bg-white px-5 py-2.5 rounded-full border-2 border-[#D4AF37]/30 shadow-sm">
        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest italic">Volver</span>
      </button>

      <div className="max-w-3xl w-full bg-white border-4 border-[#D4AF37] p-10 md:p-14 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative z-10 animate-in zoom-in-95 duration-500">
        
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/5 rounded-full -mr-20 -mt-20 blur-3xl" />

        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-[#1a1a1a] text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl border-4 border-[#D4AF37]">
            {validando ? <Loader2 className="animate-spin" size={36} /> : <Scale size={36} />}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#00244C] uppercase italic tracking-tighter text-center leading-none">
            Registro <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#B8860B]">Profesional</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-3 italic text-center">Auditoría Biométrica TASF • 2026</p>
        </div>

        <form onSubmit={manejarRegistro} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: "Nombre Completo", icon: User, key: "nombre", type: "text", placeholder: "Nombre y Apellido" },
              { label: "Cédula / ID", icon: Fingerprint, key: "cedula", type: "text", placeholder: "Documento de Identidad" },
              { label: "WhatsApp / Teléfono", icon: Phone, key: "telefono", type: "tel", placeholder: "+58 4XX XXX XX XX" },
              { label: "Email Corporativo", icon: Mail, key: "email", type: "email", placeholder: "ejemplo@juridico.com" }
            ].map((field) => {
              const err = errores[field.key as keyof typeof errores];
              return (
                <div key={field.key} className="relative group">
                  <field.icon className={`absolute left-5 top-1/2 -translate-y-1/2 ${err ? 'text-red-500' : 'text-[#D4AF37]'}`} size={18} />
                  <input 
                    required 
                    type={field.type} 
                    placeholder={field.placeholder}
                    className={`w-full p-5 pl-14 bg-white border-4 rounded-2xl outline-none font-black text-xs transition-all shadow-md placeholder:text-slate-300 ${
                      err ? 'border-red-500 bg-red-50 text-red-600' : 'border-[#D4AF37]/30 focus:border-[#D4AF37] text-slate-700'
                    }`} 
                    onChange={(e)=>setDatos({...datos, [field.key]: e.target.value})} 
                  />
                  {err && <p className="text-[8px] text-red-500 font-black mt-1 ml-4 uppercase italic tracking-widest">{err}</p>}
                </div>
              );
            })}

            <div className="relative">
              <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={18} />
              <select 
                required 
                className="w-full p-5 pl-14 bg-white border-4 border-[#D4AF37]/30 rounded-2xl outline-none focus:border-[#D4AF37] appearance-none cursor-pointer transition-all font-black text-xs text-slate-700 shadow-md" 
                onChange={(e)=>setDatos({...datos, rama: e.target.value})}
              >
                <option value="">Especialidad</option>
                {ramasLegales.map(rama => (<option key={rama.value} value={rama.value}>{rama.title}</option>))}
              </select>
            </div>

            <div className="relative">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={18} />
              <select 
                required 
                className="w-full p-5 pl-14 bg-white border-4 border-[#D4AF37]/30 rounded-2xl outline-none focus:border-[#D4AF37] appearance-none cursor-pointer transition-all font-black text-xs text-slate-700 shadow-md" 
                onChange={(e)=>setDatos({...datos, ubicacion: e.target.value})}
              >
                <option value="">Estado de Jurisdicción</option>
                {estadosVenezuela.map(est => (<option key={est} value={est}>{est}</option>))}
              </select>
            </div>
          </div>

          <div className="relative">
            <ShieldCheck className={`absolute left-5 top-1/2 -translate-y-1/2 ${errores.inpre ? 'text-red-500' : 'text-[#D4AF37]'}`} size={18} />
            <input 
              required 
              type="text" 
              placeholder="NÚMERO DE INPREABOGADO (EJ: 298441)" 
              className={`w-full p-5 pl-14 bg-white border-4 rounded-2xl outline-none font-black text-xs transition-all shadow-md placeholder:text-slate-300 ${
                errores.inpre ? 'border-red-500 bg-red-50 text-red-600' : 'border-[#D4AF37]/30 focus:border-[#D4AF37] text-slate-700'
              }`} 
              onChange={(e)=>setDatos({...datos, inpre: e.target.value})} 
            />
            {errores.inpre && <p className="text-[8px] text-red-500 font-black mt-1 ml-4 uppercase italic tracking-widest">{errores.inpre}</p>}
          </div>

          {/* 🏛️ SECCIÓN DE CARGA DOBLE (CARNET + SELFIE) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            
            {/* CARGADOR 1: CARNET */}
            <div className={`relative border-4 border-dashed rounded-[2.5rem] p-8 transition-all flex flex-col items-center justify-center gap-4 ${archivoInpre ? 'border-emerald-500 bg-emerald-50/50' : 'border-[#D4AF37]/30 bg-white hover:border-[#D4AF37]'}`}>
              <input 
                required 
                type="file" 
                id="upload-carnet"
                accept="image/*" 
                className="hidden" 
                onChange={(e) => setArchivoInpre(e.target.files?.[0] || null)} 
              />
              {archivoInpre ? (
                <>
                  <ImageIcon className="text-emerald-500 animate-pulse" size={32} />
                  <div className="text-center min-w-0 max-w-full">
                    <span className="block text-[10px] text-emerald-600 font-black uppercase">Carnet Listo</span>
                    <span className="block text-[8px] text-slate-400 font-bold truncate max-w-[150px] mx-auto">{archivoInpre.name}</span>
                  </div>
                  <button type="button" onClick={() => setArchivoInpre(null)} className="text-[9px] text-red-400 underline uppercase font-black">Cambiar</button>
                </>
              ) : (
                <label htmlFor="upload-carnet" className="cursor-pointer flex flex-col items-center gap-3 group">
                  <div className="w-14 h-14 bg-[#1a1a1a] rounded-full flex items-center justify-center text-[#D4AF37] border-2 border-[#D4AF37] group-hover:scale-110 transition-transform shadow-lg">
                    <FileUp size={24} />
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] text-[#1a1a1a] font-black uppercase tracking-widest">Cargar Carnet</span>
                  </div>
                </label>
              )}
            </div>

            {/* CARGADOR 2: SELFIE */}
            <div className={`relative border-4 border-dashed rounded-[2.5rem] p-8 transition-all flex flex-col items-center justify-center gap-4 ${archivoSelfie ? 'border-emerald-500 bg-emerald-50/50' : 'border-[#D4AF37]/30 bg-white hover:border-[#D4AF37]'}`}>
              <input 
                required 
                type="file" 
                id="upload-selfie"
                accept="image/*" 
                className="hidden" 
                onChange={(e) => setArchivoSelfie(e.target.files?.[0] || null)} 
              />
              {archivoSelfie ? (
                <>
                  <Camera className="text-emerald-500 animate-pulse" size={32} />
                  <div className="text-center min-w-0 max-w-full">
                    <span className="block text-[10px] text-emerald-600 font-black uppercase">Selfie Lista</span>
                    <span className="block text-[8px] text-slate-400 font-bold truncate max-w-[150px] mx-auto">{archivoSelfie.name}</span>
                  </div>
                  <button type="button" onClick={() => setArchivoSelfie(null)} className="text-[9px] text-red-400 underline uppercase font-black">Cambiar</button>
                </>
              ) : (
                <label htmlFor="upload-selfie" className="cursor-pointer flex flex-col items-center gap-3 group">
                  <div className="w-14 h-14 bg-[#1a1a1a] rounded-full flex items-center justify-center text-[#D4AF37] border-2 border-[#D4AF37] group-hover:scale-110 transition-transform shadow-lg">
                    <Camera size={24} />
                  </div>
                  <div className="text-center">
                    <span className="block text-[10px] text-[#1a1a1a] font-black uppercase tracking-widest">Cargar Selfie</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          <button 
            disabled={cargando || hayErrores || validando || !archivoInpre || !archivoSelfie} 
            className={`w-full mt-8 p-6 rounded-2xl font-black text-sm tracking-[0.2em] uppercase transition-all italic flex items-center justify-center gap-3 shadow-2xl border-2 border-white ${
              (cargando || hayErrores || validando || !archivoInpre || !archivoSelfie) ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a1a1a] hover:scale-[1.02]"
            }`}
          >
            {cargando ? (
              <><Loader2 className="animate-spin" /> PROCESANDO...</>
            ) : hayErrores ? (
              "DATOS DUPLICADOS DETECTADOS"
            ) : (
              <><Send size={18} /> ENVIAR POSTULACIÓN OFICIAL</>
            )}
          </button>
        </form>
      </div>
      <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] mt-12 italic opacity-60">Tu Abogado Sin Fronteras Venezuela • 2026</p>
    </main>
  );
}