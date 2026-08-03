/**
 * Cántico de Fe Music
 * V10.9 — Toast Notification Service
 */

const DEFAULT_DURATION = 3200;

function createToastId() {
  return [
    'cantico-toast',
    Date.now(),
    Math.random()
      .toString(16)
      .slice(2)
  ].join('-');
}

function normalizeType(type = 'info') {
  const allowedTypes = [
    'success',
    'error',
    'warning',
    'info'
  ];

  return allowedTypes.includes(type)
    ? type
    : 'info';
}

function normalizeDuration(duration) {
  const numericDuration =
    Number(duration);

  if (
    !Number.isFinite(numericDuration) ||
    numericDuration < 1000
  ) {
    return DEFAULT_DURATION;
  }

  return numericDuration;
}

const ToastService = {
  show({
    message = '',
    title = '',
    type = 'info',
    duration = DEFAULT_DURATION
  } = {}) {
    const cleanMessage =
      String(message || '').trim();

    if (!cleanMessage) {
      return null;
    }

    const toast = {
      id: createToastId(),
      title:
        String(title || '').trim(),
      message: cleanMessage,
      type: normalizeType(type),
      duration:
        normalizeDuration(duration),
      createdAt: Date.now()
    };

    window.dispatchEvent(
      new CustomEvent(
        'cantico:toast-show',
        {
          detail: toast
        }
      )
    );

    return toast;
  },

  success(message, options = {}) {
    return this.show({
      ...options,
      message,
      type: 'success'
    });
  },

  error(message, options = {}) {
    return this.show({
      ...options,
      message,
      type: 'error'
    });
  },

  warning(message, options = {}) {
    return this.show({
      ...options,
      message,
      type: 'warning'
    });
  },

  info(message, options = {}) {
    return this.show({
      ...options,
      message,
      type: 'info'
    });
  },

  dismiss(toastId) {
    if (!toastId) {
      return;
    }

    window.dispatchEvent(
      new CustomEvent(
        'cantico:toast-dismiss',
        {
          detail: {
            toastId
          }
        }
      )
    );
  },

  clear() {
    window.dispatchEvent(
      new CustomEvent(
        'cantico:toast-clear'
      )
    );
  }
};

export default ToastService;
