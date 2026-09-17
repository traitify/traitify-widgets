import Component from "components/results/recommendation/list/explanation";
import useAssessmentTypes from "lib/hooks/use-assessment-types";
import ComponentHandler from "support/component-handler";
import useContainer from "support/hooks/use-container";

jest.mock("lib/hooks/use-assessment-types", () => jest.fn().mockName("useAssessmentTypes"));

describe("Results.RecommendationExplanation", () => {
  let component;

  useContainer();

  const setup = async(types) => {
    useAssessmentTypes.mockReturnValue({
      cognitive: false,
      personality: false,
      vendors: [],
      ...types
    });
    component = await ComponentHandler.setup(Component);

    return component;
  };

  it("renders the personality explanation", async() => {
    await setup({personality: true});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders the cognitive and personality explanation", async() => {
    await setup({cognitive: true, personality: true});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders the emmersion and personality explanation", async() => {
    await setup({personality: true, vendors: ["emmersion"]});

    expect(component.tree).toMatchSnapshot();
  });

  it("renders the cognitive, emmersion, and personality explanation", async() => {
    await setup({cognitive: true, personality: true, vendors: ["emmersion"]});

    expect(component.tree).toMatchSnapshot();
  });

  it("falls through the external default for non-emmersion vendors", async() => {
    await setup({personality: true, vendors: ["crosschq"]});

    expect(component.tree).toMatchSnapshot();
  });

  it("falls back to the general explanation without a matching combo", async() => {
    await setup({cognitive: true});

    expect(component.tree).toMatchSnapshot();
  });
});
