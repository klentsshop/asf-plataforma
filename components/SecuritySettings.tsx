"use client";

import { useState } from "react";
import { Lock, ShieldAlert, CheckCircle, Loader2, KeyRound } from "lucide-react";
import { client } from "@/sanity/lib/client";

export function SecuritySettings({ abogadoId }: { abogadoId: string }) {
  const [cargando, setCargando] = useState(false);
  const [exito, setExito] = useState(false);
  const [passwords, setPasswords] = useState({ nueva: "", confirmar: "" });

  const actualizarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.nueva !== passwords.confirmar) return alert("Las contraseñas no coinciden.");
    if (passwords.nueva.length < 6) return alert("La clave debe tener al menos 6 caracteres.");

    setCargando(true);
    try {
      await client
        .patch(abogadoId)
        .set({ password: passwords.nueva })
        .commit();
      
      setExito(true);
      setTimeout(() => setExito(false), 5000);
    } catch (error) {
      alert("Error al actualizar la bóveda de seguridad.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-md bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 text-left animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-[#1a1a1a] p-2 rounded-xl text-[#D4AF37]">
          <KeyRound size={20} />
        </div>
        <div>
          <h2 className="text-sm font-black text-[#1a1a1a] uppercase tracking-tighter italic">Seguridad de Acceso</h2>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Actualice su clave de red</p>
        </div>
      </div>

      <form onSubmit={actualizarPassword} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Nueva Contraseña</label>
          <input 
            required
            type="password"
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#D4AF37] text-sm"
            onChange={(e) => setPasswords({...passwords, nueva: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase ml-2">Confirmar Contraseña</label>
          <input 
            required
            type="password"
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#D4AF37] text-sm"
            onChange={(e) => setPasswords({...passwords, confirmar: e.target.value})}
          />
        </div>

        {exito && (
          <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl flex items-center gap-3">
            <CheckCircle className="text-emerald-500" size={16} />
            <p className="text-[10px] text-emerald-700 font-bold uppercase italic">Clave actualizada con éxito</p>
          </div>
        )}

        <button 
          disabled={cargando}
          className="w-full p-4 bg-[#1a1a1a] text-[#D4AF37] rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
        >
          {cargando ? <Loader2 className="animate-spin" size={16} /> : "Actualizar Bóveda"}
        </button>
      </form>

      <div className="mt-6 flex items-start gap-2 bg-amber-50 p-3 rounded-xl border border-amber-100">
        <ShieldAlert className="text-amber-600 shrink-0" size={14} />
        <p className="text-[9px] text-amber-800 font-medium italic leading-relaxed">
          Su contraseña es personal e intransferible. ASF nunca le solicitará su clave por correo o WhatsApp.
        </p>
      </div>
    </div>
  );
}