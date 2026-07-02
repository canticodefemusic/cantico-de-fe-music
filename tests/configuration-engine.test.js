import assert from "node:assert/strict";
import { ConfigurationEngine } from "../src/core/index.js";

const engine = ConfigurationEngine.create({
  config: {
    app: { name: "Test App" },
    ui: { theme: "dark" }
  }
});

assert.equal(engine.get("app.name"), "Test App");
assert.equal(engine.get("ui.theme"), "dark");
assert.equal(engine.get("routes.basePath"), "/");
assert.equal(engine.has("events.enabled"), true);

let changed = false;
engine.on("config:changed", () => {
  changed = true;
});

engine.set("ui.theme", "light");
assert.equal(engine.get("ui.theme"), "light");
assert.equal(changed, true);

assert.throws(() => engine.set("ui.theme", "blue"), /Configuración inválida/);

console.log("✅ Configuration Engine tests passed");
