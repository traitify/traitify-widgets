import {act, create} from "react-test-renderer";
import Container from "components/container";
import flushAsync from "support/flush-async";

const renderComponent = (Component, {options = {}, props}) => (
  options.wrap
    ? <Container {...global.container}><Component {...props} /></Container>
    : <Component {...props} />
);

export default class ComponentHandler {
  constructor(Component, {options, renderer} = {}) {
    this.Component = Component;
    this.options = options;
    this.renderer = renderer;
  }
  static render(Component, _options = {}) {
    const {props, wrap = false, ...createOptions} = _options;
    const options = {wrap};
    let renderer;

    act(() => {
      renderer = create(renderComponent(Component, {options, props}), createOptions);
    });

    return new ComponentHandler(Component, {options, renderer});
  }
  static async setup(Component, _options = {}) {
    const {props, wrap = true, ...createOptions} = _options;
    const options = {wrap};
    let renderer;

    act(() => {
      renderer = create(renderComponent(Component, {options, props}), createOptions);
    });

    const component = new ComponentHandler(Component, {options, renderer});

    await flushAsync();

    return component;
  }
  get base() { return this.renderer.root.findByType(this.Component); }
  get container() { return this.renderer.root.instance; }
  get props() { return this.base.props; }
  get state() { return this.base.state; }
  get tree() { return this.renderer.toJSON(); }
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
  updateProps(props) {
    act(() => (
      this.renderer.update(
        renderComponent(this.Component, {options: this.options, props: {...this.props, ...props}})
      )
    ));
  }
}
