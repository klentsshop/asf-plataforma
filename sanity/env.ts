export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-26'

// Intentamos leer de Sanity Studio, luego de Next.js, y finalmente usamos el valor directo
export const dataset = assertValue(
  process.env.SANITY_STUDIO_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  'Falta la variable de entorno: NEXT_PUBLIC_SANITY_DATASET o SANITY_STUDIO_DATASET'
)

// Reemplaza 'keswdvsk' si tu Project ID cambia en el futuro
export const projectId = assertValue(
  process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'keswdvsk',
  'Falta la variable de entorno: NEXT_PUBLIC_SANITY_PROJECT_ID o SANITY_STUDIO_PROJECT_ID'
)

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }
  return v
}