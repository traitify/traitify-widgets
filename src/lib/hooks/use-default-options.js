import {useEffect} from "react";
import {useRecoilState} from "recoil";
import dig from "lib/common/object/dig";
import merge from "lib/common/object/merge";
import setPath from "lib/common/object/set-path";
import {optionsState} from "lib/recoil";

export default function useDefaultOptions(defaults) {
  const [options, setOptions] = useRecoilState(optionsState);

  useEffect(() => {
    const newOptions = {};

    Object.keys(defaults).forEach((path) => {
      const keys = path.split(".");
      const lastKey = keys.pop();
      const base = keys.length > 0 ? dig(options, keys) : options;
      if(base && Object.hasOwn(base, lastKey)) { return; }

      setPath(newOptions, path, defaults[path]);
    });

    if(Object.keys(newOptions).length === 0) { return; }

    setOptions((oldOptions) => merge(oldOptions, newOptions));
  }, [options]);
}
