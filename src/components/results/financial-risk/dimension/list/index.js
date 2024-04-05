import useResults from "lib/hooks/use-results";
import style from "./style.scss";
import Details from "../details";

export default function FinancialRiskDimensionList() {
  const results = useResults({type: "personality"});
  if(!results) { return null; }

  return (
    <div className={style.container}>
      {results.personality_types.map((type) => (
        <Details key={type.personality_type.id} type={type} />
      ))}
    </div>
  );
}
