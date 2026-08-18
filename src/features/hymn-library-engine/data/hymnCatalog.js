/**
 * Cántico de Fe Music
 * V13.4.20 — Assign First R2 Hymn Cover
 *
 * Catálogo base de himnos.
 * - Mantiene audio y src existentes
 * - Relaciona audio R2 mediante r2Key
 * - Relaciona portadas R2 mediante coverKey
 */

export const hymnCatalog = [
  {
    id: 'fe-que-mueve-montanas',
    title: 'Fe que Mueve Montañas',
    subtitle: 'Himno cristiano de fe y confianza',

    category: 'Fe',
    theme: 'Confianza en Dios',

    scriptures: [
      'Mateo 17:20',
      'Hebreos 11:1'
    ],

    artist: 'Cántico de Fe Music',

    r2Key:
      'uploads/2026-08-10/bf48f5d5-8d12-45da-baa9-3aa3d454287f-fe-que-mueve-montan-as.mp3',

    coverKey:
      'uploads/2026-08-18/22955efa-6c98-4b64-a55b-65c1eea263dd-chatgpt-image-jun-16-2026-09_02_26-pm.png',
    
    audio: '/assets/audio/himnos/fe-que-mueve-montanas.mp3',
    src: '/assets/audio/himnos/fe-que-mueve-montanas.mp3',
    cover: '',
    duration: '',

    description:
      'Himno cristiano sobre la fe que confía en Dios aun cuando la prueba parece grande.',

    lyrics: [
      'Fe, la llama que Dios encendió,',
      'La promesa que nunca murió,',
      'Es la fuerza que impulsa al creyente,',
      'A seguir caminando valientemente.',
      '',
      'Aunque el viento me quiera derribar,',
      'Y la prueba me haga temblar,',
      'Yo confío en la voz de mi Señor,',
      'Porque su palabra nunca falló.'
    ],

    tags: [
      'fe',
      'confianza',
      'montañas',
      'adoración'
    ],

    copyright: {
      holder: 'Cántico de Fe Music',
      license: 'Todos los derechos reservados'
    }
  },

  {
    id: 'quince-anos-mas',
    title: 'Quince Años Más',
    subtitle: 'Himno basado en 2 Reyes 20 e Isaías 38',

    category: 'Testimonio',
    theme: 'Oración y misericordia de Dios',

    scriptures: [
      '2 Reyes 20',
      'Isaías 38'
    ],

    artist: 'Cántico de Fe Music',

    r2Key: 'quince-anos-mas.m4a',

    coverKey:
      'uploads/2026-08-10/f90a614f-e273-4c5d-908c-7fa280fae54d-default-social-cover.png',

    audio: '/assets/audio/himnos/quince-anos-mas.m4a',
    src: '/assets/audio/himnos/quince-anos-mas.m4a',
    cover: '',
    duration: '',

    description:
      'Himno basado en la misericordia de Dios al escuchar el clamor de Ezequías.',

    lyrics: [
      'En días de angustia y dolor sin igual,',
      'cuando la vida parecía terminar,',
      'vino palabra del cielo a anunciar:',
      'Ordena tu casa, no vivirás.',
      '',
      'Mas vuelto el rostro hacia la pared,',
      'clamó con llanto en profunda fe:',
      'Señor, recuerda mi caminar,',
      'con limpio corazón te quise agradar.'
    ],

    tags: [
      'oración',
      'milagro',
      'sanidad',
      'ezequías'
    ],

    copyright: {
      holder: 'Cántico de Fe Music',
      license: 'Todos los derechos reservados'
    }
  }
];
