/* eslint-disable react/forbid-prop-types */
import PropTypes from "prop-types";
import {useEffect} from "react";
import {useRecoilState} from "recoil";
import loadFont from "lib/common/load-font";
import {loadingState} from "lib/recoil";
import useAssessmentEffect from "./hooks/use-assessment-effect";
import useAssessmentsEffect from "./hooks/use-assessments-effect";
import useListenerEffect from "./hooks/use-listener-effect";
import useProps from "./hooks/use-props";

function State({children, ...props}) {
  const [loading, setLoading] = useRecoilState(loadingState);

  useProps(props);
  useAssessmentEffect();
  useAssessmentsEffect();
  useListenerEffect();
  useEffect(() => { loadFont(); }, []);
  useEffect(() => { setLoading(false); }, []);

  if(loading) { return null; }

  return children;
}

State.defaultProps = {
  assessmentID: null,
  benchmarkID: null,
  cache: null,
  graphql: null,
  http: null,
  i18n: null,
  listener: null,
  locale: null,
  options: {},
  packageID: null,
  profileID: null
};
State.propTypes = {
  assessmentID: PropTypes.string,
  benchmarkID: PropTypes.string,
  cache: PropTypes.object,
  children: PropTypes.node.isRequired,
  graphql: PropTypes.object,
  http: PropTypes.object,
  i18n: PropTypes.object,
  listener: PropTypes.object,
  locale: PropTypes.string,
  options: PropTypes.object,
  packageID: PropTypes.string,
  profileID: PropTypes.string
};

export default State;
