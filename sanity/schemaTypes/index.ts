import { type SchemaTypeDefinition } from 'sanity'
import { abogado } from './abogado'
import { cliente } from './cliente'
import { caso } from './caso'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [abogado, cliente, caso],
}