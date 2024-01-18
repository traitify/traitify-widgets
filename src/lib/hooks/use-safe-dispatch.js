import {useCallback, useLayoutEffect, useRef} from "react";

export default function useSafeDispatch(unsafeDispatch) {
  const mounted = useRef(false);

  useLayoutEffect(() => {
    mounted.current = true;

    return () => { mounted.current = false; };
  }, []);

  return useCallback((...options) => {
    if(!mounted.current) { return; }

    unsafeDispatch(...options);
  }, [unsafeDispatch]);
}
