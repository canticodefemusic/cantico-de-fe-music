# V8.0 Build Patch 02 - Unified Application

## Qué hace

Este parche crea una aplicación pública unificada.

Incluye:

- `src/app/main.js`
- `src/app/unifiedApp.js`
- Router básico por query `?page=`
- Navegación pública
- Vistas principales
- Datos iniciales
- SEO runtime
- Estilos principales
- Mini reproductor visual

## Importante

Este parche necesita que `index.html` cargue:

```html
<link rel="stylesheet" href="/src/app/styles/unified-app.css">
<script type="module" src="/src/app/main.js"></script>
```

y que exista:

```html
<div id="app"></div>
```
