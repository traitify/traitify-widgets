import TestRenderer from "react-test-renderer";

export default class ComponentHandler{
  constructor(element){
    this.renderer = TestRenderer.create(element);
  }
  get instance(){ return this.renderer.root.instance; }
  get props(){ return this.instance.props; }
  get state(){ return this.instance.state; }
  get tree(){ return this.renderer.toJSON(); }
  updateProps(props){
    const Component = this.renderer.root.type;

    this.renderer.update(<Component {...{...this.props, ...props}} />);
  }
  updateState(state){
    this.instance.setState(state);
  }
}
