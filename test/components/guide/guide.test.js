import {Component} from "components/guide/index";
import ComponentHandler from "support/component-handler";
import response from "support/json/guide.json";

describe("Guide", () => {
  let props;

  beforeEach(() => {
    props = {
      translate: jest.fn().mockName("translate").mockImplementation((value) => value),
      assessmentID: "bca3ab7c-8ed1-421f-a0ab-39d619efeee0",
      traitify: {
        graphqlQuery: jest.fn().mockName("graphqlQuery").mockImplementation(() => (Promise.resolve()))
      }
    };
  });

  it("formats introduction", () => {
    const component = (new ComponentHandler(<Component {...props} />));
    component.updateState(
      {
        competencies: response.data.guide.competencies,
        displayedCompetency: response.data.guide.competencies[0]
      }
    );
    const introduction = component.instance.introduction();

    expect(introduction.intro).toBe("At the top level, Solving Problems (O) concerns how someone thinks about work problems, projects\nand challenges, how receptive they are to new or different information or approaches, and the way this\ninfluences their decision making.");
    expect(introduction.readMore).toBe("The benefits of being open-minded are likely to include approaching problems in original ways, making\nquick connections, pushing boundaries, seeing the bigger picture, and not getting stuck in the detail.\nIn contrast someone who is pragmatic likes to solve problems in practical ways, and prefers tried-andtested solutions or established rules and regulations. They are likely to have a fine eye for detail, be results\noriented, and able to bring experience to bear on a problem. Those who are a mixture of both (openminded/pragmatic) are best described as approaching problems in a systematic way, being able to flex\nbetween different options, capable of seeing situations at different levels of detail, and as bringing healthy\ncaution to decision making.\nThese personality characteristics provide the basis for asking a particular sequence of questions of each\nof the personality 'types'. The first question is looking to confirm what they should be like; the second two\nexplore areas of possible concern.");
  });

  it("handles displayedCompetency", () => {
    const component = (new ComponentHandler(<Component {...props} />));
    component.updateState(
      {
        competencies: response.data.guide.competencies,
        displayedCompetency: response.data.guide.competencies[0]
      }
    );
    expect(component.state.displayedCompetency.name).toBe("Solving Problems");

    component.instance.displayCompetency("Delivering Results");
    expect(component.state.displayedCompetency.name).toBe("Delivering Results");

    component.instance.displayCompetency({target: {value: "Engaging with People"}});
    expect(component.state.displayedCompetency.name).toBe("Engaging with People");

    component.instance.displayCompetency("some invalid competency");
    expect(component.state.displayedCompetency.name).toBe("Engaging with People");
  });

  it("matches snapshot on success", () => {
    const component = (new ComponentHandler(<Component {...props} />));
    component.updateState(
      {
        competencies: response.data.guide.competencies,
        displayedCompetency: response.data.guide.competencies[0]
      }
    );

    expect(component.tree).toMatchSnapshot();
  });

  it("returns blank div on error", () => {
    const component = (new ComponentHandler(<Component {...props} />));
    component.updateState({errors: ["did not successfully fetch guide"]});
    expect(component.tree).toMatchSnapshot();
  });
});
