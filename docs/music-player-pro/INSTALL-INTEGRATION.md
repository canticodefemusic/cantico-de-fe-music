# Cómo instalar la integración Music Player Pro V8.1

## Rama

Usar la rama:

```text
V8.1-music-player-pro
```

## Paso 1

Sube este ZIP en esa misma rama:

```text
cantico_music_player_pro_v8_1_integration.zip
```

## Paso 2

Acepta reemplazar este archivo:

```text
src/app/unifiedApp.js
```

## Paso 3

Edita `index.html` y agrega este CSS en `<head>` si todavía no existe:

```html
<link rel="stylesheet" href="/src/features/music-player-pro/styles/music-player-pro.css">
```

Debe quedar junto al CSS principal:

```html
<link rel="stylesheet" href="/src/app/styles/unified-app.css">
<link rel="stylesheet" href="/src/features/music-player-pro/styles/music-player-pro.css">
```

## Paso 4

Commit recomendado:

```text
Integrate Music Player Pro V8.1
```

## Paso 5

Probar el Preview de Cloudflare de esta rama antes de hacer Pull Request.
