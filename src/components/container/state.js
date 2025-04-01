import PropTypes from "prop-types";
import {useEffect} from "react";
import {useRecoilState} from "recoil";
import loadFont from "lib/common/load-font";
import {loadingState} from "lib/recoil";
import useAssessmentEffect from "./hooks/use-assessment-effect";
import useBaseEffect from "./hooks/use-base-effect";
import useListenerEffect from "./hooks/use-listener-effect";
import useOrderEffect from "./hooks/use-order-effect";
import useOrderPolling from "./hooks/use-order-polling";
import useProps from "./hooks/use-props";
import useRecommendationEffect from "./hooks/use-recommendation-effect";

function State({children, ...props}) {
  const [loading, setLoading] = useRecoilState(loadingState);

  useProps(props);
  useAssessmentEffect();
  useBaseEffect();
  useListenerEffect();
  useOrderEffect();
  useOrderPolling();
  useRecommendationEffect();
  useEffect(() => { loadFont(); }, []);
  useEffect(() => { setLoading(false); }, []);

  if(loading) { return null; }

  return children;
}

State.propTypes = {children: PropTypes.node.isRequired};

export default State;
