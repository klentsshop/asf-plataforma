import { createClient } from '@sanity/client'

export const client = createClient({
  // Usamos process.env para que Netlify inyecte el valor real de forma segura
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, 
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false, 
  apiVersion: '2023-05-03',
  // Aquí usamos el token de escritura que ya guardamos en Netlify
  token: process.env.SANITY_API_WRITE_TOKEN, 
})