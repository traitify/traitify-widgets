import {useMemo} from "react";
import Chart from "react-apexcharts";
import useCareer from "lib/hooks/use-career";
import useResults from "lib/hooks/use-results";
import style from "./style.scss";

export default function CareerModalChart() {
  const career = useCareer();
  const results = useResults();
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
      height: 300,
      options: {
        fill: {opacity: 0.7},
        xaxis: {categories: traits.map(({name}) => name)},
        yaxis: {max: 100, show: false}
      },
      series: [
        {data: traits.map((trait) => trait.career), name: `${career.title} Traits`},
        {data: traits.map((trait) => trait.assessment), name: "Your Traits"}
      ],
      type: "radar"
    };
  }, [career, results]);

  if(!options) { return null; }

  return (
    <div className={style.chartContainer}>
      <Chart {...options} />
    </div>
  );
}
