"use client";

import { Users, Clock, FileText, KeyRound, ShieldCheck } from "lucide-react";

type SidebarProps = {
  vista: string;
  setVista: (v: string) => void;
};

const NavItem = ({ icon, label, active = false, onClick }: any) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active
        ? "bg-[#1a1a1a] text-[#D4AF37] shadow-lg shadow-black/10"
        : "text-slate-500 hover:bg-slate-50 hover:text-[#1a1a1a]"
    }`}
  >
    {icon}
    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </div>
);

export function Sidebar({ vista, setVista }: SidebarProps) {
  return (
    <aside className="w-full md:w-64 bg-white border-r-2 border-slate-200 p-6 flex flex-col justify-between shrink-0 text-left">
      <div className="space-y-8">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 italic pl-4">
            Menú de Gestión
          </p>
          <nav className="space-y-2">
            <NavItem
              onClick={() => setVista("bandeja")}
              icon={<Clock size={18} />}
              label="Casos"
              active={vista === "bandeja"}
            />
            <NavItem
              onClick={() => setVista("clientes")}
              icon={<Users size={18} />}
              label="Procesos"
              active={vista === "clientes"}
            />
            <NavItem
              onClick={() => setVista("expedientes")}
              icon={<FileText size={18} />}
              label="Procesos Concluidos"
              active={vista === "expedientes"}
            />
            <NavItem
              onClick={() => setVista("seguridad")}
              icon={<KeyRound size={18} />}
              label="Seguridad"
              active={vista === "seguridad"}
            />
          </nav>
        </div>
      </div>

      <div className="bg-[#1a1a1a] p-5 rounded-[2rem] border-2 border-[#D4AF37]/40 shadow-2xl text-left">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={14} className="text-[#D4AF37]" />
          <p className="text-[9px] font-black text-[#D4AF37] uppercase italic tracking-widest">
            Identidad Legal
          </p>
        </div>
        <p className="text-white text-[10px] font-bold italic tracking-tighter opacity-80 uppercase leading-none">
          Abogado Verificado
        </p>
      </div>
    </aside>
  );
}
