# Git Workflow

## Rama actual

Todo el desarrollo V8.0 se está integrando en la rama:

```text
V6
```

## Flujo recomendado

1. Descargar ZIP del módulo.
2. Descomprimir.
3. Copiar dentro de `src/core/` o `src/modules/`.
4. Revisar estructura.
5. Ejecutar pruebas básicas.
6. Hacer commit.

## Commit recomendado

```bash
git add .
git commit -m "Add V8.0 <Module Name>"
```

## Pull Request

No hacer Compare & Pull Request hasta completar módulos principales, integración básica y pruebas.
