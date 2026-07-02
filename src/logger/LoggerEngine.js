import { LOG_LEVELS, DEFAULT_LOG_LEVEL, normalizeLevel, shouldLog } from "./logLevels.js";
import { LogFormatter } from "./LogFormatter.js";
import { ConsoleTransport } from "./ConsoleTransport.js";
import { MemoryTransport } from "./MemoryTransport.js";

export class LoggerEngine {
  constructor(options = {}) {
    this.level = normalizeLevel(options.level || DEFAULT_LOG_LEVEL);
    this.namespace = options.namespace || "cantico";
    this.formatter = options.formatter || new LogFormatter(options.formatterOptions);
    this.transports = options.transports || [new ConsoleTransport(), new MemoryTransport()];
    this.listeners = new Map();
  }

  static create(options = {}) {
    return new LoggerEngine(options);
  }

  setLevel(level) {
    this.level = normalizeLevel(level, this.level);
    this.emit("logger:level-changed", { level: this.level });
    return this;
  }

  getLevel() {
    return this.level;
  }

  child(namespace) {
    return new LoggerEngine({
      level: this.level,
      namespace: `${this.namespace}:${namespace}`,
      formatter: this.formatter,
      transports: this.transports
    });
  }

  error(message, context = {}) {
    return this.log("error", message, context);
  }

  warn(message, context = {}) {
    return this.log("warn", message, context);
  }

  info(message, context = {}) {
    return this.log("info", message, context);
  }

  debug(message, context = {}) {
    return this.log("debug", message, context);
  }

  trace(message, context = {}) {
    return this.log("trace", message, context);
  }

  log(level, message, context = {}) {
    const normalizedLevel = normalizeLevel(level);
    if (!shouldLog(this.level, normalizedLevel)) return null;

    const entry = Object.freeze({
      id: cryptoSafeId(),
      level: normalizedLevel,
      namespace: this.namespace,
      message: String(message),
      context: sanitizeContext(context),
      timestamp: new Date().toISOString()
    });

    const formattedMessage = this.formatter.format(entry);
    this.transports.forEach((transport) => transport.write(entry, formattedMessage));
    this.emit("logger:entry", entry);
    return entry;
  }

  getMemoryEntries() {
    return this.transports
      .filter((transport) => typeof transport.all === "function")
      .flatMap((transport) => transport.all());
  }

  clearMemory() {
    this.transports.forEach((transport) => {
      if (typeof transport.clear === "function") transport.clear();
    });
  }

  on(eventName, callback) {
    if (!this.listeners.has(eventName)) this.listeners.set(eventName, new Set());
    this.listeners.get(eventName).add(callback);
    return () => this.off(eventName, callback);
  }

  off(eventName, callback) {
    this.listeners.get(eventName)?.delete(callback);
  }

  emit(eventName, payload) {
    this.listeners.get(eventName)?.forEach((callback) => callback(payload));
  }
}

function sanitizeContext(context) {
  if (!context || typeof context !== "object") return {};
  try {
    return JSON.parse(JSON.stringify(context));
  } catch {
    return { note: "Contexto no serializable" };
  }
}

function cryptoSafeId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `log_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export { LOG_LEVELS };
export default LoggerEngine;
