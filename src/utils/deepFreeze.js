export function deepFreeze(object) {
  if (!object || typeof object !== "object" || Object.isFrozen(object)) return object;

  Object.getOwnPropertyNames(object).forEach((name) => {
    const value = object[name];
    if (value && typeof value === "object") deepFreeze(value);
  });

  return Object.freeze(object);
}
