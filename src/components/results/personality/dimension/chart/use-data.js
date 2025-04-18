import {useMemo} from "react";
import {combine} from "lib/common/combine-data";
import capitalize from "lib/common/string/capitalize";
import useGuide from "lib/hooks/use-guide";
import useI18n from "lib/hooks/use-i18n";
import useLoadedValue from "lib/hooks/use-loaded-value";
import useResults from "lib/hooks/use-results";
import {localeState} from "lib/recoil";

const findByValue = (object, value) => Object.keys(object).find((key) => object[key] === value);

export default function PersonalityDimensionChart() {
  const guide = useGuide();
  const i18n = useI18n();
  const locale = useLoadedValue(localeState).toLowerCase();
  const results = useResults({surveyType: "personality"});

  return useMemo(() => {
    if(!results) { return; }

    const data = combine({guide, order: "types", types: results.personality_types});
    if(!data) { return; }

    const levels = i18n.data[locale].level;
    const fallbackLevels = i18n.data["en-us"].level;
    const columns = data.map((column) => {
      const level = column.type.level.trim();
      const value = findByValue(levels, level) || findByValue(fallbackLevels, level);

      return {...column, rank: {name: level, value}};
    });
    const ranks = ["other", "low", "medium", "high"].map((rank) => ({
      name: levels[rank] || capitalize(rank),
      value: rank
    }));

    return {columns, ranks};
  }, [guide, i18n, locale, results]);
}
