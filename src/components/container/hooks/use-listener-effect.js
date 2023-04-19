import {useEffect} from "react";
import {useRecoilCallback, useRecoilState, useResetRecoilState, useSetRecoilState} from "recoil";
import {
  activeState,
  assessmentsState,
  benchmarkIDState,
  cacheState,
  graphqlState,
  httpState,
  i18nState,
  listenerState,
  localeState,
  optionsState,
  packageIDState,
  profileIDState
} from "lib/recoil";
import split from "lib/common/object/split";

// TODO: Maybe just update this to allow changing the locale
export default function useListenerEffect() {
  const resetAssessments = useResetRecoilState(assessmentsState);
  const setActive = useSetRecoilState(activeState);
  const setBenchmarkID = useSetRecoilState(benchmarkIDState);
  const setCache = useSetRecoilState(cacheState);
  const setGraphql = useSetRecoilState(graphqlState);
  const setHttp = useSetRecoilState(httpState);
  const setI18n = useSetRecoilState(i18nState);
  const [listener, setListener] = useRecoilState(listenerState);
  const setLocale = useSetRecoilState(localeState);
  const setOptions = useSetRecoilState(optionsState);
  const setPackageID = useSetRecoilState(packageIDState);
  const setProfileID = useSetRecoilState(profileIDState);
  const getHttp = useRecoilCallback(({snapshot}) => {
    const loadable = snapshot.getLoadable(httpState);

    return loadable.valueMaybe();
  }, []);

  useEffect(() => {
    if(!listener) { return; }

    return listener.on("updateOptions", (_options) => {
      const [httpOptions, options] = split(_options, ["authKey", "host", "http", "version"]);
      const newOptions = {};
      let reset = false;

      if(Object.keys(httpOptions).length > 0) {
        if(httpOptions.hasOwn("http")) {
          const {http} = httpOptions;
          if(http) { httpOptions.filter((key) => key === "http").forEach((key) => { http[key] = httpOptions[key]; }); }
          setHttp(http);
        } else {
          const http = getHttp();
          httpOptions.forEach((key) => { http[key] = httpOptions[key]; });
        }
      }

      Object.keys(options).forEach((key) => {
        const value = options[key];

        switch(key) {
          case "assessmentID":
            setActive((active) => {
              const type = options.surveyType || active?.surveyType || "personality";

              return value ? {id: value, loading: true, type} : null;
            });
            break;
          case "benchmarkID":
            reset = true;
            setBenchmarkID(value);
            break;
          case "cache": setCache(value); break;
          case "graphql": setGraphql(value); break;
          case "i18n": setI18n(value); break;
          case "listener": setListener(value); break;
          case "locale": setLocale(value); break;
          case "packageID":
            reset = true;
            setPackageID(value);
            break;
          case "profileID":
            reset = true;
            setProfileID(value);
            break;
          default:
            newOptions[key] = value;
        }
      });

      setOptions((oldOptions) => ({...oldOptions, newOptions}));

      if(reset) { resetAssessments(); }
    });
  }, [listener]);
}
