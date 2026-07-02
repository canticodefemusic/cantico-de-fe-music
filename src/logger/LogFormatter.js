export class LogFormatter {
  constructor(options = {}) {
    this.includeTimestamp = options.includeTimestamp ?? true;
    this.includeContext = options.includeContext ?? true;
  }

  format(entry) {
    const parts = [];

    if (this.includeTimestamp) parts.push(`[${entry.timestamp}]`);
    parts.push(`[${entry.level.toUpperCase()}]`);
    parts.push(entry.namespace ? `[${entry.namespace}]` : "[cantico]");
    parts.push(entry.message);

    if (this.includeContext && entry.context && Object.keys(entry.context).length > 0) {
      parts.push(JSON.stringify(entry.context));
    }

    return parts.join(" ");
  }
}

export default LogFormatter;
