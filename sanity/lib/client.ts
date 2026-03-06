import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  // Usamos el projectId del archivo env para que coincida con tu sanity.config
  projectId: projectId || 'zy6vgrm7', 
  dataset: dataset || 'production',
  apiVersion: apiVersion || '2024-01-01',
  // useCdn: false es obligatorio para que el "Push de pago" y el "Matchmaker" funcionen al instante
  useCdn: false, 
  // Tu token de editor permite que las Server Actions creen documentos (Abogados, Clientes, Casos)
  token: 'skpHMHn3AYDKgEMZp7pNTyGX8aDmdA7Mm1MT0lWvPWZ5JZBBpkjKjHThyqbILVJ8hBZN5qzuWrxWYFKa56WjMDoNBOjMUi5BcaybrPgm3LN6qXxxrTdwS7YIDtsl5MmhMyIxxgGScrZXmvgIkeBwP5yqs3aVt2L9vtttfWE5ZuZIVg7li5qo',
  // Estas opciones aseguran que las imágenes y archivos se suban sin problemas
  ignoreBrowserTokenWarning: true,
})