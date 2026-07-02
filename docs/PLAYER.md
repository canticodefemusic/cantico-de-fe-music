# Cántico de Fe Music V6.2 Player

## Nuevo en V6.2

- Reproductor global avanzado.
- Soporte para MP3 real usando `audioUrl`.
- Play / Pause.
- Siguiente / Anterior.
- Barra de progreso real.
- Control de volumen.
- Repeat / Repetir.
- Shuffle / Aleatorio.
- Cola desde himnos, playlists y álbumes.
- Página nueva `Player`.

## Cómo conectar un MP3

1. Sube el archivo a:

`assets/audio/mi-himno.mp3`

2. En `api/hymns.json`, agrega:

`"audioUrl": "/assets/audio/mi-himno.mp3"`

3. Haz commit en la rama V6.

## Cloudflare Pages

- Framework preset: None
- Build command: vacío
- Build output directory: /

## Importante

Subir esta versión en la rama `V6`, no en `main`.
