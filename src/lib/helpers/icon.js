import {icon as getIcon} from "@fortawesome/fontawesome-svg-core";

export default function Icon(_props){
  const {icon, ...props} = _props;

  return <span dangerouslySetInnerHTML={{__html: getIcon(icon).html[0]}} {...props} />;
}
