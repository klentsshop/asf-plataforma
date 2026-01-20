"use client";

import { crearCasoAnonimo, registrarYVincularCliente } from "../../../sanity/lib/actions";

/**
 * Capa de servicio encargada de las integraciones externas (Sanity + Resend).
 * Centraliza la persistencia de datos y la mensajería oficial.
 */

/**
 * Registra el caso inicial en Sanity de forma anónima para iniciar el Matchmaker.
 * @param seleccion Data con categoría (rama) y ubicación (estado).
 */
export async function crearCaso(seleccion: any) {
  const res = await crearCasoAnonimo(seleccion);
  return res; // Mantiene el contrato original: { success: boolean, casoId: string }
}

/**
 * Vincula la identidad del cliente (Nombre, Cédula, etc.) con el caso previamente creado.
 * @param casoId ID del documento en Sanity.
 * @param seleccion Datos de identidad del cliente.
 */
export async function vincularCliente(casoId: string, seleccion: any) {
  const res = await registrarYVincularCliente(casoId, seleccion);
  return res;
}

/**
 * Dispara el envío del correo electrónico con las credenciales de la Bóveda Segura.
 * @param payload Datos necesarios para la plantilla de Resend.
 */
export async function enviarCorreoBoveda(payload: {
  email: string;
  nombre: string;
  casoId: string;
  codigoExpediente?: string | null;
}) {
  const resp = await fetch("/api/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await resp.json();
  return { ok: resp.ok, data };
}