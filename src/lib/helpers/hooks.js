import {useEffect, useRef} from "react";

export function useDidMount(run) {
  useEffect(() => run(), []);
}

export function useDidUpdate(run) {
  const mounted = useRef(false);

  useEffect(() => {
    if(mounted.current) {
      run();
    } else {
      mounted.current = true;
    }
  });
}
