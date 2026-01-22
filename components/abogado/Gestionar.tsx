"use client";

import { GestionarHeader } from "./GestionarHeader";
import { GestionarEvidencias } from "./GestionarEvidencias";
import { GestionarBoveda } from "./GestionarBoveda";
import { GestionarAcciones } from "./GestionarAcciones";

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
    onConcluirCaso // <-- 1. DESESTRUCTURAR AQUÍ
  } = props;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <GestionarHeader casoSeleccionado={casoSeleccionado} setVista={setVista} />

      <div className="bg-white rounded-[3.5rem] shadow-2xl border-2 border-[#D4AF37]/10 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#D4AF37]" />

        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* COLUMNA 1: EVIDENCIAS */}
          <GestionarEvidencias casoSeleccionado={casoSeleccionado} />

          {/* COLUMNA 2: BOVEDA */}
          <GestionarBoveda
            casoSeleccionado={casoSeleccionado}
            ofertaMonto={ofertaMonto}
            setOfertaMonto={setOfertaMonto}
            mensajeLegal={mensajeLegal}
            setMensajeLegal={setMensajeLegal}
            enviarActualizacionYPrecio={enviarActualizacionYPrecio}
            cargando={cargando}
          />

          {/* COLUMNA 3: ACCIONES */}
          <div className="p-10 flex flex-col justify-center">
            <GestionarAcciones
              casoSeleccionado={casoSeleccionado}
              cargando={cargando}
              manejarCargaInstrumentoAbogado={manejarCargaInstrumentoAbogado}
              onConcluirCaso={onConcluirCaso} // <-- 2. PASAR AL HIJO AQUÍ
            />
          </div>
        </div>
      </div>
    </div>
  );
}