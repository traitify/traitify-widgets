import {useEffect, useLayoutEffect, useRef, useState} from "react";

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

export function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

  useLayoutEffect(() => {
    const updateSize = () => setSize([window.innerWidth, window.innerHeight]);

    window.addEventListener("resize", updateSize);

    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
}
