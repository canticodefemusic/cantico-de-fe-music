export function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

export function deepMerge(target = {}, source = {}) {
  const output = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (Array.isArray(value)) {
      output[key] = [...value];
    } else if (isPlainObject(value) && isPlainObject(output[key])) {
      output[key] = deepMerge(output[key], value);
    } else if (isPlainObject(value)) {
      output[key] = deepMerge({}, value);
    } else {
      output[key] = value;
    }
  }

  return output;
}
