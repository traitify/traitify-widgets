import {useCallback, useMemo} from "react";
import Canvas from "components/common/canvas";
import CanvasRadarChart from "lib/common/canvas/radar-chart";
import useCareer from "lib/hooks/use-career";
import useResults from "lib/hooks/use-results";
import style from "./style.scss";

export default function CareerModalChart() {
  const career = useCareer();
  const results = useResults({surveyType: "personality"});
  const setup = useCallback((element, options) => new CanvasRadarChart(element.getContext("2d"), options), []);
  const options = useMemo(() => {
    if(!career) { return; }
    if(!results) { return; }

    const traits = career.personality_traits
      .filter(({personality_trait: trait}) => trait)
      .map(({personality_trait: {id, name}, weight}, index) => {
        const trait = results.personality_traits.find((t) => id === t.personality_trait.id);
        if(!trait) { return; }

        return {
          assessment: Math.round((trait.score + 100) / 2),
          career: weight,
          name: name || `Trait ${index + 1}`
        };
      }).filter(Boolean).sort((a, b) => ((a.name > b.name) ? 1 : -1));

    return {
      data: [
        {
          color: "--private-traitify-auxiliary",
          fill: true,
          fillOpacity: 0.75,
          name: `${career.title} Traits`,
          values: traits.map((trait) => trait.career)
        },
        {
          color: "--private-traitify-theme",
          fill: true,
          fillOpacity: 0.75,
          name: "Your Traits",
          values: traits.map((trait) => trait.assessment)
        }
      ],
      grid: {innerLines: 9, labels: {show: false}, max: 100},
      labels: traits.map(({name}) => ({text: name}))
    };
  }, [career, results]);

  if(!options) { return null; }

  return (
    <div className={style.chartContainer}>
      <Canvas height="300" width="300" options={options} setup={setup} />
    </div>
  );
}
