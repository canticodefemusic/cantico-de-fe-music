# Module Development Standard

Cada módulo funcional debe contener como mínimo:

```text
ModuleName/
├── README.md
├── CHANGELOG.md
└── src/
    └── modules/
        └── module-name/
            ├── ModuleNameModule.js
            ├── index.js
            ├── controllers/
            ├── services/
            ├── routes/
            ├── providers/
            ├── interfaces/
            ├── styles/
            └── tests/
```

Módulos con datos persistentes pueden incluir:

- repositories/
- models/
- policies/
- permissions/
