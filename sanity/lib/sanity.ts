import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'zy6vgrm7', // Reemplaza con tu ID real
  dataset: 'production',
  useCdn: false, 
  apiVersion: '2023-05-03',
  token: 'skpHMHn3AYDKgEMZp7pNTyGX8aDmdA7Mm1MT0lWvPWZ5JZBBpkjKjHThyqbILVJ8hBZN5qzuWrxWYFKa56WjMDoNBOjMUi5BcaybrPgm3LN6qXxxrTdwS7YIDtsl5MmhMyIxxgGScrZXmvgIkeBwP5yqs3aVt2L9vtttfWE5ZuZIVg7li5qo', // Vital para poder CREAR casos desde la web
})