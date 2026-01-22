"use client";

import { Scale, LogOut } from "lucide-react";

type NavbarProps = {
  abogadoInfo: {
    nombre: string;
    especialidad: string;
    ubicacion: string;
  };
  setVista: (v: string) => void;
  cerrarSesion: () => void;
};

export function Navbar({ abogadoInfo, setVista, cerrarSesion }: NavbarProps) {
  return (
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
            <p className="text-[10px] font-black text-white leading-none uppercase tracking-widest italic">
              {abogadoInfo.nombre || "Especialista"}
            </p>
            <span className="text-[8px] text-[#D4AF37] font-bold uppercase italic">
              {abogadoInfo.especialidad} • {abogadoInfo.ubicacion}
            </span>
          </div>
          <button
            onClick={cerrarSesion}
            title="Cerrar Sesión"
            className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center text-[#1a1a1a] shadow-xl hover:bg-white transition-all group border border-white/20"
          >
            <LogOut size={18} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </nav>
  );
}
