import useLoadedValue from "lib/hooks/use-loaded-value";
import {organizationSettingsQuery} from "lib/recoil";

export default function useOrganizationSettings() {
  return useLoadedValue(organizationSettingsQuery);
}
