import {useCallback} from "react";
import useWidgetContext from "./use-widget-context";

export default function useTranslate() {
  const {i18n, locale} = useWidgetContext();

  return useCallback((key, options) => (
    i18n.translate(locale, key, options)
  ), [i18n, locale]);
}
