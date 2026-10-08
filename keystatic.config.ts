import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: {
      name: 'Casa Rojo del Tiétar — CMS',
    },
  },
  singletons: {
    ajustes: singleton({
      label: 'Configuración General y Tarifas',
      path: 'src/content/ajustes/general',
      format: { data: 'json' },
      schema: {
        nombreMarca: fields.text({
          label: 'Nombre Oficial de la Casa',
          defaultValue: 'Casa Rojo del Tiétar',
        }),
        subtituloMarca: fields.text({
          label: 'Subtítulo Editorial',
          defaultValue: 'Casa Rural Boutique en el Valle del Tiétar',
        }),
        telefonoPrincipal: fields.text({
          label: 'Teléfono Principal',
          defaultValue: '605 935 487',
        }),
        telefonoSecundario: fields.text({
          label: 'Teléfono Secundario',
          defaultValue: '607 438 345',
        }),
        email: fields.text({
          label: 'Correo Electrónico de Reservas',
          defaultValue: 'casarural@casaruralsierradeltietar.com',
        }),
        direccion: fields.text({
          label: 'Dirección Física',
          defaultValue: 'Paraje el Carrascal, s/n. 45633 La Iglesuela (Toledo)',
        }),
        facebookUrl: fields.url({
          label: 'URL de Facebook',
          defaultValue: 'https://www.facebook.com/Rojodeltietar',
        }),
        precioDomingoJueves: fields.integer({
          label: 'Tarifa Domingo a Jueves (€ / noche casa íntegra)',
          defaultValue: 200,
        }),
        precioViernesSabado: fields.integer({
          label: 'Tarifa Viernes y Sábado / Verano (€ / noche casa íntegra)',
          defaultValue: 375,
        }),
        precioCamaSupletoria: fields.integer({
          label: 'Cama Supletoria (€ / noche con toallas incluidas)',
          defaultValue: 10,
        }),
        precioSemanaAniversario: fields.integer({
          label: 'Promoción Especial Semana Completa (€)',
          defaultValue: 1400,
        }),
        estanciaMinimaNoches: fields.integer({
          label: 'Estancia Mínima (noches)',
          defaultValue: 2,
        }),
        fianzaEuros: fields.integer({
          label: 'Fianza Reembolsable (€)',
          defaultValue: 100,
        }),
        porcentajeSenal: fields.integer({
          label: 'Señal de Reserva (%)',
          defaultValue: 25,
        }),
        horaCheckIn: fields.text({
          label: 'Hora de Entrada (Check-in)',
          defaultValue: '17:00h',
        }),
        horaCheckOut: fields.text({
          label: 'Hora de Salida (Check-out)',
          defaultValue: '14:00h',
        }),
      },
    }),
  },
  collections: {
    estancias: collection({
      label: 'Estancias y Suites',
      slugField: 'title',
      path: 'src/content/estancias/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Nombre de la Estancia / Suite' } }),
        tipo: fields.select({
          label: 'Tipo de Espacio',
          options: [
            { label: 'Suite Planta Superior', value: 'suite-superior' },
            { label: 'Suite Planta Baja (Adaptada)', value: 'suite-baja' },
            { label: 'Zona Común Interior', value: 'zona-comun' },
            { label: 'Zona Exterior / Patio', value: 'exterior' },
          ],
          defaultValue: 'suite-superior',
        }),
        superficie: fields.text({ label: 'Superficie (ej. 16 m² + 3,50 m² baño)' }),
        capacidad: fields.text({ label: 'Capacidad (ej. 2 - 3 personas)' }),
        camas: fields.text({ label: 'Configuración de Camas / Mobiliario' }),
        planta: fields.text({ label: 'Ubicación / Planta', defaultValue: 'Planta Superior' }),
        destacado: fields.text({ label: 'Rasgo Singular (ej. Bañera exenta en la habitación)' }),
        orden: fields.integer({ label: 'Orden de visualización', defaultValue: 1 }),
        imagenPrincipal: fields.text({
          label: 'Imagen Principal (/uploads/...)',
          defaultValue: '/uploads/hab_ejido_cama_rojodeltietar-570x320-1.jpg',
        }),
        galeria: fields.array(fields.text({ label: 'URL de Imagen (/uploads/...)' }), {
          label: 'Galería de Fotos de la Estancia',
          itemLabel: (props) => props.value || 'Imagen',
        }),
        equipamiento: fields.array(fields.text({ label: 'Elemento de equipamiento' }), {
          label: 'Calidades y Equipamiento Incluido',
          itemLabel: (props) => props.value || 'Equipamiento',
        }),
        description: fields.text({ label: 'Descripción Corta / Resumen SEO', multiline: true }),
        content: fields.document({
          label: 'Descripción Detallada de la Estancia',
          formatting: true,
          dividers: true,
          links: true,
        }),
      },
    }),
    blog: collection({
      label: 'Guía Rural y Blog',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Título del Artículo' } }),
        description: fields.text({ label: 'Meta Descripción SEO / Extracto', multiline: true }),
        pubDate: fields.date({ label: 'Fecha de Publicación', defaultValue: { kind: 'today' } }),
        author: fields.text({ label: 'Autor', defaultValue: 'Casa Rojo del Tiétar' }),
        category: fields.select({
          label: 'Categoría',
          options: [
            { label: 'Rutas y Naturaleza', value: 'rutas-y-naturaleza' },
            { label: 'Gastronomía del Tiétar', value: 'gastronomia' },
            { label: 'Patrimonio y Pueblos', value: 'patrimonio' },
            { label: 'Planes en Grupo y Familia', value: 'planes-grupo' },
            { label: 'La Casa y Experiencias', value: 'experiencia-casa' },
          ],
          defaultValue: 'rutas-y-naturaleza',
        }),
        readingTime: fields.text({ label: 'Tiempo de lectura', defaultValue: '5 min lectura' }),
        image: fields.text({
          label: 'Imagen Destacada (/uploads/...)',
          defaultValue: '/uploads/PANORAMICA.-LA-IGLESUELA-DEL-TIETAR.jpg',
        }),
        imageAlt: fields.text({
          label: 'Texto Alternativo (SEO Alt)',
          defaultValue: 'Vista panorámica de La Iglesuela del Tiétar y la Sierra de Gredos',
        }),
        content: fields.document({
          label: 'Contenido del Artículo',
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
      },
    }),
  },
});
