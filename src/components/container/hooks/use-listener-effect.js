import {useEffect} from "react";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {listenerState, localeState} from "lib/recoil";

export default function useListenerEffect() {
  const listener = useRecoilValue(listenerState);
  const setLocale = useSetRecoilState(localeState);

  useEffect(() => {
    if(!listener) { return; }

    return listener.on("updateLocale", (value) => { setLocale(value); });
  }, [listener]);
}
