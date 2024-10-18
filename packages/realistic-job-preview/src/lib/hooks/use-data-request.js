import {useEffect, useState} from "react";
import isObject from "traitify/lib/common/object/is-object";
import useDidUpdate from "traitify/lib/hooks/use-did-update";
import useCacheKey from "./use-cache-key";
import useWidgetContext from "./use-widget-context";

export default function useDataRequest({key: _key, request}) {
  const cacheKey = useCacheKey(isObject(_key) ? {..._key} : {skip: true});
  const key = `request.${_key || cacheKey}`;
  const refreshKey = `refresh.${_key || cacheKey}`;
  const {listener} = useWidgetContext();
  const [refresh, setRefresh] = useState(listener.value(refreshKey));
  const [value, setValue] = useState(listener.value(key));

  const startRequest = () => {
    const requestingKey = `requesting.${_key}`;
    if(listener.value(requestingKey)) { return; }

    listener.trigger(requestingKey, true);
    request().then((newValue) => {
      listener.trigger(key, newValue);
      listener.trigger(requestingKey, false);
    });
  };

  useDidUpdate(() => { startRequest(); }, [refresh]);
  useEffect(() => {
    if(value) { return; }

    startRequest();
  }, [key]);

  useEffect(() => {
    const off = listener.on(key, (newValue) => setValue(newValue));
    const offRefresh = listener.on(refreshKey, (newValue) => setRefresh(newValue));

    return () => {
      off();
      offRefresh();
    };
  }, [key]);

  return value;
}
