import getDetail from "lib/common/get-detail";
import useOption from "lib/hooks/use-option";
import usePersonality from "lib/hooks/use-personality";
import style from "./style.scss";

export default function FinancialRiskHeading() {
  const personality = usePersonality();
  const perspective = useOption("perspective");
  if(!personality) { return null; }

  const badge = getDetail({name: "Badge", personality});
  const color = getDetail({name: "Color", personality});
  const options = {personality, perspective};
  const pronoun = perspective === "thirdPerson" ? "Their" : "Your";

  return (
    <div className={style.container}>
      <div className={style.description} style={color && {background: color}}>
        <div>
          {badge && <img alt={personality.name} src={badge} />}
          <div className={style.heading}>
            {pronoun} Financial Risk style is <span>{personality.name}</span>
          </div>
        </div>
        <div className={style.p}>{getDetail({...options, name: "Description"})}</div>
      </div>
      <div className={style.analysis}>
        <div className={style.heading}>What does this tell me?</div>
        <div className={style.p}>{getDetail({...options, name: "Analysis"})}</div>
      </div>
    </div>
  );
}
