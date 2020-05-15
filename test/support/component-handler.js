import {act, create} from "react-test-renderer";

export default class ComponentHandler {
  constructor(element, options = {}) {
    this.ref = element.ref;

    act(() => { this.renderer = create(element, options); });
  }
  get instance() { return this.renderer.root.instance || this.renderer.root; }
  get props() { return this.instance.props; }
  get state() { return this.instance.state; }
  get tree() { return this.renderer.toJSON(); }
  act(run) { act(run); }
  findByText(text) { return this.instance.find((element) => element.children[0] === text); }
  unmount() { this.renderer.unmount(); }
  updateProps(newProps) {
    const Component = this.renderer.root.type;
    const props = {...this.props, ...newProps};

    act(() => { this.renderer.update(<Component ref={this.ref} {...props} />); });
  }
  updateState(state) {
    act(() => { this.instance.setState(state); });
  }
}
