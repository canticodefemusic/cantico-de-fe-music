import {
  uploadConfig
} from '../constants/uploadConfig.js';

export function getAllowedTypes() {

  return [

    ...uploadConfig.allowedImageTypes,

    ...uploadConfig.allowedAudioTypes,

    ...uploadConfig.allowedVideoTypes,

    ...uploadConfig.allowedDocumentTypes

  ];

}

export function validateFile(file) {

  if (!file) {
    return false;
  }

  if (
    typeof file.size !== 'number' ||
    file.size <= 0
  ) {
    return false;
  }

  if (
    file.size >
    uploadConfig.maxFileSize
  ) {
    return false;
  }

  const allowedTypes =
    getAllowedTypes();

  if (
    file.type &&
    !allowedTypes.includes(file.type)
  ) {
    return false;
  }

  return true;

}
