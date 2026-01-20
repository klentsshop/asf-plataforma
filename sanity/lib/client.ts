import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  // Usamos el projectId del archivo env para que coincida con tu sanity.config
  projectId: projectId || 'keswdvsk', 
  dataset: dataset || 'production',
  apiVersion: apiVersion || '2024-01-01',
  // useCdn: false es obligatorio para que el "Push de pago" y el "Matchmaker" funcionen al instante
  useCdn: false, 
  // Tu token de editor permite que las Server Actions creen documentos (Abogados, Clientes, Casos)
  token: 'skQavYgmJOyKADzRzw9LFkHtoqVtpsV7CKC0LYOc5RviDMcB5Cb8Bq9fYfpw6y2bl9m9Zstwufc49VBP2Mrr66INqCjocwaqYhlsAdFac8I3De6KxkqfXpYVv6zoEEshsZsS2MxQvw6L88vNfvzKgAwQtHVZRwBLvs3A7JArEKdWJalxe2MQ',
  // Estas opciones aseguran que las imágenes y archivos se suban sin problemas
  ignoreBrowserTokenWarning: true,
})