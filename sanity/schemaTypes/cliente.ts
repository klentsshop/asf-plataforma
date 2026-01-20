import { defineField, defineType } from 'sanity'

export const cliente = defineType({
  name: 'cliente',
  title: 'Clientes',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre Completo',
      type: 'string',
      validation: (Rule) => Rule.required().min(3).error('El nombre es obligatorio para el expediente.'),
    }),
    defineField({
      name: 'cedula',
      title: 'Cédula de Identidad',
      type: 'string',
      description: 'Documento principal para validación legal en Venezuela',
      // 🛡️ BLINDAJE GLOBAL: Cédula Única (Clientes + Abogados)
      validation: (Rule) => Rule.required().custom(async (cedula, context) => {
        const client = context.getClient({ apiVersion: '2023-01-01' });
        const id = context.document?._id.replace('drafts.', '');
        
        const params = { cedula, id };
        // Busca duplicados en ambas colecciones
        const query = `*[(_type == "cliente" || _type == "abogado") && cedula == $cedula && _id != $id][0]`;
        const found = await client.fetch(query, params);
        
        if (found) {
          const tipo = found._type === 'cliente' ? 'un cliente' : 'un abogado';
          return `🚨 Esta cédula ya está registrada por ${tipo}. No se permiten duplicados globales.`;
        }
        return true;
      }),
    }),
    defineField({
      name: 'email',
      title: 'Correo Electrónico',
      type: 'string',
      // 🛡️ BLINDAJE GLOBAL: Email Único (Clientes + Abogados)
      validation: (Rule) => Rule.required().email().custom(async (email, context) => {
        const client = context.getClient({ apiVersion: '2023-01-01' });
        const id = context.document?._id.replace('drafts.', '');
        
        const params = { email, id };
        // Busca duplicados en ambas colecciones
        const query = `*[(_type == "cliente" || _type == "abogado") && email == $email && _id != $id][0]`;
        const found = await client.fetch(query, params);
        
        if (found) {
          const tipo = found._type === 'cliente' ? 'un cliente' : 'un abogado';
          return `🚨 Este correo ya pertenece a ${tipo} registrado.`;
        }
        return true;
      }),
    }),
    defineField({
      name: 'telefono',
      title: 'Teléfono / WhatsApp',
      type: 'string',
      description: 'Dato crítico: Solo visible para la Administración (Dra. Liz), oculto para los abogados.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'casosAsociados',
      title: 'Historial de Casos',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'caso' }] }],
      description: 'Lista de trámites que este cliente ha iniciado en la plataforma',
    }),
    defineField({
      name: 'pagoVerificado',
      title: '¿Cliente Solvente?',
      type: 'boolean',
      initialValue: false,
      description: 'Habilita la visibilidad del caso para los abogados una vez que la Dra. Liz confirme el pago.',
    }),
    defineField({
      name: 'fechaRegistro',
      title: 'Fecha de Registro',
      type: 'datetime',
      initialValue: (new Date()).toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'nombre',
      subtitle: 'cedula',
    },
  },
})