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

    const component = new ComponentHandler(Component, {options, renderer});
    if(props?.ref) { component.ref = props.ref; }

    return component;
  }
  static async setup(Component, _options = {}) {
    const {props, wrap = true, ...createOptions} = _options;
    const options = {wrap};
    let renderer;

    await act(async() => {
      renderer = create(renderComponent(Component, {options, props}), createOptions);
    });

    const component = new ComponentHandler(Component, {options, renderer});
    if(props?.ref) { component.ref = props.ref; }

    await flushAsync();

    return component;
  }
  get container() { return this.renderer.root.instance; }
  get instance() { return this.renderer.root.findByType(this.Component); }
  get props() { return this.instance.props; }
  get state() { return this.instance.state; }
  get tree() { return this.renderer.toJSON(); }
  findAllByText(text, options = {}) {
    const {exact} = {exact: true, ...options};
    if(exact) { return this.instance.findAll((element) => element.children[0] === text); }

    return this.instance.findAll((element) => (
      element.children[0]
      && element.children[0].includes
      && element.children[0].includes(text)
    ));
  }
  findByText(text, options = {}) {
    const {exact} = {exact: true, ...options};
    if(exact) { return this.instance.find((element) => element.children[0] === text); }

    return this.instance.find((element) => (
      element.children[0]
      && element.children[0].includes
      && element.children[0].includes(text)
    ));
  }
  unmount() { this.renderer.unmount(); }
  async update(_props) {
    const props = {...this.props, ..._props};
    if(this.ref) { props.ref = this.ref; }

    await act(async() => {
      this.renderer.update(
        renderComponent(this.Component, {options: this.options, props})
      );
    });

    await flushAsync();
  }
  updateProps(_props) {
    const props = {...this.props, ..._props};
    if(this.ref) { props.ref = this.ref; }

    act(() => {
      this.renderer.update(
        renderComponent(this.Component, {options: this.options, props})
      );
    });
  }
}
