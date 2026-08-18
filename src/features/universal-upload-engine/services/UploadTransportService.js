export class UploadTransportService {

  constructor({
    endpoint = '/api/upload',
    onProgress = null
  } = {}) {
    this.endpoint = endpoint;
    this.onProgress = onProgress;

    this.requests =
      new Map();
  }

  upload(item) {
    if (
      !item?.id ||
      !item?.file
    ) {
      return Promise.reject(
        new Error(
          'Invalid upload item'
        )
      );
    }

    return new Promise(
      (resolve, reject) => {

        const xhr =
          new XMLHttpRequest();

        const formData =
          new FormData();

        formData.append(
          'file',
          item.file,
          item.file.name
        );

        this.requests.set(
          item.id,
          xhr
        );

        xhr.open(
          'POST',
          this.endpoint,
          true
        );

        xhr.responseType =
          'json';

        xhr.upload.addEventListener(
          'progress',
          event => {
            if (
              !event.lengthComputable
            ) {
              return;
            }

            const progress =
              Math.min(
                100,
                Math.max(
                  0,
                  Math.round(
                    (
                      event.loaded /
                      event.total
                    ) * 100
                  )
                )
              );

            this.onProgress?.(
              item.id,
              progress
            );
          }
        );

        xhr.addEventListener(
          'load',
          () => {
            this.requests.delete(
              item.id
            );

            const response =
              xhr.response;

            if (
              xhr.status >= 200 &&
              xhr.status < 300 &&
              response?.success
            ) {
              this.onProgress?.(
                item.id,
                100
              );

              resolve(
                response
              );

              return;
            }

            const message =
              response?.error ||
              `Upload failed with status ${xhr.status}`;

            reject(
              new Error(
                message
              )
            );
          }
        );

        xhr.addEventListener(
          'error',
          () => {
            this.requests.delete(
              item.id
            );

            reject(
              new Error(
                'Network error while uploading file.'
              )
            );
          }
        );

        xhr.addEventListener(
          'timeout',
          () => {
            this.requests.delete(
              item.id
            );

            reject(
              new Error(
                'Upload request timed out.'
              )
            );
          }
        );

        xhr.addEventListener(
          'abort',
          () => {
            this.requests.delete(
              item.id
            );

            const error =
              new Error(
                'Upload cancelled'
              );

            error.name =
              'AbortError';

            reject(
              error
            );
          }
        );

        xhr.send(
          formData
        );
      }
    );
  }

  cancel(id) {
    const xhr =
      this.requests.get(id);

    if (!xhr) {
      return false;
    }

    xhr.abort();

    this.requests.delete(
      id
    );

    return true;
  }

  cancelAll() {
    this.requests.forEach(
      xhr => {
        xhr.abort();
      }
    );

    this.requests.clear();
  }

  isUploading(id) {
    return this.requests.has(id);
  }

  getActiveCount() {
    return this.requests.size;
  }

}
