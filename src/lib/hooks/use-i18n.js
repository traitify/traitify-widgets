import {useEffect, useReducer} from "react";
import useLoadedValue from "lib/hooks/use-loaded-value";
import {i18nState, translationsQuery} from "lib/recoil";

export default function useI18n() {
  const i18n = useLoadedValue(i18nState);
  const translations = useLoadedValue(translationsQuery);
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    if(!i18n) { return; }
    if(!translations) { return; }

    Object.keys(translations).forEach((locale) => {
      i18n.addTranslations(locale.toLowerCase(), {data: translations[locale.toLowerCase()]});
    });

    forceUpdate();
  }, [i18n, translations]);

  return i18n;
}
