import {useState} from "react";
import useAssessment from "lib/hooks/use-assessment";
import Container from "./container";
import QuestionSet from "./question-set";

export default function Generic() {
  const [questionSetIndex, setQuestionSetIndex] = useState(0);
  const assessment = useAssessment({surveyType: "generic"});
  const questionSets = assessment ? assessment.questionSets : [];
  const currentQuestionSet = questionSets ? questionSets[questionSetIndex] : {};
  const progress = questionSetIndex >= 0 ? (questionSetIndex / questionSets.length) * 100 : 0;
  const lastSlide = questionSets[questionSetIndex - 1];
  const nextSlide = questionSets[questionSetIndex + 1];

  const props = {progress};

  const updateSlide = (response) => {
    console.log("Updating slide with response:", response);
  };

  return (
    <Container {...props}>
      {currentQuestionSet && <QuestionSet key={questionSetIndex} {...currentQuestionSet} />}
    </Container>
  );
}
