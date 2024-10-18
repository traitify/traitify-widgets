import {useCallback, useEffect, useState} from "react";
import isObject from "traitify/lib/common/object/is-object";
import useCacheKey from "./use-cache-key";
import useWidgetContext from "./use-widget-context";

export default function useData({key: _key}) {
  const cacheKey = useCacheKey(isObject(_key) ? {..._key} : {skip: true});
  const key = `data.${_key || cacheKey}`;
  const {listener} = useWidgetContext();
  const [value, setValue] = useState(listener.value(key));
  const setter = useCallback((newValue) => {
    listener.trigger(key, newValue);
  }, [key]);

  useEffect(() => {
    const off = listener.on(key, (newValue) => setValue(newValue));

    return off;
  }, [key]);

  return [value, setter];
}
