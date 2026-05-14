import {createRef} from "react";
import {useRecoilValue} from "recoil";
import useDefaultOptions from "lib/hooks/use-default-options";
import {optionsState} from "lib/recoil";
import ComponentHandler from "support/component-handler";
import {mockOption} from "support/container/options";
import useContainer from "support/hooks/use-container";

describe("useDefaultOptions", () => {
  let options;

  function Component({defaults}) {
    useDefaultOptions(defaults);
    options.current = useRecoilValue(optionsState);

    return null;
  }

  useContainer();

  beforeEach(() => {
    options = createRef({});
  });

  it("does nothing when nested key exists", async() => {
    mockOption("survey", {render: false});

    await ComponentHandler.setup(Component, {props: {defaults: {"survey.render": true}}});

    expect(options.current.survey.render).toBe(false);
  });

  it("does nothing when shallow key exists", async() => {
    mockOption("perspective", "firstPerson");

    await ComponentHandler.setup(Component, {props: {defaults: {perspective: "thirdPerson"}}});

    expect(options.current.perspective).toBe("firstPerson");
  });

  it("sets nested default", async() => {
    await ComponentHandler.setup(Component, {props: {defaults: {"survey.render": true}}});

    expect(options.current.survey.render).toBe(true);
  });

  it("sets nested default when shallow object exists", async() => {
    mockOption("survey", {showInstructions: false});
    await ComponentHandler.setup(Component, {props: {defaults: {"survey.render": true}}});

    expect(options.current.survey).toEqual({render: true, showInstructions: false});
  });

  it("sets shallow default", async() => {
    await ComponentHandler.setup(Component, {props: {defaults: {perspective: "thirdPerson"}}});

    expect(options.current.perspective).toBe("thirdPerson");
  });
});
