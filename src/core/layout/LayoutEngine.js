export class LayoutEngine {
  constructor() {
    this.layouts = new Map();
    this.activeLayout = null;
  }

  register(name, layout) {
    this.layouts.set(name, layout);
  }

  setActive(name) {
    if (!this.layouts.has(name)) {
      throw new Error(`Layout '${name}' not found`);
    }
    this.activeLayout = name;
  }

  getActive() {
    return this.layouts.get(this.activeLayout);
  }

  list() {
    return [...this.layouts.keys()];
  }
}
