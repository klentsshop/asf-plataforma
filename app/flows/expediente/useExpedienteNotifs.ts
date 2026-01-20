"use client";

import { useEffect } from "react";
import type { NotificacionCaso } from "./expediente.types";

/**
 * Hook encargado del Polling (consulta recurrente) a Sanity.
 * Mantiene la conexión activa para detectar respuestas del abogado en tiempo real.
 */
export function useExpedienteNotifs(setNotificacion: (v: NotificacionCaso) => void) {
  useEffect(() => {
    const verificarRespuesta = async () => {
      // Recuperamos el ID del caso desde el almacenamiento local
      const idLocal = localStorage.getItem("asf_caso_id");
      if (!idLocal) return;

      try {
        // Importación dinámica del cliente para optimizar la carga inicial
        const { client } = await import('../../../sanity/lib/client');
        
        // La query se mantiene íntegra para no romper la compatibilidad con Sanity
        const query = `*[_type == "caso" && _id == $id][0]{ 
          respuestaAbogado, 
          presupuestoEstimado,
          codigoExpediente 
        }`;

        const data = await client.fetch(query, { id: idLocal });

        // Si el abogado ya cargó la respuesta, activamos la campana dorada
        if (data?.respuestaAbogado) {
          setNotificacion({
            activa: true,
            respuesta: data.respuestaAbogado,
            monto: data.presupuestoEstimado,
            codigoExpediente: data.codigoExpediente
          });
        }

      } catch (e) {
        console.error("Error verificando estatus");
      }
    };

    // Ejecución inmediata al cargar y luego cada 10 segundos
    verificarRespuesta();
    const interval = setInterval(verificarRespuesta, 10000);
    
    // Limpieza del intervalo al desmontar el componente para evitar fugas de memoria
    return () => clearInterval(interval);
  }, [setNotificacion]);
}