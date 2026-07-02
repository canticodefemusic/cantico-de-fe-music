export const defaultConfig = Object.freeze({
  app: {
    name: "Cántico Core",
    version: "8.0.0",
    environment: "development",
    language: "es",
    debug: true
  },
  routes: {
    mode: "history",
    basePath: "/",
    notFoundPath: "/404"
  },
  modules: {
    autoLoad: true,
    lazyLoad: true,
    registryPath: "./modules"
  },
  events: {
    enabled: true,
    maxListeners: 100,
    logEvents: false
  },
  state: {
    persist: false,
    storageKey: "cantico_core_state",
    storageDriver: "localStorage"
  },
  ui: {
    theme: "light",
    accentColor: "gold",
    animations: true
  },
  security: {
    freezeConfig: false,
    allowRuntimeOverride: true
  }
});
