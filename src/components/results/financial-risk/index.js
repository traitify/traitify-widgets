import {useEffect} from "react";
import {useRecoilState} from "recoil";
import {optionsState} from "lib/recoil";
import useComponentEvents from "lib/hooks/use-component-events";
import Details from "./archetype/details";
import Heading from "./archetype/heading";
import ScoreBar from "./archetype/score-bar";
import Takeaways from "./archetype/takeaways";
import DimensionList from "./dimension/list";

export default function FinancialRisk() {
  const [options, setOptions] = useRecoilState(optionsState);

  useComponentEvents("FinancialRisk");
  useEffect(() => {
    if(options.perspective) { return; }

    setOptions({...options, perspective: "thirdPerson"});
  }, []);

  return (
    <section>
      <ScoreBar />
      <Heading />
      <Details />
      <Takeaways />
      <DimensionList />
    </section>
  );
}
