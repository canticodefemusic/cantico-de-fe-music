export const uploadConfig = {
  maxFileSize:
    1024 * 1024 * 500,

  maxFiles:
    100,

  allowedImageTypes: [
    'image/png',
    'image/jpeg',
    'image/webp'
  ],

  allowedAudioTypes: [
    'audio/mpeg',
    'audio/mp4',
    'audio/wav',
    'audio/flac'
  ],

  allowedVideoTypes: [
    'video/mp4',
    'video/webm'
  ],

  allowedDocumentTypes: [
    'application/pdf'
  ],

  allowedExtensionsByMime: {
    'image/png': [
      'png'
    ],

    'image/jpeg': [
      'jpg',
      'jpeg'
    ],

    'image/webp': [
      'webp'
    ],

    'audio/mpeg': [
      'mp3'
    ],

    'audio/mp4': [
      'm4a',
      'mp4'
    ],

    'audio/wav': [
      'wav'
    ],

    'audio/flac': [
      'flac'
    ],

    'video/mp4': [
      'mp4'
    ],

    'video/webm': [
      'webm'
    ],

    'application/pdf': [
      'pdf'
    ]
  }
};
