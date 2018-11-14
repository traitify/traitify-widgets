import {icon as getIcon} from "@fortawesome/fontawesome-svg-core";
import {dangerousProps} from "lib/helpers";

export default function Icon(_props) {
  const {icon: iconName, ...props} = _props;
  const iconHTML = getIcon(iconName).html[0];

  return <span {...dangerousProps({html: iconHTML})} {...props} />;
}
