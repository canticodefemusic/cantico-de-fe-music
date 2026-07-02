# Migration Scripts

## 1. Scan Project

```bash
node migration/scripts/scan-project.js
```

Detecta carpetas antiguas en la raíz.

## 2. Dry Run

```bash
node migration/scripts/migrate-dry-run.js
```

Genera un reporte de lo que se movería, sin mover nada.

## 3. Crear carpetas destino

```bash
node migration/scripts/create-migration-folders.js
```

Crea la estructura destino dentro de `src/`.
