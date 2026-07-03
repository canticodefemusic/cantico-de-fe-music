# Instalación Music Player Pro V8.1

## 1. Subir archivos

Sube este paquete a una rama de trabajo.

Recomendado:
- Rama nueva: `V8.1-music-player-pro`

## 2. Agregar CSS en index.html

Dentro de `<head>`:

```html
<link rel="stylesheet" href="/src/features/music-player-pro/styles/music-player-pro.css">
```

## 3. Integrar en `src/app/unifiedApp.js`

Agrega el import:

```js
import { renderMusicPlayerPro, initMusicPlayerPro } from '../features/music-player-pro/index.js';
```

Reemplaza:

```js
${renderPlayer()}
```

por:

```js
${renderMusicPlayerPro()}
```

Después de asignar `root.innerHTML`, agrega:

```js
setTimeout(() => initMusicPlayerPro(), 0);
```

## 4. Agregar audio real

Edita:

```text
src/features/music-player-pro/data/playerTracks.js
```

Ejemplo:

```js
src: '/assets/audio/fe-que-mueve-montanas.mp3'
```
