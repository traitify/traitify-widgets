import {useLayoutEffect, useState} from "react";

export default function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

  useLayoutEffect(() => {
    const updateSize = () => setSize([window.innerWidth, window.innerHeight]);

    window.addEventListener("resize", updateSize);

    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;
}
