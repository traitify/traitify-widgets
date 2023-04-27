import {useMemo} from "react";
import getDetail from "lib/common/get-detail";
import usePersonality from "lib/hooks/use-personality";
import style from "./style.scss";

export default function FinancialRiskScoreBar() {
  const personality = usePersonality();
  const risk = useMemo(() => {
    if(!personality) { return null; }

    switch(getDetail({name: "risk_level", personality})) {
      case "conservative":
        return "10%";
      case "measured":
        return "30%";
      case "neutral":
        return "50%";
      case "receptive":
        return "70%";
      case "aggressive":
        return "90%";
      default:
        return "0%";
    }
  });

  if(!risk) { return null; }

  return (
    <div className={style.container}>
      <div className={style.range}>
        <div className={style.low} />
        <div className={style.lowMedium} />
        <div className={style.medium} />
        <div className={style.mediumHigh} />
        <div className={style.high} />
      </div>
      <div className={style.indicators}>
        <div className={style.low} />
        <div className={style.risk} style={{left: risk}} />
        <div className={style.high} />
      </div>
    </div>
  );
}
