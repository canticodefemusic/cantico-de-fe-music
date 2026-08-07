export function detectFileCategory(file) {
  const type = file?.type || '';

  if (type.startsWith('image/')) {
    return 'image';
  }

  if (type.startsWith('audio/')) {
    return 'audio';
  }

  if (type.startsWith('video/')) {
    return 'video';
  }

  if (type === 'application/pdf') {
    return 'document';
  }

  return 'unknown';
}
