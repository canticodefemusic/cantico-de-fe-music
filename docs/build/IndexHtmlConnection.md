# Conexión con index.html

Para activar este Build Patch, tu `index.html` debe tener:

```html
<div id="app"></div>
<script type="module" src="/src/app/app.js"></script>
<link rel="stylesheet" href="/src/fixes/build-patch-01.css">
```

Si ya tienes un `index.html` funcionando, no lo reemplaces todavía.
Primero revisa dónde está el `<div id="app"></div>` y dónde se cargan los scripts actuales.
