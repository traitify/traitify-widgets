import useCallback from "react";
import useI18n from "lib/hooks/use-i18n";

export default function useTranslate() {
  const i18n = useI18n();
  const translate = useCallback(i18n.translate, [i18n.locale]);

  return translate;
}
