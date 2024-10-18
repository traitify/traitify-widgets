import {useContext} from "react";
import Context from "lib/context";

export default function useWidgetContext() {
  return useContext(Context);
}
