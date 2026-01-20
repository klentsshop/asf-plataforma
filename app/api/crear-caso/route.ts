import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, cedula, email, telefono, categoria, ubicacion, descripcion } = body;

    // 🛡️ 1. CREAR O BUSCAR AL CLIENTE (Evita duplicados)
    const cliente = await client.createOrReplace({
      _type: 'cliente',
      _id: `cliente-${cedula}`, // ID predecible basado en cédula
      nombre,
      cedula,
      email,
      telefono,
      fechaRegistro: new Date().toISOString(),
    });

    // 🔑 2. GENERAR LLAVE ÚNICA PARA EL MURO (Solución al error de Sanity)
    const mensajeInicial = {
      _key: Math.random().toString(36).substring(2, 9),
      mensaje: "Su expediente ha sido cifrado y cargado con éxito. La Dra. Liz asignará un especialista en las próximas horas.",
      fecha: new Date().toISOString(),
      emisor: "Plataforma"
    };

    // 🏛️ 3. CREAR EL CASO VINCULADO
    const nuevoCaso = await client.create({
      _type: 'caso',
      titulo: `${categoria.toUpperCase()} - ${ubicacion}`,
      categoria,
      ubicacion,
      descripcion,
      estado: 'analisis',
      cliente: {
        _type: 'reference',
        _ref: cliente._id
      },
      muroGestion: [mensajeInicial],
      fechaCreacion: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, id: nuevoCaso._id });

  } catch (error) {
    console.error("Error técnico:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}