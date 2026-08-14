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


function getFileExtension(
  fileName = ''
) {
  const value =
    String(fileName)
      .trim()
      .toLowerCase();

  const lastDotIndex =
    value.lastIndexOf('.');

  if (
    lastDotIndex <= 0 ||
    lastDotIndex ===
      value.length - 1
  ) {
    return '';
  }

  return value.slice(
    lastDotIndex + 1
  );
}


function hasValidMimeExtensionPair(
  file
) {
  const mimeType =
    String(
      file?.type || ''
    )
      .trim()
      .toLowerCase();

  const extension =
    getFileExtension(
      file?.name || ''
    );

  if (
    !mimeType ||
    !extension
  ) {
    return false;
  }

  const allowedExtensions =
    uploadConfig
      .allowedExtensionsByMime[
        mimeType
      ];

  if (
    !Array.isArray(
      allowedExtensions
    )
  ) {
    return false;
  }

  return allowedExtensions.includes(
    extension
  );
}


export function validateFile(
  file
) {
  if (!file) {
    return false;
  }

  if (
    typeof file.size !==
      'number' ||
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

  const mimeType =
    String(
      file.type || ''
    )
      .trim()
      .toLowerCase();

  if (
    !mimeType ||
    !allowedTypes.includes(
      mimeType
    )
  ) {
    return false;
  }

  if (
    !hasValidMimeExtensionPair(
      file
    )
  ) {
    return false;
  }

  return true;
}
