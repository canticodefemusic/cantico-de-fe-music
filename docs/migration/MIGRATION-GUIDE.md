# Guía de Migración V8.0

## Objetivo

Unificar la arquitectura del proyecto para que la aplicación use principalmente:

```text
src/
├── core/
├── modules/
├── pages/
├── shared/
└── app/
```

## Problema actual

El proyecto tiene carpetas antiguas en la raíz:

```text
albumes/
himnos/
playlists/
devocionales/
seo/
components/
pages/
```

y también tiene la nueva arquitectura:

```text
src/
```

Eso puede causar duplicados y confusión.

## Recomendación

No borrar carpetas antiguas todavía.

Primero:

1. Ejecutar scanner.
2. Revisar reporte.
3. Crear carpetas destino.
4. Migrar manualmente solo lo necesario.
5. Probar el sitio.
6. Cuando todo funcione, archivar carpetas antiguas.
