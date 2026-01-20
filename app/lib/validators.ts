// app/lib/validators.ts

/**
 * Tipado de errores para mantener consistencia en toda la App
 * Se añade INPRE_DUPLICADO para el blindaje de abogados.
 */
export type ValidationErrorType =
  | "CEDULA_FORMATO"
  | "CEDULA_DUPLICADA"
  | "EMAIL_FORMATO"
  | "EMAIL_DUPLICADO"
  | "INPRE_DUPLICADO"
  | "CONSULTA_DUPLICADA";

/**
 * Validaciones de Formato (UI Preventiva)
 */
export const validateCedula = (cedula: string): string | null => {
  if (!cedula.match(/^[0-9]{5,12}$/)) return "Formato de cédula inválido (5-12 dígitos)";
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Email inválido";
  return null;
};

/**
 * Validación de Unicidad (Sanity Check)
 * Cruza datos en tiempo real para evitar duplicidad de identidades.
 * Ahora soporta opcionalmente inpreabogado para validaciones de expertos.
 */
export const validateUnicidad = async (
  tipo: "cliente" | "abogado", 
  datos: { cedula: string; email: string; inpreabogado?: string }
) => {
  const { client } = await import("@/sanity/lib/client");

  /**
   * Buscamos si ya existe alguien con esa cédula O ese email.
   * Si es un abogado y trae inpreabogado, también validamos ese campo único.
   */
  const query = `*[_type == $tipo && (
    cedula == $cedula || 
    email == $email || 
    (defined(inpreabogado) && inpreabogado == $inpre)
  )][0]{
    cedula, email, inpreabogado
  }`;

  const existente = await client.fetch(query, { 
    tipo, 
    cedula: datos.cedula, 
    email: datos.email,
    inpre: datos.inpreabogado || "" 
  });

  if (!existente) return null;

  const errores: ValidationErrorType[] = [];
  
  if (existente.cedula === datos.cedula) {
    errores.push("CEDULA_DUPLICADA");
  }
  
  if (existente.email === datos.email) {
    errores.push("EMAIL_DUPLICADO");
  }

  // Validación específica para el número de colegiado del abogado
  if (datos.inpreabogado && existente.inpreabogado === datos.inpreabogado) {
    errores.push("INPRE_DUPLICADO");
  }

  return errores.length > 0 ? errores : null;
};