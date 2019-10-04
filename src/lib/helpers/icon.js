import {icon as getIcon} from "@fortawesome/fontawesome-svg-core";
import DangerousHTML from "lib/helpers/dangerous-html";

export default function Icon(_props) {
  const {icon: iconName, ...props} = _props;
  const html = getIcon(iconName).html[0];

  return <DangerousHTML html={html} tag="span" {...props} />;
}
