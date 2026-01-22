"use client";

import { Mail, FileText, ShieldCheck, Loader2, ChevronLeft } from "lucide-react";

type Props = {
  credenciales: { email: string; casoId: string };
  setCredenciales: (c: any) => void;
  validarAcceso: () => void;
  cargando: boolean;
  router: any;
};

export function BovedaLogin({
  credenciales,
  setCredenciales,
  validarAcceso,
  cargando,
  router
}: Props) {
  return (
    <main className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white border-4 border-[#D4AF37] p-10 rounded-[3rem] shadow-2xl relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-[#D4AF37] to-[#B8860B]" />
        
        <button
          onClick={() => router.push("/")}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-[#D4AF37] font-black uppercase text-[10px] tracking-widest italic transition-all mx-auto"
        >
          <ChevronLeft size={16} /> Volver al Inicio
        </button>

        <div className="w-24 h-24 bg-[#1a1a1a] text-[#D4AF37] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl border-2 border-[#D4AF37]">
          <ShieldCheck size={40} />
        </div>

        <h1 className="text-3xl font-black text-[#1a1a1a] uppercase tracking-tighter mb-2 italic">
          Acceso a Bóveda
        </h1>

        <p className="text-slate-400 text-[10px] mb-10 uppercase tracking-[0.3em] font-bold italic">
          Protocolo de Seguridad Nivel Militar
        </p>

        <div className="space-y-5 text-left">
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={18} />
            <input
              type="email"
              placeholder="EMAIL DE REGISTRO"
              className="w-full p-5 pl-14 bg-white border-4 border-[#D4AF37]/20 rounded-2xl outline-none focus:border-[#D4AF37] font-black text-xs text-[#1a1a1a] transition-all"
              onChange={(e) => setCredenciales({ ...credenciales, email: e.target.value })}
            />
          </div>

          <div className="relative group">
            <FileText className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={18} />
            <input
              type="text"
              placeholder="ID DE EXPEDIENTE"
              className="w-full p-5 pl-14 bg-white border-4 border-[#D4AF37]/20 rounded-2xl outline-none focus:border-[#D4AF37] font-black text-xs text-[#1a1a1a] transition-all"
              onChange={(e) => setCredenciales({ ...credenciales, casoId: e.target.value })}
            />
          </div>

          <button
            onClick={validarAcceso}
            disabled={cargando}
            className="w-full p-6 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a1a1a] font-black uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-3 mt-6 shadow-2xl hover:scale-[1.02] active:scale-95 border-2 border-white italic text-xs"
          >
            {cargando ? <Loader2 className="animate-spin" /> : <>
              <ShieldCheck size={20} /> DESBLOQUEAR EXPEDIENTE
            </>}
          </button>
        </div>

        <p className="mt-10 text-[9px] text-slate-400 font-bold uppercase italic tracking-widest leading-relaxed text-center">
          Abogados Sin Fronteras • Conexión Segura TLS 1.3
        </p>
      </div>
    </main>
  );
}
