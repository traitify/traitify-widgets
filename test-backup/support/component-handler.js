import {act, create} from "react-test-renderer";

export {act};

export default class ComponentHandler {
  constructor(element, options = {}) {
    this.ref = element.ref;

    act(() => { this.renderer = create(element, options); });
  }
  get base() { return this.renderer.root; } // Test instance
  get child() { return this.base.children[0]; }
  get instance() { return this.base.instance || this.base; } // Either component or test instance
  get props() { return this.instance.props; }
  get state() { return this.instance.state; }
  get tree() { return this.renderer.toJSON(); }
  act(run) { act(run); }
  findByText(text, options = {}) {
    const {exact} = {exact: true, ...options};
    if(exact) { return this.base.find((element) => element.children[0] === text); }

    return this.base.find((element) => (
      element.children[0]
      && element.children[0].includes
      && element.children[0].includes(text)
    ));
  }
  unmount() { this.renderer.unmount(); }
  updateProps(newProps) {
    const Component = this.base.type;
    const props = {...this.props, ...newProps};

    act(() => { this.renderer.update(<Component ref={this.ref} {...props} />); });
  }
  updateState(state) {
    act(() => { this.instance.setState(state); });
  }
}
