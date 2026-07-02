# Architecture Diagram

```text
                    Cántico de Fe Music V8.0
                              │
              ┌───────────────┴───────────────┐
              │                               │
          Core Engines                 Functional Modules
              │                               │
 ┌────────────┼────────────┐       ┌──────────┼──────────┐
 Router     State      Event Bus   CMS     Hymns     Player
 Config     Logger     Cache       Albums  Playlists Media
 API        Theme      Layout      Dashboard Auth     Users
 DI         Service    Component   SEO     Search    PWA
            Container
```
