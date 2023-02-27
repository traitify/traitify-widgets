import useDidUpdate from "lib/hooks/use-did-update";
import ComponentHandler from "support/component-handler";

describe("useDidUpdate", () => {
  const didUpdate = jest.fn().mockName("didUpdate");

  function Component() {
    useDidUpdate(didUpdate);

    return null;
  }

  beforeEach(() => {
    didUpdate.mockClear();
  });

  it("is called on update", () => {
    const component = ComponentHandler.render(Component);
    didUpdate.mockClear();
    component.updateProps();

    expect(didUpdate).toHaveBeenCalledTimes(1);
  });

  it("is not called on moount", () => {
    ComponentHandler.render(Component);

    expect(didUpdate).not.toHaveBeenCalled();
  });
});
