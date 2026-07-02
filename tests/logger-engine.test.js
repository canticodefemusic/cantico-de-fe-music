import assert from "node:assert/strict";
import { LoggerEngine, MemoryTransport } from "../src/core/index.js";

const memory = new MemoryTransport({ maxEntries: 10 });
const logger = LoggerEngine.create({
  level: "warn",
  namespace: "test",
  transports: [memory]
});

assert.equal(logger.getLevel(), "warn");
assert.equal(logger.info("No debe guardarse"), null);

const entry = logger.error("Error de prueba", { code: "TEST_ERROR" });
assert.equal(entry.level, "error");
assert.equal(memory.all().length, 1);
assert.equal(memory.all()[0].context.code, "TEST_ERROR");

logger.setLevel("debug");
logger.debug("Ahora sí debe guardarse");
assert.equal(memory.all().length, 2);

const child = logger.child("module");
const childEntry = child.warn("Mensaje del módulo");
assert.equal(childEntry.namespace, "test:module");

console.log("✅ Logger Engine tests passed");
