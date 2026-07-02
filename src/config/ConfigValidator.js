function getByPath(object, path) {
  return path.split(".").reduce((current, key) => current?.[key], object);
}

export class ConfigValidator {
  constructor(schema = {}) {
    this.schema = schema;
  }

  validate(config) {
    const errors = [];

    for (const [path, rule] of Object.entries(this.schema)) {
      const value = getByPath(config, path);
      if (value === undefined) continue;

      if (Array.isArray(rule)) {
        if (!rule.includes(value)) {
          errors.push(`${path} debe ser uno de: ${rule.join(", ")}`);
        }
        continue;
      }

      if (typeof value !== rule) {
        errors.push(`${path} debe ser tipo ${rule}, recibió ${typeof value}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
