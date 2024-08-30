import PropTypes from "prop-types";
import {useEffect} from "react";
import {useRecoilState} from "recoil";
import loadFont from "lib/common/load-font";
import {loadingState} from "lib/recoil";
import useAssessmentEffect from "./hooks/use-assessment-effect";
import useAssessmentsEffect from "./hooks/use-assessments-effect";
import useBaseEffect from "./hooks/use-base-effect";
import useListenerEffect from "./hooks/use-listener-effect";
import useProps from "./hooks/use-props";
import useRecommendationEffect from "./hooks/use-recommendation-effect";

function State({children, ...props}) {
  const [loading, setLoading] = useRecoilState(loadingState);

  useProps(props);
  useAssessmentEffect();
  useAssessmentsEffect();
  useBaseEffect();
  useListenerEffect();
  useRecommendationEffect();
  useEffect(() => { loadFont(); }, []);
  useEffect(() => { setLoading(false); }, []);

  if(loading) { return null; }

  return children;
}

State.propTypes = {children: PropTypes.node.isRequired};

export default State;
