import { ArrowRight } from "lucide-react";
import React from 'react';

export const ServiceCard = ({ icon, title, desc, badge, accent, onClick, imageUrl }: any) => {
  const gradients: any = {
    yellow: "from-[#D4AF37] via-[#FDBF00] to-[#B8860B]",
    blue: "from-[#0052FF] via-[#0070FF] to-[#003EB3]",
    red: "from-[#8B0000] via-[#CF142B] to-[#5a0000]"
  };

  return (
    <div onClick={onClick} className="group relative bg-[#1a1a1a] rounded-2xl h-72 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] hover:-translate-y-2 cursor-pointer flex flex-col overflow-hidden text-left">
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-80 transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${imageUrl}')` }} />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="relative z-20 p-6 flex flex-col h-full justify-end">
        <div className="flex justify-between items-start mb-auto">
          <div className="p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 group-hover:bg-[#D4AF37] group-hover:text-black transition-colors duration-500">
            {icon}
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-[#D4AF37] text-black px-3 py-1 rounded-full italic shadow-lg">{badge}</span>
        </div>
        <h3 className="text-xl font-black text-white mb-1 tracking-tight uppercase italic">{title}</h3>
        <p className="text-white text-sm leading-snug mb-4 font-semibold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{desc}</p>
        <div className="flex items-center text-[#D4AF37] font-black text-[9px] tracking-widest uppercase pt-2 border-t border-white/10">
          CONSULTA GRATIS <ArrowRight className="w-3 h-3 ml-2 transition-transform group-hover:translate-x-2" />
        </div>
      </div>
      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${gradients[accent]} z-30`} />
    </div>
  );
};