import {useEffect, useRef} from "react";

export default function useDidUpdate(run, conditions = null) {
  const mounted = useRef(false);

  useEffect(() => {
    if(mounted.current) {
      run();
    } else {
      mounted.current = true;
    }
  }, conditions);
}
