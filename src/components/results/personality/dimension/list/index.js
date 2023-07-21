import PersonalityDimensionChart from "components/results/personality/dimension/chart";
import PersonalityDimensionDetails from "components/results/personality/dimension/details";
import sortByTypePosition from "lib/common/sort-by-type-position";
import useComponentEvents from "lib/hooks/use-component-events";
import useDisabledComponent from "lib/hooks/use-disabled-component";
import useOption from "lib/hooks/use-option";
import useResults from "lib/hooks/use-results";
import useTranslate from "lib/hooks/use-translate";
import style from "./style.scss";

export default function PersonalityDimensionList() {
  const disableChart = useDisabledComponent("PersonalityDimensionChart");
  const disableDetails = useDisabledComponent("PersonalityDimensionDetails");
  const showHeaders = useOption("showHeaders");
  const results = useResults({type: "personality"});
  const translate = useTranslate();

  useComponentEvents("PersonalityDimensions");

  if(!results) { return null; }
  if(disableChart && disableDetails) { return null; }

  const types = sortByTypePosition(results.personality_types);

  return (
    <div className={style.container}>
      {showHeaders && <div className={style.sectionHeading}>{translate("personality_breakdown")}</div>}
      {!disableChart && <PersonalityDimensionChart />}
      {!disableDetails && (
        <div>
          {types.map((type) => (
            <PersonalityDimensionDetails key={type.personality_type.id} type={type} />
          ))}
        </div>
      )}
    </div>
  );
}
