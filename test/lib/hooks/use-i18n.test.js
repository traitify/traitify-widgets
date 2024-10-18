import {createRef} from "react";
import useI18n from "lib/hooks/use-i18n";
import ComponentHandler from "support/component-handler";
import useContainer from "support/hooks/use-container";

describe("useI18n", () => {
  let component;
  let value;

  function Component() {
    const i18n = useI18n();
    value.current = i18n;

    return i18n.translate("en-us", "tip_type_for_tools");
  }

  useContainer();

  beforeEach(() => {
    value = createRef(null);
  });

  it("translates", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
    expect(value.current.translate("en-us", "tip_type_for_tools")).toEqual("Tools to Use");
  });

  // TODO: Probably mock request?
  // TODO: Test deep merge
  it("translates with remote translations", async() => {
    component = await ComponentHandler.setup(Component);

    expect(component.tree).toMatchSnapshot();
    expect(value.current.translate("en-us", "tip_type_for_tools")).toEqual("Tools for Tots");
  });
});
