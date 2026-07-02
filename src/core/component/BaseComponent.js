export class BaseComponent {
  constructor(props = {}){
    this.props = props;
  }

  render(){
    throw new Error('render() must be implemented by subclasses');
  }

  mount(container){
    container.innerHTML = this.render();
  }
}
