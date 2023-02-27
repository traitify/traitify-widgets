import {useMemo} from "react";

export default function useInlineMemo(calculate, dependencies) {
  return useMemo(() => calculate(...dependencies), dependencies);
}
