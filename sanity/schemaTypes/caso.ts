import { defineField, defineType } from 'sanity'

export const caso = defineType({
  name: 'caso',
  title: 'Casos Legales',
  type: 'document',
  fields: [
    // === IDENTIFICACIÓN ===
    defineField({
      name: 'codigoExpediente',
      title: 'Código de Expediente',
      type: 'string',
      description: 'Código Premium visible por cliente (Formato ASF-AAAA-#####)',
      readOnly: true,
    }),

    defineField({
      name: 'secuenciaExpediente',
      title: 'Secuencia Interna',
      type: 'number',
      hidden: true,
      description: 'Control secuencial del expediente para generación del código premium.',
    }),

    defineField({
      name: 'titulo',
      title: 'Título del Caso',
      type: 'string',
      description: 'Autogenerado: Categoría + Ubicación',
      validation: (Rule) => Rule.required(),
    }),

    // === CONTROL DE NOTIFICACIONES (VITAL PARA LA CAMPANITA) ===
    defineField({
      name: 'notificacionPendiente',
      title: '¿Tiene notificación pendiente?',
      type: 'boolean',
      initialValue: false,
      description: 'Activa el parpadeo de la campana dorada en la bóveda del cliente cuando el abogado actualiza.',
    }),

    // === MATCHMAKER ===
    defineField({
      name: 'categoria',
      title: '¿Qué tipo de problema es? (RAMA)',
      description: 'VITAL PARA EL MATCHMAKER: Define qué abogados pueden ver este caso.',
      type: 'string',
      options: {
        list: [
          { title: '🏡 Propiedades', value: 'propiedades' },
          { title: '👨‍👩‍👧‍👦 Familias', value: 'familias' },
          { title: '💼 Negocios', value: 'negocios' },
          { title: '⚖️ Penal', value: 'penal' },
          { title: '📄 Gestiones', value: 'gestiones' },
          { title: '⚖️ Global', value: 'global' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'ubicacion',
      title: '¿Dónde está el caso? (Estado)',
      type: 'string',
      options: {
        list: [
          { title: 'Amazonas', value: 'Amazonas' }, { title: 'Anzoátegui', value: 'Anzoátegui' },
          { title: 'Apure', value: 'Apure' }, { title: 'Aragua', value: 'Aragua' },
          { title: 'Barinas', value: 'Barinas' }, { title: 'Bolívar', value: 'Bolívar' },
          { title: 'Carabobo', value: 'Carabobo' }, { title: 'Cojedes', value: 'Cojedes' },
          { title: 'Delta Amacuro', value: 'Delta Amacuro' }, { title: 'Distrito Capital', value: 'Distrito Capital' },
          { title: 'Falcón', value: 'Falcón' }, { title: 'Guárico', value: 'Guárico' },
          { title: 'Lara', value: 'Lara' }, { title: 'Mérida', value: 'Mérida' },
          { title: 'Miranda', value: 'Miranda' }, { title: 'Monagas', value: 'Monagas' },
          { title: 'Nueva Esparta', value: 'Nueva Esparta' }, { title: 'Portuguesa', value: 'Portuguesa' },
          { title: 'Sucre', value: 'Sucre' }, { title: 'Táchira', value: 'Táchira' },
          { title: 'Trujillo', value: 'Trujillo' }, { title: 'Vargas', value: 'Vargas' },
          { title: 'Yaracuy', value: 'Yaracuy' }, { title: 'Zulia', value: 'Zulia' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'descripcion',
      title: 'Historia del Cliente',
      type: 'text',
      rows: 4,
    }),

    defineField({
      name: 'audioUrl',
      title: 'Audio del Relato',
      type: 'url',
    }),

    defineField({
      name: 'tieneDocumentos',
      title: '¿El cliente posee documentos?',
      type: 'boolean',
      initialValue: false,
    }),

    // === RELACIONES ===
    defineField({
      name: 'cliente',
      title: 'Datos del Cliente',
      type: 'reference',
      to: [{ type: 'cliente' }],
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'abogadoAsignado',
      title: 'Abogado que lleva el caso',
      type: 'reference',
      to: [{ type: 'abogado' }],
    }),

    // === SECCIÓN DE RESPUESTA Y HONORARIOS ===
    defineField({
      name: 'respuestaAbogado',
      title: 'Asesoría Gratuita (Respuesta rápida)',
      description: 'Este texto se muestra como la última actualización directa.',
      type: 'text',
    }),

    defineField({
      name: 'presupuestoEstimado',
      title: 'Honorarios Iniciales ($)',
      description: 'Monto indicado para iniciar el trámite oficial.',
      type: 'string',
    }),

    defineField({
      name: 'estado',
      title: 'Estado del Proceso',
      type: 'string',
      options: {
        list: [
          { title: '🟡 En Análisis (Esperando Abogado)', value: 'analisis' },
          { title: '🟠 Respondido (Esperando Cliente)', value: 'respondido' },
          { title: '🔵 En Gestión (Abogado Trabajando)', value: 'gestion' },
          { title: '🟢 Concluido', value: 'concluido' },
        ],
      },
      initialValue: 'analisis',
    }),

    defineField({
      name: 'fechaCreacion',
      title: 'Fecha de Creación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),

    // === SECCIÓN DE PAGO (ADMINISTRACIÓN) ===
    defineField({
      name: 'comprobantePago',
      title: 'Comprobante de Pago',
      type: 'image',
    }),

    defineField({
      name: 'pagoValidado',
      title: '¿Pago verificado?',
      type: 'boolean',
      initialValue: false,
    }),

    // === BÓVEDA Y ARCHIVOS (AJUSTE TÉCNICO) ===
    defineField({
      name: 'actualizacion',
      title: 'Bitácora Oficial (Bóveda)',
      type: 'text',
      initialValue: 'Hemos recibido su expediente con éxito. Un abogado especialista está revisando los detalles.',
    }),

    defineField({
      name: 'documentosBoveda',
      title: 'Archivos para el Cliente (REPOSITORIO)',
      type: 'array',
      of: [
        { 
          type: 'file',
          fields: [
            { name: 'nombreOriginal', type: 'string', title: 'Nombre del Archivo' },
            { name: 'fechaCarga', type: 'datetime', title: 'Fecha de Carga' }
          ]
        }
      ],
    }),

    defineField({
      name: 'documentosPrueba',
      title: 'Pruebas del Cliente (HISTORIAL)',
      type: 'array',
      of: [
        { 
          type: 'file',
          fields: [
            { name: 'nombreOriginal', type: 'string', title: 'Nombre del Archivo' },
            { name: 'fechaCarga', type: 'datetime', title: 'Fecha de Carga' }
          ]
        }
      ],
    }),

    defineField({
      name: 'muroGestion',
      title: 'Historial de Mensajes Blindados',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'mensajeItem',
          title: 'Mensaje Item',
          fields: [
            { name: 'mensaje', type: 'text', title: 'Mensaje Legal' },
            { 
              name: 'fecha', 
              type: 'datetime', 
              title: 'Fecha',
              initialValue: () => new Date().toISOString()
            },
            { 
              name: 'emisor', 
              type: 'string', 
              title: 'Emisor',
              options: { list: ['Abogado', 'Plataforma', 'Abogados Sin Fronteras'] },
              initialValue: 'Plataforma'
            }
          ]
        }
      ]
    }),
  ],

  preview: {
    select: {
      title: 'titulo',
      subtitle: 'codigoExpediente',
      estado: 'estado'
    },
    prepare({ title, subtitle, estado }) {
      const Emojis: any = { analisis: '🟡', respondido: '🟠', gestion: '🔵', concluido: '🟢' };
      return {
        title: `${Emojis[estado] || '⚪'} ${title || 'Nuevo Caso'}`,
        subtitle: `Expediente: ${subtitle || 'Sin asignar'}`
      }
    }
  }
})