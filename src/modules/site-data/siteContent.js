export const siteContent = {
  brand: {
    name: 'Cántico de Fe Music',
    description: 'Himnos, alabanzas y música cristiana original para edificar la fe.',
    url: 'https://canticodefemusic.com'
  },

  pages: [
    { id: 'home', title: 'Inicio', path: '/' },
    { id: 'himnos', title: 'Himnos', path: '/?page=himnos' },
    { id: 'videos', title: 'Videos', path: '/?page=videos' },
    { id: 'albumes', title: 'Álbumes', path: '/?page=albumes' },
    { id: 'playlists', title: 'Playlists', path: '/?page=playlists' },
    { id: 'devocionales', title: 'Devocionales', path: '/?page=devocionales' },
    { id: 'contacto', title: 'Contacto', path: '/?page=contacto' }
  ],

  hymns: [
    {
      id: 'fe-que-mueve-montanas',
      title: 'Fe que mueve montañas',
      scripture: 'Mateo 17:20',
      description: 'Himno cristiano sobre la fe que confía en Dios aun en medio de la prueba.',
      audio: '',
      video: ''
    },
    {
      id: 'quince-anos-mas',
      title: 'Quince Años Más',
      scripture: '2 Reyes 20; Isaías 38',
      description: 'Himno basado en la misericordia de Dios al escuchar el clamor de Ezequías.',
      audio: '',
      video: ''
    }
  ],

  devotionals: [
    {
      id: 'fe-en-la-prueba',
      title: 'Fe en la prueba',
      scripture: 'Hebreos 11:1',
      content: 'La fe sostiene el corazón cuando la respuesta todavía no se ve.'
    }
  ]
};
