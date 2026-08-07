import {
  uploadState
} from '../state/uploadState.js';

import {
  validateFile
} from '../utils/uploadValidator.js';

export class UploadService {

  add(file) {

    if (!validateFile(file)) {
      return false;
    }

    uploadState.queue.push(file);

    return true;

  }

  addMany(files = []) {

    const addedFiles = [];
    const rejectedFiles = [];

    files.forEach(file => {

      const added =
        this.add(file);

      if (added) {

        addedFiles.push(file);

      } else {

        rejectedFiles.push(file);

      }

    });

    return {

      addedFiles,

      rejectedFiles

    };

  }

  remove(index) {

    if (
      index < 0 ||
      index >= uploadState.queue.length
    ) {
      return null;
    }

    const [removedFile] =
      uploadState.queue.splice(
        index,
        1
      );

    return removedFile || null;

  }

  clear() {

    uploadState.queue.length = 0;

  }

  getQueue() {

    return [...uploadState.queue];

  }

  getQueueSize() {

    return uploadState.queue.length;

  }

}
