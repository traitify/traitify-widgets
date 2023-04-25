import getDetail from "lib/common/get-detail";
import getDetails from "lib/common/get-details";
import useOption from "lib/hooks/use-option";
import usePersonality from "lib/hooks/use-personality";
import style from "./style.scss";

export default function FinancialRiskDetails() {
  const personality = usePersonality();
  const perspective = useOption("perspective");
  if(!personality) { return null; }

  const options = {personality, perspective};

  return (
    <div className={style.container}>
      <div className={style.life}>
        <div className={style.heading}>This style in everyday life:</div>
        <div className={style.p}>{getDetail({...options, name: "Everyday Life Title"})}</div>
        <ul>
          {getDetails({...options, name: "Everyday Life Detail"}).map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </div>
      <div className={style.financial}>
        <div className={style.heading}>This style in financial decisions:</div>
        <div className={style.p}>{getDetail({...options, name: "Financial Decisions Title"})}</div>
        <ul>
          {getDetails({...options, name: "Financial Decisions Detail"}).map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
