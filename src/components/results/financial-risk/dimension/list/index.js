import useResults from "lib/hooks/use-results";
import Details from "../details";
import style from "./style.scss";

export default function FinancialRiskDimensionList() {
  const results = useResults();
  if(!results) { return null; }

  return (
    <div className={style.container}>
      {results.personality_types.map((type) => (
        <Details key={type.personality_type.id} type={type} />
      ))}
    </div>
  );
}
