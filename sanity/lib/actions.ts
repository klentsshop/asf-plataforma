"use server";

import { client } from './client';
import { validateUnicidad } from '@/app/lib/validators';
import { revalidatePath } from 'next/cache';

/**
 * ACCIÓN: Subir archivos/imágenes a Sanity Assets
 */
export const subirArchivoAsset = async (formData: FormData) => {
  try {
    const file = formData.get('file') as File;
    if (!file) return { success: false, error: "No se encontró el archivo" };

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const asset = await client.assets.upload('file', buffer, {
      filename: file.name,
      contentType: file.type,
    });

    return { success: true, assetId: asset._id, url: asset.url };
  } catch (error) {
    console.error("Error al subir activo a Sanity:", error);
    return { success: false, error: "Error técnico al subir archivo" };
  }
};

/**
 * PASO 1: Crear el caso de forma anónima (Triaje Inicial + Matchmaker)
 * Sincronizado con Schema: codigoExpediente y secuenciaExpediente
 */
export const crearCasoAnonimo = async (datos: any) => {
  try {
    const categoria = datos.categoria?.toString().trim().toLowerCase() || null;
    const ubicacion = datos.ubicacion?.toString().trim() || null;

    if (!categoria) {
      return { success: false, error: "Categoría no definida en triaje" };
    }

    if (!ubicacion) {
      return { success: false, error: "Ubicación requerida para el matchmaker" };
    }

    // LÓGICA DE MATCHMAKER — exact match
    const queryMatch = `*[_type == "abogado" && especialidad == $esp && ubicacion == $loc && estatus == "aprobado"][0]{ _id }`;

    const abogadoEncontrado = await client.fetch(queryMatch, { 
      esp: categoria, 
      loc: ubicacion
    });

    // ---- GENERACIÓN DE EXPEDIENTE PREMIUM ----
    const sequential = await client.fetch(`count(*[_type == "caso"])`);
    const nuevaSecuencia = sequential + 1;
    // Formato: ASF-2026-00001
    const codigoPremium = `ASF-${new Date().getFullYear()}-${String(nuevaSecuencia).padStart(5, "0")}`;

    // Creación del caso sincronizada con Schema
    const caso = await client.create({
      _type: 'caso',
      titulo: `${categoria.toUpperCase()} - ${ubicacion}`,
      categoria: categoria,
      ubicacion: ubicacion,
      descripcion: datos.descripcion || "",
      audioUrl: datos.audioUrl || "",
      tieneDocumentos: datos.tieneDocumentos === "Si",
      estado: 'analisis',
      pagoValidado: false, // 🔥 Inicializado en falso
      codigoExpediente: codigoPremium,
      secuenciaExpediente: nuevaSecuencia,
      abogadoAsignado: abogadoEncontrado 
        ? { _type: 'reference', _ref: abogadoEncontrado._id }
        : undefined,
      fechaCreacion: new Date().toISOString(),
    });

    return { success: true, casoId: caso._id, codigoPremium };
  } catch (error) {
    console.error("Error al crear caso anónimo con Matchmaker:", error);
    return { success: false, error: "Fallo en servidor de Sanity" };
  }
};

/**
 * ACCIÓN: Registrar Postulación de Abogado con Blindaje de Unicidad
 */
export const registrarPostulacionAbogado = async (datos: any, assetId: string) => {
  try {
    const erroresUnicidad = await validateUnicidad("abogado", { 
      cedula: datos.cedula, 
      email: datos.email,
      inpreabogado: datos.inpre 
    });

    if (erroresUnicidad) {
      return { success: false, errorType: "UNICIDAD", mensajes: erroresUnicidad };
    }

    const abogado = await client.create({
      _type: 'abogado',
      nombre: datos.nombre,
      cedula: datos.cedula,
      email: datos.email,
      telefono: datos.telefono,
      especialidad: datos.rama,
      inpreabogado: datos.inpre,
      pdfInpreabogado: {
        _type: 'file',
        asset: { _type: 'reference', _ref: assetId }
      },
      estatus: 'pendiente',
      verificado: false,
      fechaPostulacion: new Date().toISOString(),
    });

    return { success: true, abogadoId: abogado._id };
  } catch (error) {
    console.error("Error al registrar abogado:", error);
    return { success: false, error: "Error técnico en registro" };
  }
};

/**
 * PASO 2: Vincular Cliente al Caso (activación oficial)
 */
export const registrarYVincularCliente = async (casoId: string, datosCliente: any) => {
  try {
    const erroresUnicidad = await validateUnicidad("cliente", { 
      cedula: datosCliente.cedula, 
      email: datosCliente.email 
    });

    if (erroresUnicidad) {
      return { success: false, errorType: "UNICIDAD", mensajes: erroresUnicidad };
    }

    const cliente = await client.create({
      _type: 'cliente',
      nombre: datosCliente.nombre,
      cedula: datosCliente.cedula,
      email: datosCliente.email,
      telefono: datosCliente.telefono,
    });

    const existing = await client.fetch(
      `*[_type=="caso" && _id==$id][0]{ codigoExpediente }`,
      { id: casoId }
    );

    await client
      .patch(casoId)
      .set({
        cliente: { _type: 'reference', _ref: cliente._id },
        // Al vincularse, el estado se mantiene en análisis hasta que el abogado responda
        actualizacion: `Cliente ${datosCliente.nombre} vinculado al expediente.`,
      })
      .commit();

    return { 
      success: true, 
      clienteId: cliente._id, 
      casoId,
      codigoPremium: existing?.codigoExpediente || null 
    };
  } catch (error) {
    console.error("Error al vincular cliente:", error);
    return { success: false, error: "Error técnico en vinculación" };
  }
};

/**
 * 🔥 ACCIÓN ADMINISTRATIVA: Validar Pago (Dra. Liz)
 * Esta acción es la que "libera" el caso para el abogado.
 */
export const validarPagoCliente = async (casoId: string) => {
  try {
    await client
      .patch(casoId)
      .set({ 
        estado: 'gestion', 
        pagoValidado: true,
        fechaValidacionPago: new Date().toISOString(),
        actualizacion: "ASF: Pago verificado exitosamente. Iniciando gestión legal."
      })
      .commit();

    revalidatePath('/dashboard-abogado'); // Limpia caché para que el abogado lo vea de inmediato
    return { success: true };
  } catch (error) {
    console.error("Error al validar pago:", error);
    return { success: false, error: "No se pudo validar el pago" };
  }
};

/**
 * PASO 3: Validar acceso a la Bóveda
 */
export const validarAccesoBoveda = async (email: string, casoId: string) => {
  try {
    const query = `*[_type == "caso" && ( _id == $casoId || codigoExpediente == $casoId ) && cliente->email == $email][0]{
      _id,
      codigoExpediente,
      titulo,
      estado,
      pagoValidado, // 🔥 Agregado para el feedback visual del cliente
      descripcion,
      categoria,
      ubicacion,
      actualizacion,
      respuestaAbogado,
      presupuestoEstimado,
      "nombreCliente": cliente->nombre,
      "emailCliente": cliente->email,
      "documentosBoveda": documentosBoveda[]{
        "url": asset->url
      },
      "documentosPrueba": documentosPrueba[] {
        "url": asset->url,
        nombreOriginal,
        fechaCarga
      }
    }`;

    const resultado = await client.fetch(query, { casoId, email });

    if (resultado) {
      return { success: true, datos: resultado };
    } else {
      return { success: false, error: "Acceso Denegado. Verifique su ID." };
    }
  } catch (error) {
    console.error("Error al validar acceso:", error);
    return { success: false, error: "Error técnico de validación" };
  }
};