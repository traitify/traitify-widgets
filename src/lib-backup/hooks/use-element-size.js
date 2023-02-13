import {useLayoutEffect, useState} from "react";

export default function useElementSize(element) {
  const [size, setSize] = useState(() => (
    element ? [element.clientWidth, element.clientHeight] : [0, 0]
  ));

  useLayoutEffect(() => {
    const updateSize = () => {
      setSize(element ? [element.clientWidth, element.clientHeight] : [0, 0]);
    };

    window.addEventListener("resize", updateSize);

    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, [element]);

  return size;
}
