import {useMemo} from "react";
import useWidgetContext from "./use-widget-context";

export const getCacheKey = ({assessmentID, locale, scope, type}) => {
  const keys = scope ? [...scope] : [];
  if(!locale) { return null; }

  let id;

  switch(type) {
    case "assessment":
      id = assessmentID;
      break;
    default:
      id = assessmentID;
  }

  if(!id) { return null; }

  return ["v3", locale, type, id, ...keys].filter(Boolean).join(".").toLowerCase();
};

export default function useCacheKey({scope, skip = false, type}) {
  const {assessmentID, locale} = useWidgetContext();

  return useMemo(() => {
    if(skip) { return null; }

    return getCacheKey({assessmentID, locale, scope, type});
  }, [assessmentID, locale, scope, type]);
}
