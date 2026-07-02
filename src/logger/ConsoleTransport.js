export class ConsoleTransport {
  constructor(options = {}) {
    this.enabled = options.enabled ?? true;
  }

  write(entry, formattedMessage) {
    if (!this.enabled) return;

    const method = entry.level === "trace" ? "debug" : entry.level;
    const writer = console[method] || console.log;
    writer.call(console, formattedMessage);
  }
}

export default ConsoleTransport;
