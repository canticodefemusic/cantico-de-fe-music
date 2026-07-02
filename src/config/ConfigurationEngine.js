import { defaultConfig } from "./defaultConfig.js";
import { configSchema } from "./configSchema.js";
import { ConfigValidator } from "./ConfigValidator.js";
import { deepMerge } from "../utils/deepMerge.js";
import { deepFreeze } from "../utils/deepFreeze.js";

function getByPath(object, path) {
  return path.split(".").reduce((current, key) => current?.[key], object);
}

function setByPath(object, path, value) {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!current[key] || typeof current[key] !== "object") current[key] = {};
    return current[key];
  }, object);
  target[lastKey] = value;
  return object;
}

export class ConfigurationEngine {
  constructor(options = {}) {
    this.validator = new ConfigValidator(options.schema || configSchema);
    this.listeners = new Map();
    this.config = deepMerge(defaultConfig, options.config || {});
    this.assertValid(this.config);

    if (this.config.security.freezeConfig) {
      this.config = deepFreeze(this.config);
    }
  }

  static create(options = {}) {
    return new ConfigurationEngine(options);
  }

  load(partialConfig = {}) {
    const nextConfig = deepMerge(this.config, partialConfig);
    this.assertValid(nextConfig);
    this.config = this.shouldFreeze(nextConfig) ? deepFreeze(nextConfig) : nextConfig;
    this.emit("config:loaded", this.config);
    return this.config;
  }

  get(path, fallback = undefined) {
    if (!path) return this.config;
    const value = getByPath(this.config, path);
    return value === undefined ? fallback : value;
  }

  set(path, value) {
    if (!this.config.security.allowRuntimeOverride) {
      throw new Error("Runtime override está desactivado en security.allowRuntimeOverride.");
    }

    const nextConfig = deepMerge({}, this.config);
    setByPath(nextConfig, path, value);
    this.assertValid(nextConfig);
    this.config = this.shouldFreeze(nextConfig) ? deepFreeze(nextConfig) : nextConfig;
    this.emit("config:changed", { path, value, config: this.config });
    return this.config;
  }

  has(path) {
    return getByPath(this.config, path) !== undefined;
  }

  export() {
    return JSON.parse(JSON.stringify(this.config));
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

  assertValid(config) {
    const result = this.validator.validate(config);
    if (!result.valid) {
      throw new Error(`Configuración inválida:\n- ${result.errors.join("\n- ")}`);
    }
  }

  shouldFreeze(config) {
    return Boolean(config.security?.freezeConfig);
  }
}

export default ConfigurationEngine;
