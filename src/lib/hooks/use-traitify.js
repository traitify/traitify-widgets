import {useContext} from "react";
import Context from "lib/context/object";

export default function useTraitify() {
  return useContext(Context);
}
