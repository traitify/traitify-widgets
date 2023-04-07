import useLoadedValue from "lib/hooks/use-loaded-value";
import {graphqlState} from "lib/recoil";

export default function useGraphql() {
  return useLoadedValue(graphqlState);
}
