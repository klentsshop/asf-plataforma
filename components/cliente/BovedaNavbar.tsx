"use client";

import { ShieldCheck, Bell, LogOut } from "lucide-react";

type Props = {
  datosCaso: any;
};

export function BovedaNavbar({ datosCaso }: Props) {
  
  // Función para cerrar sesión y limpiar persistencia
  const manejarSalida = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  // Intentamos obtener el nombre desde la relación con el cliente o el campo directo
  const nombreAMostrar = datosCaso?.cliente?.nombre || datosCaso?.nombreCliente || "Cliente ASF";

  return (
    <nav className="bg-[#1a1a1a] h-24 flex items-center px-8 border-b-4 border-[#D4AF37] sticky top-0 z-50 shadow-2xl">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo + título */}
        <div className="flex items-center gap-5">
          <div className="bg-[#D4AF37] p-3 rounded-2xl text-[#1a1a1a] shadow-lg border-2 border-white">
            <ShieldCheck size={28} />
          </div>
          <div className="text-left">
            <span className="text-white font-black uppercase text-lg tracking-tighter italic block leading-none">
              Bóveda Privada <span className="text-[#D4AF37]">ASF</span>
            </span>
            <p className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.4em] opacity-80 mt-1">
              Expediente Digital Protegido
            </p>
          </div>
        </div>

        {/* Datos + Campana + Logout */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end hidden md:flex text-right">
            <div className="flex items-center gap-4">
              {/* Campana de Notificaciones */}
              {datosCaso?.notificacionPendiente && (
                <div className="relative animate-bounce">
                  <Bell
                    size={20}
                    className="text-[#D4AF37] fill-[#D4AF37]"
                  />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1a1a1a]"></span>
                </div>
              )}

              {/* NOMBRE DEL CLIENTE EN DORADO (Estilo Abogado) */}
              <p className="text-[#D4AF37] text-sm font-black uppercase italic tracking-tighter leading-none">
                {nombreAMostrar}
              </p>
            </div>

            {/* UBICACIÓN O ID (Estilo Abogado) */}
            <p className="text-[#D4AF37] text-[8px] font-bold uppercase italic tracking-widest mt-1 opacity-70">
               {datosCaso?.ubicacion || "Jurisdicción Nacional"} • ID: {datosCaso?._id?.substring(0, 8).toUpperCase()}
            </p>
          </div>

          {/* LA PUERTA DORADA (Estilo Idéntico al Dashboard) */}
          <button
            onClick={manejarSalida}
            title="Cerrar Sesión Segura"
            className="w-12 h-12 bg-[#D4AF37] text-[#1a1a1a] rounded-2xl flex items-center justify-center border-2 border-white shadow-xl hover:scale-110 transition-all active:scale-95 group"
          >
            <LogOut size={22} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </nav>
  );
}