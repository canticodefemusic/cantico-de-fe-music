export class DashboardModule {
  constructor() {
    this.widgets = [];
  }

  registerWidget(widget) {
    this.widgets.push(widget);
  }

  getWidgets() {
    return [...this.widgets];
  }

  removeWidget(id) {
    this.widgets = this.widgets.filter(w => w.id !== id);
  }
}
