export const LOG_LEVELS = Object.freeze({
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  trace: 5
});

export const DEFAULT_LOG_LEVEL = "info";

export function normalizeLevel(level, fallback = DEFAULT_LOG_LEVEL) {
  if (typeof level !== "string") return fallback;
  return Object.hasOwn(LOG_LEVELS, level) ? level : fallback;
}

export function shouldLog(currentLevel, messageLevel) {
  return LOG_LEVELS[messageLevel] <= LOG_LEVELS[currentLevel] && LOG_LEVELS[currentLevel] > 0;
}
