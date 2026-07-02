# Integration Patch 01

## Dónde va

Subir en rama `V6`.

## Archivos principales

- `src/app/main.js`
- `src/app/navigation.js`
- `public/index-launch-ready.html`
- `launch-ready-fixes.css`

## Paso importante

Si tu proyecto ya tiene `index.html`, NO lo reemplaces automáticamente.

Primero usa `public/index-launch-ready.html` como referencia.

Cuando confirmemos cómo está tu `index.html` actual, hacemos el parche final para conectarlo sin romper lo que ya funciona.

## Commit recomendado

```bash
git add .
git commit -m "Add V8.0 Integration Patch 01"
```
