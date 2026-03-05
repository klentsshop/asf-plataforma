"use client";

import { LogOut } from "lucide-react";
// CORRECCIÓN DE RUTAS
import { BovedaNavbar } from "./BovedaNavbar";
import { BovedaStatusBar } from "./BovedaStatusBar";
import { BovedaLegal } from "./BovedaLegal";
import { BovedaRepositorio } from "./BovedaRepositorio";
import { BovedaFooter } from "./BovedaFooter";

type Props = {
  datosCaso: any;
  subiendoArchivo: boolean;
  manejarCargaArchivo: (e: any) => void;
  subirComprobante: (e: any) => void;
  // NUEVAS PROPS NECESARIAS PARA EL DESPLIEGUE:
  enviarMensajeAlAbogado: (mensaje: string) => Promise<void>;
  enviarResenaFinal: (resena: { rating: number; resenaTexto: string }) => Promise<void>;
};

export function BovedaMain({
  datosCaso,
  subiendoArchivo,
  manejarCargaArchivo,
  subirComprobante,
  enviarMensajeAlAbogado, // <--- Recibimos aquí
  enviarResenaFinal      // <--- Recibimos aquí
}: Props) {
  // Cálculo de lógica para la barra de estado
  const pasos = ['analisis', 'respondido', 'gestion', 'concluido'];
  const indiceActual = pasos.indexOf(datosCaso?.estado || 'analisis');

  return (
    <main className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans selection:bg-[#D4AF37]">

      {/* 🔹 Navbar */}
      <BovedaNavbar datosCaso={datosCaso} />

      {/* 🔹 Contenedor principal */}
      <div className="container mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8 text-left">
          {/* 🔸 Línea de estatus (BovedaStatusBar) */}
          <BovedaStatusBar indiceActual={indiceActual} />

          {/* 🔸 Comunicación + Pagos (BovedaLegal) */}
          <BovedaLegal
            datosCaso={datosCaso}
            subiendoArchivo={subiendoArchivo}
            subirComprobante={subirComprobante}
            indiceActual={indiceActual}
            // INYECTAMOS LAS FUNCIONES FALTANTES AQUÍ:
            enviarMensajeAlAbogado={enviarMensajeAlAbogado}
            enviarResenaFinal={enviarResenaFinal}
            manejarCargaArchivo={manejarCargaArchivo}
          />
        </div>

        {/* 🔹 Repositorio + Evidencias + Historial */}
        <BovedaRepositorio
          datosCaso={datosCaso}
        />
      </div>

      {/* 🔹 Footer */}
      <BovedaFooter />
    </main>
  );
}