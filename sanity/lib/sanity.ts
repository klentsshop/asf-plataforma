import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: 'keswdvsk', // Reemplaza con tu ID real
  dataset: 'production',
  useCdn: false, 
  apiVersion: '2023-05-03',
  token: 'TskNtm732AMypKt3rpsby9drvY7XDx6bEGdSl5q4FZJvsju5tyfDL4o0H3GyoDpptBADw2Ns9PQy0k1J8L5MTplxL3oKY9P0HyihwApLvlZ549meOLwOcg1qNOzPXaLSkKhRfU2ZWVH9myHe0IoNDBDDOr0OwJi3ZJ0L1kEA9tmCLQt6Rro6t', // Vital para poder CREAR casos desde la web
})