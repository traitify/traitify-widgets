import {useState} from "react";
import times from "lib/common/array/times";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useResults from "lib/hooks/use-results";
import useTranslate from "lib/hooks/use-translate";
import Question from "./question";
import style from "./style.scss";

export default function GenericBreakdown() {
  const [openQuestions, setOpenQuestions] = useState([]);
  const disabled = useDisabledComponent("Results.Generic.Breakdown");
  const results = useResults({surveyType: "generic"});
  const translate = useTranslate();

  useComponentEvents("GenericBreakdown");
  useComponentEvents({component: "Results.Generic.Breakdown"});

  if(disabled) { return null; }
  if(!results) { return null; }

  const toggleAll = () => {
    const totalQuestions = results.responses.length;

    setOpenQuestions(
      openQuestions.length === totalQuestions
        ? []
        : times(totalQuestions)
    );
  };
  const toggleOpen = (index) => {
    setOpenQuestions(
      openQuestions.includes(index)
        ? openQuestions.filter((i) => i !== index)
        : [...openQuestions, index]
    );
  };

  return (
    <div className={style.container}>
      <div className={style.description}>
        <div>
          <div className={style.title}>{translate("results.generic.breakdown")}</div>
          <div>{translate("results.generic.breakdown_description")}</div>
        </div>
        <button className={style.toggleAll} onClick={toggleAll} type="button">
          {translate("common.actions.show_hide_all")}
        </button>
      </div>
      <div className={style.questions}>
        {results.responses.map((question, index) => (
          <Question
            key={question.questionId}
            index={index}
            open={openQuestions.includes(index)}
            question={question}
            toggleOpen={() => toggleOpen(index)}
          />
        ))}
      </div>
    </div>
  );
}
