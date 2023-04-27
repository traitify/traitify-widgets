import {useCallback} from "react";
import useI18n from "lib/hooks/use-i18n";
import useLoadedValue from "lib/hooks/use-loaded-value";
import {localeState} from "lib/recoil";

export default function useTranslate() {
  const i18n = useI18n();
  const locale = useLoadedValue(localeState);

  return useCallback((key, options) => (
    i18n.translate(locale, key, options)
  ), [i18n, locale]);
}
