import {useEffect} from "react";
import {useSetRecoilState} from "recoil";
import useOrganizationSettings from "lib/hooks/use-organization-settings";
import {optionsState} from "lib/recoil";

export default function useOrganizationEffect() {
  // TODO: Remove once organization settings are ready
  if(true) { return true; }

  const settings = useOrganizationSettings();
  const setOptions = useSetRecoilState(optionsState);

  useEffect(() => {
    if(!settings) { return; }

    console.log(settings);
    false && setOptions();
  }, [settings]);
}
