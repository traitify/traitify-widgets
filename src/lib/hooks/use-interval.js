import {useEffect, useRef} from "react";

export default function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if(delay == null) { return; }

    const tick = () => { savedCallback.current(); };
    const id = setInterval(tick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
