"use client";

import { useRef } from "react";

/**
 * Hook especializado en la captura y procesamiento de evidencia por audio.
 * Gestiona el hardware del micrófono y la persistencia de archivos en Sanity.
 */
export function useExpedienteAudio(
  setCargando: (v: boolean) => void,
  setGrabando: (v: boolean) => void,
  setSeleccion: (fn: any) => void
) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  /**
   * Solicita acceso al hardware e inicia la captura de flujo de datos.
   */
  const iniciarGrabacion = async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices) return;

    if (mediaRecorderRef.current?.state === "recording") return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        setCargando(true);
        
        try {
          // Importación dinámica para mantener el core ligero
          const { client } = await import('../../../sanity/lib/client');
          
          // Subida del buffer de audio como un asset de Sanity
          const asset = await client.assets.upload(
            "file", 
            audioBlob, 
            { filename: `audio-caso-${Date.now()}.webm` }
          );
          
          // Vinculamos la URL del asset al expediente del cliente
          setSeleccion((prev: any) => ({ ...prev, audioUrl: asset.url }));
        } catch (e) {
          console.error("Error en carga de audio");
        } finally {
          setCargando(false);
          // Protocolo de seguridad: detener todas las pistas para apagar el LED del micrófono
          stream.getTracks().forEach((t) => t.stop());
        }
      };

      recorder.start();
      setGrabando(true);

    } catch (e) {
      console.error("Micrófono no disponible");
    }
  };

  /**
   * Detiene la captura y dispara el procesamiento del Blob.
   */
  const detenerGrabacion = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setGrabando(false);
    }
  };

  return { iniciarGrabacion, detenerGrabacion };
}