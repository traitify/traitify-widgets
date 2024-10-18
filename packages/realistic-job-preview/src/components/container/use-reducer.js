import {useReducer} from "react";
import slice from "traitify/lib/common/object/slice";
import useDidUpdate from "traitify/lib/hooks/use-did-update";
import Cache from "traitify/lib/cache";
import Http from "traitify/lib/http";
import I18n from "traitify/lib/i18n";
import Listener from "traitify/lib/listener";

const setInitialState = ({assessmentID, cache, http, i18n, listener, locale, options}) => ({
  assessmentID,
  cache: cache || new Cache({namespace: "rjp"}),
  http: http || new Http(slice(options, ["authKey", "host", "version"])),
  i18n: i18n || new I18n(),
  listener: listener || new Listener(),
  locale: locale || "en-us",
  options: options || {}
});

const reducer = (state, action) => {
  switch(action.type) {
    case "error":
      return {...state, error: action.error};
    case "updateAssessmentID":
      return {...state, assessmentID: action.assessmentID};
    case "updateCache":
      return {...state, assessmentID: action.cache};
    case "updateHttp":
      return {
        ...state,
        http: action.http || new Http(slice(action.options, ["authKey", "host", "version"]))
      };
    case "updateI18n":
      return {...state, i18n: action.i18n || new I18n()};
    case "updateListener":
      return {...state, listener: action.listener || new Listener()};
    case "updateLocale":
      return {...state, locale: action.locale};
    case "updateOptions":
      return {...state, options: action.options};
    default:
      throw new Error("Invalid Action");
  }
};

export default function useStateReducer({
  assessmentID,
  http,
  i18n,
  listener,
  locale,
  options
}) {
  const [state, dispatch] = useReducer(
    reducer,
    {assessmentID, http, i18n, listener, locale, options},
    setInitialState
  );

  useDidUpdate(() => {
    dispatch({assessmentID, type: "updateAssessmentID"});
  }, [assessmentID]);

  useDidUpdate(() => {
    dispatch({http, options, type: "updateHttp"});
  }, [http]);

  useDidUpdate(() => {
    dispatch({i18n, type: "updateI18n"});
  }, [i18n]);

  useDidUpdate(() => {
    dispatch({listener, type: "updateListener"});
  }, [listener]);

  useDidUpdate(() => {
    dispatch({locale, type: "updateLocale"});
  }, [locale]);

  useDidUpdate(() => {
    dispatch({options, type: "updateOptions"});
  }, [options]);

  return {dispatch, ...state};
}
