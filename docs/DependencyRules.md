# Dependency Rules

## Regla principal

Los módulos funcionales no deben depender directamente entre sí.

Correcto:

```text
Module → Core Service → Module
```

Incorrecto:

```text
Dashboard → Music Player
CMS → Hymns
```

## Comunicación recomendada

- Service Container para servicios compartidos.
- Event Bus para eventos entre módulos.
- API Engine para comunicación externa.
- State Engine para estado compartido.
- Logger Engine para trazabilidad.
- Cache Engine para rendimiento.
