import useAssessments from "lib/hooks/use-assessments";
import useComponentEvents from "lib/hooks/use-component-events";
import Assessment from "./assessment";
import style from "./style.scss";

const translations = {
  header: "Your Application Assessments",
  text: "As part of your application, we'd like to ask you to complete the following assessments. Please click on the button next to the assessment name. This will take you to where you'll complete the assessment and either be returned to this page if you have multiple assessments to complete or taken to the next stage of the process."
};

export default function Status() {
  const assessments = useAssessments();

  useComponentEvents("Status", {assessments});

  if(!assessments) { return null; }
  if(assessments.length === 0) { return null; }

  return (
    <div className={style.container}>
      <div className={style.header}>{translations.header}</div>
      <div className={style.p}>{translations.text}</div>
      {assessments.map((assessment) => <Assessment key={assessment.id} assessment={assessment} />)}
    </div>
  );
}
