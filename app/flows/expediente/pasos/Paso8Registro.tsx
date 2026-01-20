"use client";
import { useState, useEffect } from "react";
import { Users, Fingerprint, Mail, Phone, Loader2, AlertCircle } from "lucide-react";
import { PasoProps } from "../expediente.types";
import { client } from "@/sanity/lib/client";

export function Paso8Registro({ seleccion, setSeleccion, finalizarRegistroOficial, cargando }: PasoProps) {
  const [errores, setErrores] = useState<{ cedula?: string; email?: string }>({});
  const [validando, setValidando] = useState(false);

  // 🛡️ EFECTO DE VALIDACIÓN CRUZADA (Clientes + Abogados)
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (seleccion.cedula || seleccion.email) {
        setValidando(true);
        const nuevosErrores: { cedula?: string; email?: string } = {};

        try {
          // Validar Cédula
          if (seleccion.cedula) {
            const existeCedula = await client.fetch(
              `*[(_type == "cliente" || _type == "abogado") && cedula == $cedula][0]`,
              { cedula: seleccion.cedula }
            );
            if (existeCedula) nuevosErrores.cedula = "🚨 Documento ya registrado en el sistema.";
          }

          // Validar Email
          if (seleccion.email) {
            const existeEmail = await client.fetch(
              `*[(_type == "cliente" || _type == "abogado") && email == $email][0]`,
              { email: seleccion.email }
            );
            if (existeEmail) nuevosErrores.email = "🚨 Este correo ya está en uso.";
          }

          setErrores(nuevosErrores);
        } catch (error) {
          console.error("Error en validación:", error);
        } finally {
          setValidando(false);
        }
      }
    }, 600); // Espera 600ms después de que el usuario deja de escribir

    return () => clearTimeout(delayDebounce);
  }, [seleccion.cedula, seleccion.email]);

  // Bloquear el botón si hay errores o está validando
  const hayErrores = Object.keys(errores).length > 0;

  return (
    <div className="w-full max-w-2xl animate-in zoom-in-95 duration-500 relative overflow-hidden">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border-4 border-[#D4AF37] text-center relative z-10">
        
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#D4AF37]/5 rounded-full -mr-20 -mt-20 blur-3xl" />
        
        <div className="w-16 h-16 bg-[#1a1a1a] text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl border-4 border-[#D4AF37]">
          {validando ? <Loader2 className="animate-spin" size={32} /> : <Fingerprint size={32} />}
        </div>

        <h2 className="text-3xl font-black text-[#00244C] mb-2 uppercase tracking-tighter italic">Registro de Identidad</h2>
        <p className="text-slate-400 text-[10px] mb-12 uppercase font-bold tracking-[0.2em] italic">Activación de Expediente y Cifrado de Datos</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10 text-left">
          {[
            { icon: Users, placeholder: "Nombre Completo", key: "nombre", type: "text" },
            { icon: Fingerprint, placeholder: "Cédula / ID", key: "cedula", type: "text" },
            { icon: Mail, placeholder: "Correo Electrónico", key: "email", type: "email" },
            { icon: Phone, placeholder: "WhatsApp", key: "telefono", type: "tel" }
          ].map(field => {
            const tieneError = errores[field.key as keyof typeof errores];
            return (
              <div key={field.key} className="relative group">
                <div className="flex items-center justify-between mb-1 px-2">
                   <label className="text-[9px] font-black text-slate-400 uppercase italic tracking-widest">{field.placeholder}</label>
                   {tieneError && <AlertCircle size={12} className="text-red-500 animate-pulse" />}
                </div>
                <div className="relative">
                  <field.icon className={`absolute left-5 top-1/2 -translate-y-1/2 ${tieneError ? 'text-red-500' : 'text-[#D4AF37]'}`} size={18} />
                  <input
                    required
                    type={field.type}
                    value={seleccion[field.key as keyof typeof seleccion] || ""}
                    className={`w-full p-5 pl-14 bg-white border-4 rounded-2xl outline-none font-black text-xs transition-all shadow-md placeholder:text-slate-300 ${
                      tieneError 
                        ? 'border-red-500 text-red-600 bg-red-50' 
                        : 'border-[#D4AF37]/30 focus:border-[#D4AF37] text-slate-700'
                    }`}
                    onChange={e => setSeleccion({ ...seleccion, [field.key]: e.target.value })}
                  />
                </div>
                {tieneError && (
                  <p className="text-[9px] text-red-500 font-bold mt-1 ml-2 uppercase italic">{tieneError}</p>
                )}
              </div>
            );
          })}
        </div>

        <button
          disabled={cargando || hayErrores || validando}
          onClick={finalizarRegistroOficial}
          className={`w-full mt-12 p-6 rounded-2xl font-black text-sm tracking-[0.2em] uppercase transition-all italic flex items-center justify-center gap-3 shadow-2xl border-2 border-white ${
            (cargando || hayErrores || validando)
              ? "bg-slate-200 text-slate-400 cursor-not-allowed opacity-70" 
              : "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a1a1a] hover:scale-[1.02] active:scale-95 shadow-[#D4AF37]/40"
          }`}
        >
          {cargando ? (
            <><Loader2 className="animate-spin" /> CIFRANDO...</>
          ) : hayErrores ? (
            "DATOS INVÁLIDOS O DUPLICADOS"
          ) : (
            "ACTIVAR MI DEFENSA OFICIAL"
          )}
        </button>

        <p className="mt-6 text-[8px] text-slate-400 font-bold uppercase tracking-widest opacity-60">
          Sus datos están protegidos por el protocolo de cifrado ASF-2026
        </p>
      </div>
    </div>
  );
}