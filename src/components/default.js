import {useRecoilValue} from "recoil";
import {activeState} from "lib/recoil";
import Results from "./results";
import Survey from "./survey";

export default function Default() {
  const active = useRecoilValue(activeState);

  if(!active) { return null; }
  if(active.completed) { return <Results />; }

  return <Survey />;
}
