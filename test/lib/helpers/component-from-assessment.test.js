import componentFromAssessment from "lib/helpers/component-from-assessment";
import ComponentHandler from "support/component-handler";

jest.mock("lib/with-traitify", () => ((Component) => (Component)));

const dimensionAssessment = {assessment_type: "DIMENSION_BASED"};
const DimensionComponent = () => (<div className="dimension">Personality Types</div>);
const typeAssessment = {assessment_type: "TYPE_BASED"};
const TypeComponent = () => (<div className="type">Personality Types</div>);

describe("Helpers", () => {
  let Component;

  beforeEach(() => {
    Component = componentFromAssessment({
      DIMENSION_BASED: DimensionComponent,
      TYPE_BASED: TypeComponent
    });
  });

  describe("componentFromAssessment", () => {
    it("waits for props", () => {
      const component = new ComponentHandler(<Component />);

      expect(component.state.component).toBeNull();
    });

    it("sets dimension component", () => {
      const component = new ComponentHandler(<Component assessment={dimensionAssessment} />);

      expect(component.state.component).toEqual(DimensionComponent);
    });

    it("sets type component", () => {
      const component = new ComponentHandler(<Component assessment={typeAssessment} />);

      expect(component.state.component).toEqual(TypeComponent);
    });

    it("sets component after update", () => {
      const component = new ComponentHandler(<Component />);
      component.updateProps({assessment: typeAssessment});

      expect(component.state.component).toEqual(TypeComponent);
    });
  });
});
