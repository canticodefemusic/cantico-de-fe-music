# Cómo conectar index.html

Busca tu `index.html` principal.

Dentro de `<head>` agrega:

```html
<link rel="stylesheet" href="/src/app/styles/unified-app.css">
```

Antes de cerrar `</body>` agrega:

```html
<script type="module" src="/src/app/main.js"></script>
```

Confirma que exista:

```html
<div id="app"></div>
```

Si tu `index.html` ya tiene otro script principal, no lo borres todavía.
Primero prueba si hay conflicto.
