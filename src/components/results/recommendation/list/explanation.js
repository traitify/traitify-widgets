import Markdown from "components/common/markdown";
import useAssessmentTypes from "lib/hooks/use-assessment-types";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function RecommendationExplanation() {
  const {cognitive, personality, vendors} = useAssessmentTypes();
  const translate = useTranslate();
  const emmersion = vendors.includes("emmersion");
  const external = vendors.length > 0;
  const base = "results.benchmarks.explanation";
  const types = [
    cognitive && emmersion && personality && "cognitive_emmersion_personality",
    cognitive && external && personality && "cognitive_external_personality",
    cognitive && personality && "cognitive_personality",
    emmersion && personality && "emmersion_personality",
    external && personality && "external_personality",
    personality && "personality"
  ].filter(Boolean);
  const keys = [...types.map((type) => `${base}.${type}`), base];
  const heading = translate(keys.map((key) => `${key}.heading`));
  const text = translate(keys.map((key) => `${key}.text`));
  if(!heading && !text) { return null; }

  return (
    <div className={style.explanation}>
      {heading && <div className={style.explanationHeading}>{heading}</div>}
      {text && <div className={style.p}><Markdown>{text}</Markdown></div>}
    </div>
  );
}
