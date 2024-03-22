import DangerousHTML from "components/common/dangerous-html";
import {icon as getIcon} from "@fortawesome/fontawesome-svg-core";

export default function Icon(_props) {
  const {className: _class, icon: iconName, ...props} = _props;
  const className = [_class, "traitify--icon-fa"].filter(Boolean).join(" ");
  const html = getIcon(iconName).html[0];

  return <DangerousHTML className={className} html={html} tag="span" {...props} />;
}
