import {createRef} from "react";
import {useRecoilValue} from "recoil";
import {optionsState} from "lib/recoil";
import ComponentHandler from "support/component-handler";
import {mockSettings} from "support/container/http";
import {mockOption, mockOptions} from "support/container/options";
import useContainer from "support/hooks/use-container";

describe("useDisabledComponentsEffect", () => {
  let options;

  function Component() {
    options.current = useRecoilValue(optionsState);

    return null;
  }

  useContainer();

  beforeEach(() => {
    options = createRef({});
    mockSettings({
      disabled_components: {
        widget: {
          candidate: {"Results.Personality.Trait.List": true},
          manager: {"Results.Recommendation.Chart": true}
        }
      }
    });
  });

  it("resolves the candidate report's disabled components", async() => {
    mockOption("report", "candidate");

    await ComponentHandler.setup(Component);

    expect(options.current.disabledComponents).toEqual(["Results.Personality.Trait.List"]);
  });

  it("resolves the manager report's disabled components", async() => {
    mockOption("report", "manager");

    await ComponentHandler.setup(Component);

    expect(options.current.disabledComponents).toEqual(["Results.Recommendation.Chart"]);
  });

  it("re-resolves when the report switches", async() => {
    mockOption("report", "candidate");

    const component = await ComponentHandler.setup(Component);

    expect(options.current.disabledComponents).toEqual(["Results.Personality.Trait.List"]);

    mockOptions({report: "manager"});
    await component.update();

    expect(options.current.disabledComponents).toEqual(["Results.Recommendation.Chart"]);
  });
});
