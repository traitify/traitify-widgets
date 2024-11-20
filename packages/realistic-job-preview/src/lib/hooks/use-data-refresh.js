import {useCallback} from "react";
import isObject from "traitify/lib/common/object/is-object";
import useCacheKey from "./use-cache-key";
import useWidgetContext from "./use-widget-context";

export default function useDataRefresh({key: _key}) {
  const cacheKey = useCacheKey(isObject(_key) ? {..._key} : {skip: true});
  const key = `refresh.${_key || cacheKey}`;
  const {listener} = useWidgetContext();

  return useCallback(() => {
    const value = listener.value(key) || 0;

    listener.trigger(key, value + 1);
  }, []);
}
