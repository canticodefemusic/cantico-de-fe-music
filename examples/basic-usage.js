import { ConfigurationEngine } from "../src/core/index.js";

const config = ConfigurationEngine.create({
  config: {
    app: {
      name: "Cántico de Fe Music",
      environment: "production",
      debug: false
    },
    ui: {
      theme: "dark",
      accentColor: "gold"
    }
  }
});

config.on("config:changed", ({ path, value }) => {
  console.log(`Configuración actualizada: ${path} = ${value}`);
});

console.log("App:", config.get("app.name"));
console.log("Theme:", config.get("ui.theme"));

config.set("ui.theme", "light");
console.log("Export:", config.export());
