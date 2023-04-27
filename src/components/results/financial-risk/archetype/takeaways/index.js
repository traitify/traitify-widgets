import {useMemo} from "react";
import getDetails from "lib/common/get-details";
import usePersonality from "lib/hooks/use-personality";
import style from "./style.scss";

export default function FinancialRiskTakeaways() {
  const personality = usePersonality();
  const takeaways = useMemo(() => {
    if(!personality) { return []; }

    return getDetails({name: "Takeaways", personality});
  });
  if(takeaways.length === 0) { return null; }

  return (
    <div className={style.container}>
      <div className={style.heading}>Key Takeaways of {personality.name} Financial Risk Style</div>
      <div className={style.takeaways}>
        {takeaways.map((takeaway) => <div key={takeaway}>{takeaway}</div>)}
      </div>
    </div>
  );
}
