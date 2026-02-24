import Component from "components/results/generic/breakdown/question";
import ComponentHandler from "support/component-handler";
import useContainer from "support/hooks/use-container";

const correctQuestion = {
  isCorrect: true,
  questionId: "question-1",
  questionText: "Question 1",
  responseOptions: [
    {isCorrect: true, responseOptionId: "response-1a", responseOptionText: "Response A"},
    {isCorrect: false, responseOptionId: "response-1b", responseOptionText: "Response B"}
  ],
  selectedResponseOptionId: "response-1a",
  setImage: "https://cdn.traitify.com/generic/set1.png"
};

const incorrectQuestion = {
  isCorrect: false,
  questionId: "question-2",
  questionText: "Question 2",
  responseOptions: [
    {isCorrect: true, responseOptionId: "response-2a", responseOptionText: "Response A"},
    {isCorrect: false, responseOptionId: "response-2b", responseOptionText: "Response B"}
  ],
  selectedResponseOptionId: "response-2b"
};

describe("Results.GenericBreakdown.Question", () => {
  let component;

  useContainer();

  it("renders closed question", async() => {
    component = await ComponentHandler.setup(Component, {
      props: {index: 0, open: false, question: correctQuestion, toggleOpen: jest.fn()}
    });

    expect(component.tree).toMatchSnapshot();
  });

  it("renders open correct question", async() => {
    component = await ComponentHandler.setup(Component, {
      props: {index: 0, open: true, question: correctQuestion, toggleOpen: jest.fn()}
    });

    expect(component.tree).toMatchSnapshot();
  });

  it("renders open incorrect question", async() => {
    component = await ComponentHandler.setup(Component, {
      props: {index: 0, open: true, question: incorrectQuestion, toggleOpen: jest.fn()}
    });

    expect(component.tree).toMatchSnapshot();
  });

  it("renders open question without image", async() => {
    const questionWithoutImage = {...correctQuestion, setImage: null};
    component = await ComponentHandler.setup(Component, {
      props: {index: 0, open: true, question: questionWithoutImage, toggleOpen: jest.fn()}
    });

    expect(component.tree).toMatchSnapshot();
  });
});
