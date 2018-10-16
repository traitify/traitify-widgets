import {render} from "preact";
import componentFromAssessment from "lib/helpers/component-from-assessment";
import {createElement, domHooks} from "support/dom";

jest.mock("lib/with-traitify", ()=>((Component)=>(Component)));

const dimensionAssessment = {assessment_type: "DIMENSION_BASED"};
const DimensionComponent = ()=>(<div className="dimension">Personality Types</div>);
const typeAssessment = {assessment_type: "TYPE_BASED"};
const TypeComponent = ()=>(<div className="type">Personality Types</div>);

let renderResult;
const getComponent = ()=>(renderResult._component);
const updateComponent = (options)=>{
  const component = getComponent();
  const prevProps = {...component.props};
  const prevState = {...component.state};
  component.props = {...component.props, ...options.props};
  component.state = {...component.state, ...options.state};
  component.componentDidUpdate(prevProps, prevState);
};

describe("Helpers", ()=>{
  let Component;

  domHooks();

  beforeEach(()=>{
    Component = componentFromAssessment({
      DIMENSION_BASED: DimensionComponent,
      TYPE_BASED: TypeComponent
    });
  });

  describe("componentFromAssessment", ()=>{
    it("waits for props", ()=>{
      renderResult = render(<Component />, createElement());

      expect(getComponent().state.component).toBeUndefined();
    });

    it("sets dimension component", ()=>{
      renderResult = render(<Component assessment={dimensionAssessment} />, createElement());

      expect(getComponent().state.component).toEqual(DimensionComponent);
    });

    it("sets type component", ()=>{
      renderResult = render(<Component assessment={typeAssessment} />, createElement());

      expect(getComponent().state.component).toEqual(TypeComponent);
    });

    it("sets component after update", ()=>{
      renderResult = render(<Component />, createElement());
      updateComponent({props: {assessment: typeAssessment}});

      expect(getComponent().state.component).toEqual(TypeComponent);
    });
  });
});
