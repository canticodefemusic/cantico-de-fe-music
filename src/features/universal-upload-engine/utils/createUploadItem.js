import {
  detectFileCategory
} from './fileTypeDetector.js';

import {
  UPLOAD_STATUS
} from '../constants/uploadStatus.js';

function createUploadId() {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return [
    'upload',
    Date.now(),
    Math.random()
      .toString(36)
      .slice(2)
  ].join('_');
}

export function createUploadItem(file) {
  return {
    id: createUploadId(),

    file,

    name: file?.name || 'unknown',

    mimeType: file?.type || '',

    category:
      detectFileCategory(file),

    size: file?.size || 0,

    status:
      UPLOAD_STATUS.PENDING,

    progress: 0,

    error: null,

    attempts: 0,

    createdAt:
      new Date().toISOString(),

    startedAt: null,

    completedAt: null
  };
}
