import {useEffect} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {baseState, listenerState, localeState} from "lib/recoil";

export default function useListenerEffect() {
  const listener = useRecoilValue(listenerState);
  const setBase = useSetRecoilState(baseState);
  const setLocale = useSetRecoilState(localeState);

  useEffect(() => {
    if(!listener) { return; }

    const callbacks = [
      listener.on("updateBenchmarkID", (value) => {
        setBase((base) => ({...base, benchmarkID: value}));
      }),
      listener.on("updateLocale", (value) => { setLocale(value); })
    ];

    return () => callbacks.forEach((callback) => callback());
  }, [listener]);
}
