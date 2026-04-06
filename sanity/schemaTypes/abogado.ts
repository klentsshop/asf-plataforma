import { defineField, defineType } from 'sanity'

export const abogado = defineType({
  name: 'abogado',
  title: 'Abogados',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre Completo',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Correo Electrónico',
      type: 'string',
      description: 'Se usará para el acceso a la plataforma',
      // 🛡️ BLINDAJE 1: Email Único Global (Abogados + Clientes)
      validation: (Rule) => Rule.required().email().custom(async (email, context) => {
        const client = context.getClient({ apiVersion: '2023-01-01' });
        const id = context.document?._id.replace('drafts.', '');
        const params = { email, id };
        // Busca en ambos tipos de documento
        const query = `*[(_type == "abogado" || _type == "cliente") && email == $email && _id != $id][0]`;
        const found = await client.fetch(query, params);
        
        if (found) {
          const tipo = found._type === 'abogado' ? 'un abogado' : 'un cliente';
          return `🚨 Este correo ya está registrado por ${tipo}.`;
        }
        return true;
      }),
    }),
    defineField({
      name: 'cedula',
      title: 'Cédula de Identidad',
      type: 'string',
      // 🛡️ BLINDAJE 2: Cédula Única Global (Abogados + Clientes)
      validation: (Rule) => Rule.required().custom(async (cedula, context) => {
        const client = context.getClient({ apiVersion: '2023-01-01' });
        const id = context.document?._id.replace('drafts.', '');
        const params = { cedula, id };
        // Busca en ambos tipos de documento para evitar que un cliente use cédula de abogado
        const query = `*[(_type == "abogado" || _type == "cliente") && cedula == $cedula && _id != $id][0]`;
        const found = await client.fetch(query, params);
        
        if (found) {
          const tipo = found._type === 'abogado' ? 'un abogado' : 'un cliente';
          return `🚨 Esta cédula ya pertenece a ${tipo} en el sistema.`;
        }
        return true;
      }),
    }),
    defineField({
      name: 'telefono',
      title: 'Número de Teléfono / WhatsApp',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'inpreabogado',
      title: 'Número de Inpreabogado (Carnet)',
      type: 'string',
      description: 'Número de registro profesional.',
      // 🛡️ BLINDAJE 3: INPRE Único
      validation: (Rule) => Rule.required().custom(async (inpre, context) => {
        const client = context.getClient({ apiVersion: '2023-01-01' });
        const id = context.document?._id.replace('drafts.', '');
        const params = { inpre, id };
        const query = `*[_type == "abogado" && inpreabogado == $inpre && _id != $id][0]`;
        const found = await client.fetch(query, params);
        return found ? '🚨 Este número de Inpreabogado ya está registrado.' : true;
      }),
    }),
    defineField({
      name: 'pdfInpreabogado',
      title: 'Carga de Carnet (Imagen/PDF)',
      type: 'file',
      options: { 
        accept: '.jpg,.jpeg,.png,.pdf' 
      },
      description: 'Documento que la administradora revisará para aprobar el registro.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
  name: 'fotoSelfieInpre', // 👈 Nuevo campo
  title: 'Selfie con el Carnet',
  type: 'file',
   }),

    defineField({
      name: 'especialidad',
      title: 'Especialidad',
      description: 'Debe coincidir con la categoría del caso para el Match.',
      type: 'string',
      options: {
        list: [
          { title: '🏡 Propiedades', value: 'propiedades' },
          { title: '👨‍👩‍👧‍👦 Familias', value: 'familias' },
          { title: '💼 Negocios', value: 'negocios' },
          { title: '⚖️ Defensas', value: 'penal' },
          { title: '📄 Gestiones', value: 'gestiones' },
          { title: '⚖️ Exclusivos', value: 'global' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ubicacion',
      title: 'Estado / Ubicación de Ejercicio',
      type: 'string',
      description: 'VITAL PARA EL MATCH: Estado donde el abogado ejerce.',
      options: {
        list: [
          { title: 'Amazonas', value: 'Amazonas' }, 
          { title: 'Anzoátegui', value: 'Anzoátegui' },
          { title: 'Apure', value: 'Apure' }, 
          { title: 'Aragua', value: 'Aragua' },
          { title: 'Barinas', value: 'Barinas' }, 
          { title: 'Bolívar', value: 'Bolívar' },
          { title: 'Carabobo', value: 'Carabobo' }, 
          { title: 'Cojedes', value: 'Cojedes' },
          { title: 'Delta Amacuro', value: 'Delta Amacuro' }, 
          { title: 'Distrito Capital', value: 'Distrito Capital' },
          { title: 'Falcón', value: 'Falcón' }, 
          { title: 'Guárico', value: 'Guárico' },
          { title: 'Lara', value: 'Lara' }, 
          { title: 'Mérida', value: 'Mérida' },
          { title: 'Miranda', value: 'Miranda' }, 
          { title: 'Monagas', value: 'Monagas' },
          { title: 'Nueva Esparta', value: 'Nueva Esparta' }, 
          { title: 'Portuguesa', value: 'Portuguesa' },
          { title: 'Sucre', value: 'Sucre' }, 
          { title: 'Táchira', value: 'Táchira' },
          { title: 'Trujillo', value: 'Trujillo' }, 
          { title: 'Vargas', value: 'Vargas' },
          { title: 'Yaracuy', value: 'Yaracuy' }, 
          { title: 'Zulia', value: 'Zulia' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'foto',
      title: 'Foto de Perfil',
      type: 'image',
      options: { hotspot: true },
    }),
    // 🏦 NUEVA SECCIÓN: DATOS BANCARIOS
    defineField({
      name: 'datosBancarios',
      title: 'Información para Pagos',
      type: 'object',
      description: 'Datos donde la plataforma depositará los honorarios.',
      fields: [
        { name: 'banco', title: 'Banco', type: 'string' },
        { 
          name: 'tipoCuenta', 
          title: 'Tipo de Cuenta', 
          type: 'string',
          options: { list: ['Ahorros', 'Corriente'] }
        },
        { name: 'numeroCuenta', title: 'Número de Cuenta', type: 'string' },
        { name: 'titular', title: 'Nombre del Titular', type: 'string' },
        { name: 'identificacion', title: 'Cédula/RIF del Titular', type: 'string' },
      ]
    }),
    defineField({
      name: 'estatus',
      title: 'Estado del Registro',
      type: 'string',
      initialValue: 'pendiente',
      options: {
        list: [
          { title: '⏳ Pendiente', value: 'pendiente' },
          { title: '✅ Aprobado / Activo', value: 'aprobado' },
          { title: '❌ Rechazado', value: 'rechazado' },
        ],
      },
    }),
    defineField({
      name: 'verificado',
      title: '¿Verificado por TASF?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'password',
      title: 'Contraseña de Acceso (Temporal)',
      type: 'string',
      initialValue: () => `TASF-${Math.floor(1000 + Math.random() * 9000)}`,
      description: 'Esta clave se enviará automáticamente al aprobar al abogado.',
      readOnly: true,
      hidden: ({currentUser}) => !currentUser?.roles.find(role => role.name === 'administrator'),
    }),
    defineField({
      name: 'fechaRegistro',
      title: 'Fecha Interna del Sistema',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      hidden: true,
    }),
    defineField({
      name: 'fechaPostulacion',
      title: 'Fecha de Postulación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
})