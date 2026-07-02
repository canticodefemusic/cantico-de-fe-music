import { LoggerEngine } from "../src/core/index.js";

const logger = LoggerEngine.create({
  level: "debug",
  namespace: "cantico:app"
});

logger.info("Cántico Logger Engine iniciado");
logger.debug("Cargando configuración", { version: "8.0.0" });
logger.warn("Ejemplo de advertencia");

const moduleLogger = logger.child("player");
moduleLogger.info("Módulo Player listo", { module: "player" });

console.log("Entradas guardadas en memoria:", logger.getMemoryEntries().length);
