"use client";

import { GestionarHeader } from "./GestionarHeader";
import { GestionarEvidencias } from "./GestionarEvidencias";
import { GestionarBoveda } from "./GestionarBoveda";
import { GestionarAcciones } from "./GestionarAcciones";
import { CheckCircle2 } from "lucide-react"; 

// 🛡️ DEFINICIÓN DE PROPS (Líneas 1-15 para evitar errores)
type Props = {
  casoSeleccionado: any;
  vista: string;
  setVista: (v: string) => void;
  cargando: boolean;
  mensajeLegal: string;
  setMensajeLegal: (v: string) => void;
  ofertaMonto: string;
  setOfertaMonto: (v: string) => void;
  manejarCargaInstrumentoAbogado: (e: any) => void;
  enviarActualizacionYPrecio: () => void;
  onConcluirCaso: () => void;
};

export function Gestionar(props: Props) {
  const {
    casoSeleccionado,
    setVista,
    ofertaMonto,
    setOfertaMonto,
    mensajeLegal,
    setMensajeLegal,
    cargando,
    manejarCargaInstrumentoAbogado,
    enviarActualizacionYPrecio,
    onConcluirCaso
  } = props;

  const esConcluido = casoSeleccionado?.estado === 'concluido';

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500 space-y-6 pb-20">
      {/* 1. CABECERA */}
      <GestionarHeader casoSeleccionado={casoSeleccionado} setVista={setVista} />

      {/* 2. GRILLA DINÁMICA */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* COLUMNA IZQUIERDA: EVIDENCIAS */}
        <div className="lg:col-span-1 order-3 lg:order-1">
          <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
             <GestionarEvidencias casoSeleccionado={casoSeleccionado} />
          </div>
        </div>

        {/* COLUMNA CENTRAL: BOVEDA/MENSAJES */}
        <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
          <div className="bg-white rounded-[3rem] shadow-2xl border-t-8 border-[#D4AF37] overflow-hidden">
            <GestionarBoveda
              casoSeleccionado={casoSeleccionado}
              ofertaMonto={ofertaMonto}
              setOfertaMonto={setOfertaMonto}
              mensajeLegal={mensajeLegal}
              setMensajeLegal={setMensajeLegal}
              enviarActualizacionYPrecio={enviarActualizacionYPrecio}
              cargando={cargando}
            />
          </div>

          {/* ✅ BOTÓN DE CIERRE: ESTILO NEGRO Y DORADO AL FINAL */}
          {!esConcluido && casoSeleccionado?.pagoValidado && (
            <div className="pt-10 flex flex-col items-center gap-4">
              <button
                onClick={onConcluirCaso}
                disabled={cargando}
                className="w-full max-w-md py-5 bg-[#1a1a1a] border-2 border-[#D4AF37] text-[#D4AF37] rounded-[2rem] font-black text-[9px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all duration-300 shadow-xl italic hover:bg-[#D4AF37] hover:text-[#1a1a1a] active:scale-95 disabled:opacity-50"
              >
                {cargando ? (
                   <span className="flex items-center gap-2">
                     <div className="animate-spin h-3 w-3 border-2 border-[#D4AF37] border-t-transparent rounded-full" />
                     PROCESANDO CIERRE...
                   </span>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    FINALIZAR EXPEDIENTE Y SOLICITAR RESEÑA
                  </>
                )}
              </button>
              <p className="text-[8px] text-slate-400 font-bold uppercase italic">
                Esta acción es irreversible y notificará al cliente.
              </p>
            </div>
          )}
        </div>

        {/* COLUMNA DERECHA: PANEL DE ARCHIVOS */}
        <div className="lg:col-span-1 order-2 lg:order-3 lg:sticky lg:top-8">
          <div className="bg-[#1a1a1a] p-8 rounded-[2.5rem] shadow-2xl border-b-8 border-[#D4AF37]">
            <h4 className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.3em] mb-6 italic text-center">
              INSTRUMENTOS LEGALES
            </h4>
            
            <GestionarAcciones
              casoSeleccionado={casoSeleccionado}
              cargando={cargando}
              manejarCargaInstrumentoAbogado={manejarCargaInstrumentoAbogado}
              onConcluirCaso={() => {}} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}