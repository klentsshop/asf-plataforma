"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Scale, Lock, Mail, Loader2, 
  ChevronRight, AlertCircle, ShieldCheck,
  ChevronLeft, Fingerprint
} from "lucide-react";
import { client } from "@/sanity/lib/client";

export default function LoginAbogado() {
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credenciales, setCredenciales] = useState({ email: "", password: "" });

  const manejarLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError(null);

    try {
      // 🛡️ CONSULTA DE SEGURIDAD ASF: Incluye ubicación y especialidad para el Matchmaker
      const query = `*[_type == "abogado" && email == $email && password == $password][0]{
        _id,
        nombre,
        email,
        estatus,
        ubicacion,
        especialidad
      }`;
      
      const abogado = await client.fetch(query, { 
        email: credenciales.email, 
        password: credenciales.password 
      });

      if (!abogado) {
        setError("Las credenciales no coinciden con nuestros registros.");
        setCargando(false);
        return;
      }

      // ⚖️ VALIDACIÓN DE ESTATUS (Protocolo de 3 días)
      if (abogado.estatus === 'pendiente') {
        setError("Su cuenta está en proceso de validación (Plazo: 3 días hábiles).");
        setCargando(false);
        return;
      }

      if (abogado.estatus === 'rechazado') {
        setError("Su acceso ha sido denegado por el departamento de credenciales.");
        setCargando(false);
        return;
      }

      // 💾 PERSISTENCIA TOTAL PARA MATCHMAKER LOCAL
      localStorage.setItem("asf_abogado_id", abogado._id);
      localStorage.setItem("asf_abogado_nombre", abogado.nombre);
      localStorage.setItem("asf_abogado_ubicacion", abogado.ubicacion);
      localStorage.setItem("asf_abogado_especialidad", abogado.especialidad);
      
      router.push("/dashboard"); 

    } catch (err) {
      setError("Error de conexión con el servidor de seguridad.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center p-6 relative font-sans selection:bg-[#D4AF37] overflow-hidden">
      
      {/* 🧭 FONDO DE CUADRÍCULA DORADA ASF */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#d4af371a_1px,transparent_1px),linear-gradient(to_bottom,#d4af371a_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* 🏛️ CONTENEDOR ESTILO PASO 8 */}
      <div className="max-w-md w-full relative z-10 animate-in zoom-in-95 duration-500">
        
        {/* ELEMENTO DECORATIVO BLUR */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/10 rounded-full -mr-20 -mt-20 blur-3xl" />

        <div className="bg-white p-12 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-4 border-[#D4AF37] text-center relative z-10">
          
         {/* 🔙 BOTÓN VOLVER INTEGRADO (Corrección de Bucle) */}
<div className="flex justify-start mb-4">
  <button 
    onClick={() => window.location.href = "/"} // 🔥 CAMBIO CLAVE: Ruta fija al inicio
    className="flex items-center gap-2 text-[#1a1a1a] hover:opacity-70 transition-all group bg-white px-4 py-2 rounded-full border-2 border-[#D4AF37]/30 shadow-sm"
  >
    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
    <span className="text-[9px] font-black uppercase tracking-widest italic">Volver</span>
  </button>
</div>

          {/* ICONO CENTRAL ASF */}
          <div className="w-20 h-20 bg-[#1a1a1a] text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl border-4 border-[#D4AF37]">
            <Scale size={36} />
          </div>

          <h1 className="text-3xl font-black text-[#00244C] mb-2 uppercase tracking-tighter italic">
            Acceso <span className="text-[#D4AF37]">Red ASF</span>
          </h1>
          <p className="text-slate-400 text-[10px] mb-12 uppercase font-bold tracking-[0.3em] italic leading-none">
            Panel de Especialistas Venezuela
          </p>

          <form onSubmit={manejarLogin} className="space-y-5">
            
            {/* INPUT EMAIL BURBUJA */}
            <div className="space-y-2 text-left">
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37] transition-colors" size={18} />
                <input 
                  required 
                  type="email" 
                  placeholder="CORREO PROFESIONAL"
                  className="w-full p-5 pl-14 bg-white border-4 border-[#D4AF37]/30 rounded-2xl outline-none focus:border-[#D4AF37] font-black text-xs transition-all text-slate-700 shadow-md placeholder:text-slate-300" 
                  onChange={(e) => setCredenciales({...credenciales, email: e.target.value})}
                />
              </div>
            </div>

            {/* INPUT CLAVE BURBUJA */}
            <div className="space-y-2 text-left">
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37] transition-colors" size={18} />
                <input 
                  required 
                  type="password" 
                  placeholder="CLAVE DE ACCESO"
                  className="w-full p-5 pl-14 bg-white border-4 border-[#D4AF37]/30 rounded-2xl outline-none focus:border-[#D4AF37] font-black text-xs transition-all text-slate-700 shadow-md placeholder:text-slate-300" 
                  onChange={(e) => setCredenciales({...credenciales, password: e.target.value})}
                />
              </div>
            </div>

            {/* ERROR ALERT LUXURY */}
            {error && (
              <div className="bg-red-50 border-2 border-red-500/20 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in-95">
                <AlertCircle className="text-red-500 shrink-0" size={18} />
                <p className="text-[10px] text-red-600 font-black uppercase leading-tight italic tracking-tighter">{error}</p>
              </div>
            )}

            {/* BOTÓN DE ENTRADA PREMIUM */}
            <button 
              disabled={cargando}
              className={`w-full mt-8 p-6 rounded-2xl font-black text-sm tracking-[0.2em] uppercase transition-all italic flex items-center justify-center gap-3 shadow-2xl border-2 border-white ${
                cargando ? "bg-slate-50 text-slate-300" : "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a1a1a] hover:scale-[1.02]"
              }`}
            >
              {cargando ? (
                <><Loader2 className="animate-spin" /> VERIFICANDO...</>
              ) : (
                <><Fingerprint size={18} /> Entrar al Panel <ChevronRight size={18} /></>
              )}
            </button>
          </form>

          {/* FOOTER DE LOGIN */}
          <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-[#D4AF37] opacity-60">
              <ShieldCheck size={14} />
              <span className="text-[8px] font-black uppercase tracking-widest italic">Conexión Cripto-Blindada</span>
            </div>
            <p className="text-slate-400 text-[9px] uppercase font-bold text-center italic tracking-[0.1em]">
              ¿No tienes cuenta? <span className="text-[#00244C] cursor-pointer hover:text-[#D4AF37] transition-colors" onClick={() => router.push('/registro-abogado')}>Postúlate aquí</span>
            </p>
          </div>
        </div>
      </div>
      
      <p className="text-center text-[9px] text-slate-400 font-black uppercase tracking-[0.4em] mt-12 italic opacity-60">
        Abogados Sin Fronteras Venezuela • 2026
      </p>
    </main>
  );
}