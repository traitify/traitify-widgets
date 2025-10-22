import Component from "components/results/financial-risk/dimension/details";
import ComponentHandler from "support/component-handler";
import {useOption} from "support/container/options";
import assessment from "support/data/assessment/personality/financial-risk";
import useContainer from "support/hooks/use-container";

describe("Results.FinancialRisk.Dimension.Details", () => {
  let component;
  let props;

  useContainer();
  useOption("perspective", "thirdPerson");

  beforeEach(() => {
    props = {type: assessment.personality_types[0]};
  });

  it("renders component", async() => {
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders nothing if no characteristics", async() => {
    props.type = {...props.type, personality_type: {...props.type.personality_type, details: []}};
    component = await ComponentHandler.setup(Component, {props});

    expect(component.tree).toMatchSnapshot();
  });
});
