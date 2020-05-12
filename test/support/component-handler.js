import {act, create} from "react-test-renderer";

export default class ComponentHandler {
  constructor(element, options = {}) {
    act(() => { this.renderer = create(element, options); });
  }
  get instance() { return this.renderer.root.instance || this.renderer.root; }
  get props() { return this.instance.props; }
  get state() { return this.instance.state; }
  get tree() { return this.renderer.toJSON(); }
  act(run) { act(run); }
  unmount() { this.renderer.unmount(); }
  updateProps(props) {
    const Component = this.renderer.root.type;

    act(() => { this.renderer.update(<Component {...{...this.props, ...props}} />); });
  }
  updateState(state) {
    act(() => { this.instance.setState(state); });
  }
}
