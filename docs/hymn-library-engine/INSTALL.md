# Instalación V8.2 Hymn Library Engine

## Rama recomendada

Crear una rama nueva desde `main`:

```text
V8.2-hymn-library-engine
```

## Subir archivos

Subir este ZIP a esa rama.

Commit recomendado:

```text
Add V8.2 Hymn Library Engine
```

## Agregar CSS en index.html

Debajo de los CSS existentes:

```html
<link rel="stylesheet" href="/src/features/hymn-library-engine/styles/hymn-library.css">
```

## Próximo paso

Crear un paquete de integración para reemplazar la vista actual de Himnos con:

```js
renderHymnLibrary()
renderHymnDetail(id)
initHymnLibrary()
```
