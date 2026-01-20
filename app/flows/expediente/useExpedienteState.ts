"use client";

import { useState, useTransition } from "react";
import type { SeleccionCaso, NotificacionCaso } from "./expediente.types";

/**
 * Hook centralizador del estado del Onboarding Legal.
 * Gestiona la navegación, estados de carga, grabación y la data del cliente.
 */
export function useExpedienteState() {
  const [paso, setPaso] = useState<number>(1);
  const [cargando, setCargando] = useState<boolean>(false);
  const [grabando, setGrabando] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [casoIdGenerado, setCasoIdGenerado] = useState<string | null>(null);

  // Estado de la respuesta del abogado (Matchmaker result)
  const [notificacion, setNotificacion] = useState<NotificacionCaso>({
    activa: false,
    respuesta: null,
    monto: null,
    codigoExpediente: null,
  });

  // Data recolectada a través de los 8 pasos
  const [seleccion, setSeleccion] = useState<SeleccionCaso>({
    categoria: "",
    ubicacion: "",
    tieneDocumentos: "",
    descripcion: "",
    audioUrl: "",
    nombre: "",
    cedula: "",
    email: "",
    telefono: ""
  });

  // Manejo de transiciones suaves de React 18
  const [isPending, startTransition] = useTransition();

  /**
   * Orquestador de navegación entre pasos con debounce sutil para animaciones.
   */
  const navegarPaso = (nuevoPaso: number) => {
    if (cargando) return;

    setTimeout(() => {
      startTransition(() => {
        setPaso(nuevoPaso);
      });
    }, 50);
  };

  return {
    paso,
    setPaso,
    cargando,
    setCargando,
    grabando,
    setGrabando,
    isClient,
    setIsClient,
    casoIdGenerado,
    setCasoIdGenerado,
    notificacion,
    setNotificacion,
    seleccion,
    setSeleccion,
    isPending,
    startTransition,
    navegarPaso,
  };
}