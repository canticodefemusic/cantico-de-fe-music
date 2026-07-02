export class MemoryTransport {
  constructor(options = {}) {
    this.enabled = options.enabled ?? true;
    this.maxEntries = options.maxEntries || 500;
    this.entries = [];
  }

  write(entry) {
    if (!this.enabled) return;
    this.entries.push(entry);
    if (this.entries.length > this.maxEntries) this.entries.shift();
  }

  all() {
    return [...this.entries];
  }

  clear() {
    this.entries = [];
  }
}

export default MemoryTransport;
