import {useEffect, useMemo} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import unique from "lib/common/array/unique";
import dig from "lib/common/object/dig";
import merge from "lib/common/object/merge";
import useAssessment from "lib/hooks/use-assessment";
import useSetting from "lib/hooks/use-setting";
import {initialOptionsState, optionsState, reportDisabledComponentsState} from "lib/recoil";

// NOTE: Pass in false for a component to override remote settings
export default function useDisabledComponentsEffect() {
  const [options, setOptions] = useRecoilState(optionsState);
  const assessment = useAssessment({surveyType: "personality"});
  const initialOptions = useRecoilValue(initialOptionsState) || {};
  const reportDisabled = useRecoilValue(reportDisabledComponentsState);
  const setting = useSetting("disabledComponents");

  const passed = initialOptions.disabledComponents;
  const scope = options.disabledComponentsScope || "widget";
  const report = assessment?.assessment_type === "TYPE_BASED" ? "attract" : options.report || "candidate";

  const disabledComponents = useMemo(() => {
    const overrides = Array.isArray(passed) ? {} : (passed || {});
    const source = merge(setting || {}, overrides);
    const scoped = {...dig(source, "all", report), ...dig(source, scope, report)};
    const resolved = Object.keys(scoped).filter((name) => scoped[name]);
    const base = Array.isArray(passed) ? passed : [];

    return unique([...base, ...resolved, ...reportDisabled]);
  }, [passed, report, reportDisabled, scope, setting]);

  useEffect(() => {
    setOptions((previous) => ({...previous, disabledComponents}));
  }, [disabledComponents]);
}
