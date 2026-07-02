# Cántico Core V8.0 – Configuration Engine

Este módulo centraliza la configuración de la aplicación y permite cargar, leer, validar, cambiar y exportar configuración de forma segura.

## Funciones principales

- Configuración base predeterminada.
- Mezcla profunda de configuración personalizada.
- Lectura por rutas tipo `app.name` o `ui.theme`.
- Validación con esquema.
- Cambios en tiempo de ejecución con eventos.
- Exportación limpia en JSON.
- Opción para congelar configuración.

## Uso rápido

```js
import { ConfigurationEngine } from "./src/core/index.js";

const config = ConfigurationEngine.create({
  config: {
    app: {
      name: "Cántico de Fe Music",
      environment: "production"
    }
  }
});

console.log(config.get("app.name"));
config.set("ui.theme", "dark");
```

## Eventos

```js
config.on("config:changed", ({ path, value }) => {
  console.log(path, value);
});
```
