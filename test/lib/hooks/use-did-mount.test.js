import useDidMount from "lib/hooks/use-did-mount";
import ComponentHandler from "support/component-handler";

describe("useDidMount", () => {
  const didMount = jest.fn().mockName("didMount");

  function Component() {
    useDidMount(didMount);

    return null;
  }

  beforeEach(() => {
    didMount.mockClear();
  });

  it("is called on mount", () => {
    new ComponentHandler(<Component />);

    expect(didMount).toHaveBeenCalledTimes(1);
  });

  it("is not called on update", () => {
    const component = new ComponentHandler(<Component />);
    didMount.mockClear();
    component.updateProps();

    expect(didMount).not.toHaveBeenCalled();
  });
});
