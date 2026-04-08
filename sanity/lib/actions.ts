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

    // ---- GENERACIÓN DE EXPEDIENTE PREMIUM ----
    const sequential = await client.fetch(`count(*[_type == "caso"])`);
    const nuevaSecuencia = sequential + 1;
    // Formato: ASF-2026-00001
    const codigoPremium = `TASF-${new Date().getFullYear()}-${String(nuevaSecuencia).padStart(5, "0")}`;

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
     abogadoAsignado: undefined,
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
export const registrarPostulacionAbogado = async (datos: any, carnetId: string, 
  selfieId: string) => {
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
      ubicacion: datos.ubicacion,
      
      // FOTO 1: CARNET NITIDO
      pdfInpreabogado: {
        _type: 'file',
        asset: { _type: 'reference', _ref: carnetId }
      },
      
      // FOTO 2: ABOGADO SOSTENIENDO EL CARNET (NUEVO)
      fotoSelfieInpre: {
        _type: 'file',
        asset: { _type: 'reference', _ref: selfieId }
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
    // 1. Validamos unicidad (Mantenemos tu lógica original de validación)
    const erroresUnicidad = await validateUnicidad("cliente", { 
      cedula: datosCliente.cedula, 
      email: datosCliente.email 
    });

    let clienteId: string;

    if (erroresUnicidad) {
      // 2. LÓGICA DE RECURRENCIA Y SEGURIDAD CRÍTICA
      // Buscamos al cliente que tiene ese correo o esa cédula
      const clienteExistente = await client.fetch(
        `*[_type == "cliente" && (email == $email || cedula == $cedula)][0]{ _id, email, cedula }`,
        { email: datosCliente.email, cedula: datosCliente.cedula }
      );

      if (clienteExistente) {
        // 🔒 EL CERROJO DE SEGURIDAD:
        // Si el correo ya existe en la base de datos, pero la cédula ingresada es diferente
        // a la cédula registrada para ese correo, bloqueamos por riesgo de suplantación.
        if (clienteExistente.email === datosCliente.email && clienteExistente.cedula !== datosCliente.cedula) {
          return { 
            success: false, 
            errorType: "SEGURIDAD", 
            mensajes: { email: "🚨 Identidad no coincide con el registro oficial. Verifique su Cédula." } 
          };
        }

        clienteId = clienteExistente._id;
      } else {
        // Si el error de unicidad es real pero no lo encontramos (raro), devolvemos el error original
        return { success: false, errorType: "UNICIDAD", mensajes: erroresUnicidad };
      }
    } else {
      // 3. Si NO existe, lo creamos como siempre
      const nuevoCliente = await client.create({
        _type: 'cliente',
        nombre: datosCliente.nombre,
        cedula: datosCliente.cedula,
        email: datosCliente.email,
        telefono: datosCliente.telefono,
      });
      clienteId = nuevoCliente._id;
    }

    // 4. Obtenemos el código de expediente para el retorno (Dato fiel al original)
    const existing = await client.fetch(
      `*[_type=="caso" && _id==$id][0]{ codigoExpediente }`,
      { id: casoId }
    );

    // 5. Vinculamos el caso al cliente (Nuevo o Recurrente)
    await client
      .patch(casoId)
      .set({
        cliente: { _type: 'reference', _ref: clienteId },
        actualizacion: `Cliente ${datosCliente.nombre} vinculado al expediente oficial.`,
      })
      .commit();

    return { 
      success: true, 
      clienteId: clienteId, 
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
        actualizacion: "TASF: Pago verificado exitosamente. Iniciando gestión legal."
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
export const validarAccesoBoveda = async (email: string, idIngresado: string) => {
  try {
    // 1. Validación de identidad (Confirmamos que el usuario tiene permiso)
    const accesoValido = await client.fetch(
      `*[_type == "caso" && ( _id == $idIngresado || codigoExpediente == $idIngresado ) && cliente->email == $email][0]{ _id }`,
      { idIngresado, email }
    );

    if (!accesoValido) {
      return { success: false, error: "Acceso Denegado. Credenciales no reconocidas." };
    }

    // Eliminamos el "order desc [0]" por email para que respete el clic del usuario
    const query = `*[_type == "caso" && _id == $idReal][0]{
      _id,
      codigoExpediente,
      titulo,
      estado,
      pagoValidado,
      descripcion,
      categoria,
      ubicacion,
      actualizacion,
      respuestaAbogado,
      presupuestoEstimado,
      notificacionPendiente,
      rating,
      resenaTexto,
      mensajeCliente,
      comprobantePago,
      cliente->{
        _id,
        nombre,
        email,
        cedula
      },
      "documentosBoveda": documentosBoveda[]{
        "url": asset->url,
        nombreOriginal,
        fechaCarga
      },
      "documentosPrueba": documentosPrueba[] {
        ...,
        "url": asset->url
      }
    }`;

    // Cambiamos el fetch para que use 'idReal' en lugar de solo el email
    const resultado = await client.fetch(query, { idReal: accesoValido._id });

    if (resultado) {
      return { success: true, datos: resultado };
    } else {
      return { success: false, error: "No se encontró el expediente solicitado." };
    }
  } catch (error) {
    console.error("Error al validar acceso:", error);
    return { success: false, error: "Error técnico de validación" };
  }
};