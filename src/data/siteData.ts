import ajustesJson from '../content/ajustes/general.json';

export const siteConfig = {
  name: ajustesJson.nombreMarca || 'Casa Rojo del Tiétar',
  legalName: 'Casa Rural Rojo del Tiétar',
  tagline: ajustesJson.subtituloMarca || 'Casa Rural Boutique en el Valle del Tiétar',
  url: 'https://casaruralsierradeltietar.com',
  logo: '/uploads/logo.jpg',
  heroImage: '/uploads/Casa-roja-con-un-bonito-atardecer.png',
  phone1: ajustesJson.telefonoPrincipal || '605 935 487',
  phone1Raw: '+34605935487',
  phone2: ajustesJson.telefonoSecundario || '607 438 345',
  phone2Raw: '+34607438345',
  whatsapp: '34605935487',
  email: ajustesJson.email || 'casarural@casaruralsierradeltietar.com',
  address: {
    street: 'Paraje el Carrascal, s/n',
    locality: 'La Iglesuela del Tiétar',
    postalCode: '45633',
    region: 'Toledo',
    country: 'ES',
    full: ajustesJson.direccion || 'Paraje el Carrascal, s/n. 45633 La Iglesuela (Toledo)',
  },
  geo: {
    latitude: 40.2336,
    longitude: -4.7492,
  },
  social: {
    facebook: ajustesJson.facebookUrl || 'https://www.facebook.com/Rojodeltietar',
  },
  pricing: {
    weekdayNight: ajustesJson.precioDomingoJueves ?? 200,
    weekendNight: ajustesJson.precioViernesSabado ?? 375,
    extraBed: ajustesJson.precioCamaSupletoria ?? 10,
    weeklyPromo: ajustesJson.precioSemanaAniversario ?? 1400,
    minNights: ajustesJson.estanciaMinimaNoches ?? 2,
    depositPercent: ajustesJson.porcentajeSenal ?? 25,
    securityDeposit: ajustesJson.fianzaEuros ?? 100,
    checkIn: ajustesJson.horaCheckIn || '17:00h',
    checkOut: ajustesJson.horaCheckOut || '14:00h',
  },
  specs: {
    totalAreaM2: 240,
    floorAreaM2: 120,
    patioAreaM2: 90,
    salonAreaM2: '68,60',
    suitesCount: 5,
    bathroomsCount: 5,
    toiletsCount: 1,
    baseCapacity: 10,
    maxCapacity: 13,
    extraBedsCount: 3,
    distanceMadridKm: 115,
  },
};

export const fullGallery = [
  {
    src: '/uploads/Casa-roja-con-un-bonito-atardecer.png',
    alt: 'Fachada de Casa Rojo del Tiétar al atardecer en La Iglesuela',
    category: 'Exterior y Fachada',
    title: 'Atardecer en Casa Rojo del Tiétar',
  },
  {
    src: '/uploads/casa_ejido_rojodeltietar-min.jpg',
    alt: 'Arquitectura en piedra original rehabilitada de Casa Rojo del Tiétar',
    category: 'Exterior y Fachada',
    title: 'Antiguo pajar de piedra rehabilitado',
  },
  {
    src: '/uploads/salon4_rojodeltietar-570x320-1.jpg',
    alt: 'Gran salón de 68,60 m² con paredes de piedra y chimenea en Casa Rojo del Tiétar',
    category: 'Salón y Comedor',
    title: 'Gran Salón de 68,60 m² con Chimenea',
  },
  {
    src: '/uploads/salon3_rojodeltietar-1-570x320-1.jpg',
    alt: 'Zona de estar con tres amplios sofás junto a la chimenea de leña',
    category: 'Salón y Comedor',
    title: 'Zona de estar con 3 sofás para 10 plazas',
  },
  {
    src: '/uploads/comedor3_rojodeltietar-min-570x320-1.jpg',
    alt: 'Comedor con mesa de madera para 12 comensales en Casa Rojo del Tiétar',
    category: 'Salón y Comedor',
    title: 'Mesa de comedor para 12-13 comensales',
  },
  {
    src: '/uploads/salonycocina_rojodeltietar.jpg',
    alt: 'Vista panorámica del salón-comedor y cocina integrada en planta baja',
    category: 'Salón y Comedor',
    title: 'Planta baja diáfana con ventanales al patio',
  },
  {
    src: '/uploads/cocina_rojodeltietar-570x320-1.jpg',
    alt: 'Cocina abierta totalmente equipada con cafetera de grano recién molido',
    category: 'Cocina y Desayuno',
    title: 'Cocina abierta de alta gama',
  },
  {
    src: '/uploads/cocina2_rojodeltietar-570x320-1.jpg',
    alt: 'Detalle de equipamiento y electrodomésticos de cocina en Casa Rojo del Tiétar',
    category: 'Cocina y Desayuno',
    title: 'Inducción, horno, lavavajillas y menaje completo',
  },
  {
    src: '/uploads/desayuno_rojodeltietar-1200x500-1.jpg',
    alt: 'Desayuno mediterráneo casero incluido todos los días en Casa Rojo del Tiétar',
    category: 'Cocina y Desayuno',
    title: 'Desayuno suculento diario incluido',
  },
  {
    src: '/uploads/desayuno_juegos_rojodeltietar.jpg',
    alt: 'Detalle de desayuno casero y juegos de mesa familiares en Casa Rojo del Tiétar',
    category: 'Cocina y Desayuno',
    title: 'Bizcocho casero, café en grano y juegos en familia',
  },
  {
    src: '/uploads/hab_ejido_cama_rojodeltietar-570x320-1.jpg',
    alt: 'Habitación Suite Ejido con cama de 150 cm y bañera exenta en la habitación',
    category: 'Suites con Baño',
    title: 'Suite Ejido — Con bañera exenta integrada',
  },
  {
    src: '/uploads/montaje_bano_ejido.jpg',
    alt: 'Bañera exenta y cuarto de baño privado de la Suite Ejido',
    category: 'Suites con Baño',
    title: 'Bañera exenta y baño de 3,50 m² en Suite Ejido',
  },
  {
    src: '/uploads/hab_gredos_cama_rojodeltietar-1-570x320-1.jpg',
    alt: 'Habitación Suite Gredos con cama de matrimonio y bañera exenta',
    category: 'Suites con Baño',
    title: 'Suite Gredos — Con bañera exenta en dormitorio',
  },
  {
    src: '/uploads/montaje_bano_gredos.jpg',
    alt: 'Cuarto de baño privado y bañera exenta de la Suite Gredos',
    category: 'Suites con Baño',
    title: 'Baño privado y bañera en Suite Gredos',
  },
  {
    src: '/uploads/hab_torinas_cama_rojodeltietar-563x320-1.jpg',
    alt: 'Habitación Suite Torinas de 20 m² con cama de 160 cm y balcón privado',
    category: 'Suites con Baño',
    title: 'Suite Torinas — 20 m², cama 160 cm y balcón',
  },
  {
    src: '/uploads/montaje_bano_torinas.jpg',
    alt: 'Baño completo independiente de la Suite Torinas con plato de ducha',
    category: 'Suites con Baño',
    title: 'Baño completo en Suite Torinas (3,30 m²)',
  },
  {
    src: '/uploads/hab_pielago_cama_rojodeltietar-570x320-1.jpg',
    alt: 'Habitación Suite Piélago de 20 m² con cama de 160 cm y balcón al patio',
    category: 'Suites con Baño',
    title: 'Suite Piélago — 20 m², cama 160 cm y balcón',
  },
  {
    src: '/uploads/montaje_bano_pielago.jpg',
    alt: 'Baño privado completo de la Suite Piélago en Casa Rojo del Tiétar',
    category: 'Suites con Baño',
    title: 'Baño completo en Suite Piélago (3,30 m²)',
  },
  {
    src: '/uploads/montaje_varios_plantabaja.jpg',
    alt: 'Habitación Suite Pajar en planta baja adaptada a movilidad reducida',
    category: 'Suites con Baño',
    title: 'Suite Pajar (Planta Baja — Adaptada PMR)',
  },
  {
    src: '/uploads/pergola_rojodeltietar-570x320-1.jpg',
    alt: 'Pérgola cubierta en el patio exterior de Casa Rojo del Tiétar con mesa para 12',
    category: 'Patio y Barbacoa',
    title: 'Pérgola exterior para comidas al aire libre',
  },
  {
    src: '/uploads/patio_exterior_rojodeltietar-min-570x320-1.jpg',
    alt: 'Patio exterior privado amurallado en piedra de Casa Rojo del Tiétar',
    category: 'Patio y Barbacoa',
    title: 'Patio privado conectado al salón',
  },
  {
    src: '/uploads/barbacoa_completa_rojodeltietar-570x320-1.jpg',
    alt: 'Barbacoa exterior equipada con leña gratuita en Casa Rojo del Tiétar',
    category: 'Patio y Barbacoa',
    title: 'Barbacoa con leña de encina gratuita',
  },
  {
    src: '/uploads/montaje_ducha_flores_rojodeltietar.jpg',
    alt: 'Ducha exterior con agua caliente y fría en el patio de Casa Rojo del Tiétar',
    category: 'Patio y Barbacoa',
    title: 'Ducha exterior con agua caliente y fría',
  },
  {
    src: '/uploads/Puente_romano_de_La_Iglesuela_001.jpg',
    alt: 'Puente romano sobre el río Tiétar en La Iglesuela (Toledo)',
    category: 'Entorno y La Iglesuela',
    title: 'Puente Romano sobre el Río Tiétar',
  },
  {
    src: '/uploads/PANORAMICA.-LA-IGLESUELA-DEL-TIETAR.jpg',
    alt: 'Vista panorámica de La Iglesuela del Tiétar y la Sierra de Gredos',
    category: 'Entorno y La Iglesuela',
    title: 'Panorámica de La Iglesuela y Sierra de Gredos',
  },
  {
    src: '/uploads/pueblo_vista_rojodeltietar.jpg',
    alt: 'Entorno rural y dehesas de La Iglesuela en el Valle del Tiétar',
    category: 'Entorno y La Iglesuela',
    title: 'Dehesas y miradores del Valle del Tiétar',
  },
];

export const distancesList = [
  { place: 'Casavieja (Ávila)', distance: '7 km', time: '8 min' },
  { place: 'Sartajada (Toledo)', distance: '9 km', time: '10 min' },
  { place: 'Almendral de la Cañada', distance: '9 km', time: '10 min' },
  { place: 'Piedralaves', distance: '12 km', time: '14 min' },
  { place: 'La Adrada (Castillo)', distance: '13 km', time: '15 min' },
  { place: 'Sotillo de la Adrada', distance: '18 km', time: '20 min' },
  { place: 'Talavera de la Reina', distance: '36 km', time: '35 min' },
  { place: 'Ávila Capital', distance: '85 km', time: '1h 10m' },
  { place: 'Toledo Capital', distance: '113 km', time: '1h 15m' },
  { place: 'Madrid Centro (A-5)', distance: '115 km', time: '1h 15m' },
  { place: 'Béjar / Covatilla', distance: '143 km', time: '1h 45m' },
  { place: 'Plasencia / Valle del Jerte', distance: '159 km', time: '1h 50m' },
];

export const faqsHome = [
  {
    question: '¿Qué incluye exactamente el precio del alquiler íntegro de Casa Rojo del Tiétar?',
    answer:
      'El alquiler íntegro de la casa (240 m² + patio privado) incluye un suculento desayuno mediterráneo cada día para todos los huéspedes (café en grano recién molido, leche, Cola Cao, huevos, panes, bizcocho casero, mantequilla, mermelada y frutas variadas), leña gratuita tanto para la chimenea del salón como para la barbacoa exterior, Wi-Fi de alta velocidad, ropa de cama 100% algodón, toallas, gel, champú y crema hidratante en los 5 baños, climatización por suelo radiante frío-calor y acceso gratuito a la piscina municipal situada a 200 metros.',
  },
  {
    question: '¿Cuál es la capacidad de la casa y cómo se distribuyen las 5 habitaciones?',
    answer:
      'La casa tiene capacidad para 10 a 13 personas (+ 1 cuna de viaje). Todos los dormitorios (5 en total) son tipo suite con su propio baño completo privado: en la planta superior están la Suite Ejido y la Suite Gredos (cama de 150 cm y bañera exenta dentro de la habitación) y la Suite Torinas y la Suite Piélago (20 m², cama de 160 cm y pequeño balcón al patio). En la planta baja se ubica la Suite Pajar (2 camas de 90 cm, baño de 4,75 m² y salida directa al patio), totalmente adaptada a personas con movilidad reducida. Además, disponemos de 3 camas supletorias de 90 cm (10 €/cama con toallas incluidas) y 1 aseo adicional en planta baja.',
  },
  {
    question: '¿Se admiten mascotas en Casa Rojo del Tiétar?',
    answer:
      'Sí, Casa Rojo del Tiétar es un alojamiento 100% Pet-Friendly. Tu mascota es bienvenida para disfrutar tanto del patio amurallado privado como de la gran pradera pública sin tráfico situada justo al lado de la casa.',
  },
  {
    question: '¿Cuáles son las tarifas por noche y las condiciones de reserva y cancelación?',
    answer:
      'La tarifa de alquiler íntegro es de 200 € / noche de domingo a jueves y de 375 € / noche los viernes, sábados y en temporada de verano (31 de julio al 31 de agosto), con estancia mínima de 2 noches. Contamos con una promoción especial de semana completa por 1.400 €. Para confirmar la reserva se abona el 25% en concepto de señal (100% reembolsable si se cancela hasta 7 días antes de la llegada) y una fianza reembolsable de 100 € a la entrada.',
  },
  {
    question: '¿Cuál es el horario de entrada (check-in) y de salida (check-out)?',
    answer:
      'La hora de entrada (check-in) es a partir de las 17:00h y la hora de salida (check-out) es hasta las 14:00h. Si tu grupo desea ampliar la hora de salida, consúltanos sin compromiso y os daremos todas las facilidades posibles.',
  },
];

export const siteBrand = {
  name: siteConfig.name,
  officialName: siteConfig.legalName,
  phones: [siteConfig.phone1, siteConfig.phone2],
  email: siteConfig.email,
  address: siteConfig.address,
};

export const faqs = faqsHome;
export const distancesTable = distancesList;

export const servicesCategories = [
  {
    title: 'Desayuno Mediterráneo Incluido',
    description:
      'Incluido todos los días sin coste adicional para todos los huéspedes alojados en la casa.',
    items: [
      'Café en grano recién molido en cafetera automática, leche y Cola Cao',
      'Huevos, panes variados, bizcocho casero, mantequilla y mermelada',
      'Frutas variadas de temporada, aceite de oliva virgen extra y tomate',
      'Infusiones, cereales, galletas, azúcar y edulcorante',
    ],
  },
  {
    title: 'Gran Salón-Comedor con Chimenea (68,60 m²)',
    description:
      'Espacio diáfano con paredes de piedra original, grandes ventanales al patio y ambiente cálido.',
    items: [
      'Chimenea de leña con suministro de leña de encina 100% gratuito',
      'Tres amplios sofás con capacidad cómoda para 10-13 personas',
      'Mesa de comedor de madera maciza para 12-13 comensales',
      'Smart TV de 50 pulgadas, libros y juegos de mesa (ajedrez, cartas, juegos infantiles)',
    ],
  },
  {
    title: 'Cocina Abierta de Alta Gama',
    description:
      'Integrada junto al salón y equipada con todo el menaje necesario para grandes grupos.',
    items: [
      'Placa de inducción, horno, microondas y frigorífico combi de gran capacidad',
      'Lavavajillas, lavadora, plancha y tabla de planchar',
      'Cafetera de grano recién molido, tostador, exprimidor y batidora',
      'Vajilla, cristalería, cubertería y baterías de cocina para 13 personas',
    ],
  },
  {
    title: '5 Dormitorios Tipo Suite con Baño Privado',
    description:
      'Intimidad total para cada pareja o familia: todas las habitaciones cuentan con cuarto de baño propio.',
    items: [
      '2 Suites (Ejido y Gredos) con cama de 150 cm y bañera exenta en el dormitorio',
      '2 Suites (Torinas y Piélago) de 20 m² con cama de 160 cm y balcón privado al patio',
      '1 Suite en Planta Baja (Pajar) adaptada a personas con movilidad reducida (PMR)',
      'Televisión en todas las habitaciones, sábanas 100% algodón, toallas, secador, gel, champú y crema hidratante',
    ],
  },
  {
    title: 'Patio Amurallado (90 m²), Pérgola y Barbacoa',
    description:
      'Jardín privado revestido en piedra natural conectado directamente con el salón y la cocina.',
    items: [
      'Barbacoa exterior equipada con leña de encina gratuita incluida',
      'Pérgola cubierta con iluminación nocturna y gran mesa exterior para 12 personas',
      'Ducha exterior con agua caliente y fría entre plantas y flores',
      'Trato 100% Pet-Friendly y gran pradera pública sin tráfico junto a la puerta',
    ],
  },
  {
    title: 'Climatización, Piscina a 200 m y Catering',
    description:
      'Confort térmico en cualquier estación del año y servicios exclusivos en La Iglesuela del Tiétar.',
    items: [
      'Suelo radiante frío/calor de alta eficiencia en toda la vivienda',
      'Conexión Wi-Fi gratuita de alta velocidad en todas las estancias',
      'Acceso gratuito en verano a la Piscina Municipal situada a solo 200 metros',
      'Servicio opcional de catering casero tradicional a precios económicos',
    ],
  },
];

export const ratesData = {
  conditions: [
    {
      title: 'Estancia Mínima y Alquiler Íntegro',
      detail:
        'El alquiler de Casa Rojo del Tiétar es siempre íntegro (vivienda completa de 240 m² y patio de 90 m² en exclusividad para tu grupo). La estancia mínima es de 2 noches.',
    },
    {
      title: 'Reserva y Señal (25%) con Cancelación Flexible',
      detail:
        'Para formalizar la reserva se abona el 25% del importe total en concepto de señal. Si cancelas hasta 7 días antes de la fecha de entrada, se devuelve el 100% de la señal.',
    },
    {
      title: 'Fianza de Garantía (100 €)',
      detail:
        'A la entrega de llaves se deposita una fianza de 100 € que se reintegra íntegramente en un plazo máximo de 7 días tras la salida y revisión del inmueble.',
    },
    {
      title: 'Horarios de Entrada (17:00h) y Salida (14:00h)',
      detail:
        'Check-in a partir de las 17:00h y Check-out hasta las 14:00h. Si vuestro grupo necesita flexibilidad en la hora de salida, consultadnos sin compromiso.',
    },
    {
      title: 'Camas Supletorias y Cuna de Viaje',
      detail:
        'La capacidad base es de 10 plazas en 5 suites dobles, ampliable hasta 13 personas mediante 3 camas supletorias de 90 cm por solo 10 €/cama (incluye juego completo de toallas). Cuna de viaje disponible gratis.',
    },
    {
      title: 'Desayuno, Leña y Mascotas Incluidos',
      detail:
        'Todas las tarifas incluyen el desayuno mediterráneo diario para todo el grupo, la leña para la chimenea y la barbacoa, y la admisión de mascotas bajo consulta previa.',
    },
  ],
};

export const entornoSections = [
  {
    id: 'rio-tietar-torinas',
    subtitle: 'Agua cristalina y pozas naturales',
    title: 'El Río Tiétar y la Garganta de Torinas',
    content:
      'La Iglesuela del Tiétar está bañada por las aguas del río Tiétar y atravesada por la Garganta de Torinas, que nace en la Sierra de San Vicente. Sus aguas cristalinas forman charcas naturales, cascadas y remansos rodeados de alisos, fresnos y encinas centenarias, creando un microclima suave y refrescante ideal para el baño y el paseo.',
    image: '/uploads/Puente_romano_de_La_Iglesuela_001.jpg',
  },
  {
    id: 'geografia-valle',
    subtitle: 'Frontera natural de tres provincias',
    title: 'Geografía Privilegiada a 521 metros de altitud',
    content:
      'Enclavada a 521 metros sobre el nivel del mar, entre la Sierra de San Vicente al sur y la majestuosa Sierra de Gredos al norte, La Iglesuela marca el punto de encuentro entre Toledo, Ávila y Madrid. Su relieve de dehesas graníticas y bosques mediterráneos ofrece vistas panorámicas inigualables.',
    image: '/uploads/PANORAMICA.-LA-IGLESUELA-DEL-TIETAR.jpg',
  },
  {
    id: 'senda-viriato',
    subtitle: 'Senderismo de Gran Recorrido GR-63',
    title: 'La Senda de Viriato (GR-63): Etapas 16 y 17',
    content:
      'Por la misma puerta de Casa Rojo del Tiétar discurre la célebre Senda de Viriato (GR-63), un itinerario de 140 km que recorre la comarca de la Sierra de San Vicente siguiendo los pasos del legendario caudillo lusitano. Desde la casa puedes realizar a pie o en BTT las etapas 16 y 17 entre caminos históricos, puentes antiguos y encinares.',
    image: '/uploads/pueblo_vista_rojodeltietar.jpg',
  },
  {
    id: 'patrimonio-monumental',
    subtitle: 'Arquitectura histórica del siglo XVI al XVIII',
    title: 'Iglesia de Santa María de la Oliva, Ermita de la Fuensanta y Ayuntamiento de 1791',
    content:
      'El casco urbano conserva joyas como la Iglesia Parroquial de Santa María de la Oliva (siglo XVI, estilo gótico tardío y renacentista con torre de sillería), la devota Ermita de Nuestra Señora de la Fuensanta, el edificio histórico del Ayuntamiento fechado en 1791 y la tradicional Fuente del Ejido.',
    image: '/uploads/30132108.700x525.jpg',
  },
  {
    id: 'puentes-pozos',
    subtitle: 'Ingeniería tradicional en piedra granítica',
    title: 'Puentes Romanos, Pasaderas Vettonas y Pozos Centenarios',
    content:
      'Sobre el río Tiétar y la Garganta de Torinas se alzan antiguos puentes de origen romano y medieval de un solo arco de medio punto en sillería de granito, además de lanchas y pasaderas tradicionales y los famosos pozos abovedados repartidos por el casco urbano y el paraje de El Ejido.',
    image: '/uploads/5-Pozos-Casco-Urbano-Iglesuela.jpg',
  },
  {
    id: 'encina-el-gacho-natura',
    subtitle: 'Red Natura 2000 · ZEPA · Récord Guinness',
    title: 'La Encina Centenaria «El Gacho» y la Reserva de Aves Rapaces',
    content:
      'El término municipal forma parte de la Red Natura 2000 (LIC y ZEPA Sierra de San Vicente y Valle del Tiétar), santuario del águila imperial ibérica, la cigüeña negra y el buitre negro. Aquí se alzaba la mítica encina «El Gacho», de más de 600 años de antigüedad, incluida en el Libro Guinness de los Récords por la extraordinaria envergadura de su copa.',
    image: '/uploads/6F277BD0-C8C2-E22F-CA2F536CFE2235C3.jpg',
  },
  {
    id: 'vuelo-sin-motor-turismo',
    subtitle: 'Aventura, aeródromo y cultura viva',
    title: 'Aeródromo de Vuelo sin Motor, Fiestas Patronales e IglesuelaRock',
    content:
      'A las afueras de La Iglesuela se ubica su reconocido Aeródromo de Vuelo a Vela (vuelo sin motor), referente nacional gracias a las corrientes térmicas de Gredos. Además, el municipio vibra con las fiestas de la Virgen de la Fuensanta (septiembre), la Romería de mayo y citas culturales como el festival IglesuelaRock.',
    image: '/uploads/2022-05-03.jpg',
  },
];
