export class ThemeEngine {
  constructor(defaultTheme='light'){
    this.theme = defaultTheme;
    this.listeners = new Set();
  }

  setTheme(theme){
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.listeners.forEach(cb => cb(theme));
  }

  getTheme(){
    return this.theme;
  }

  onChange(callback){
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}
