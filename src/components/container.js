/* eslint-disable react/forbid-prop-types */
import PropTypes from "prop-types";
import {useEffect} from "react";
import {RecoilRoot, useRecoilState, useSetRecoilState} from "recoil";
import slice from "lib/common/object/slice";
import Http from "lib/http";
import Listener from "lib/listener";
import {
  assessmentIDState,
  benchmarkIDState,
  httpState,
  listenerState,
  loadingState,
  optionsState,
  profileIDState
} from "lib/recoil";

function State({children, http: _http, listener: _listener, options}) {
  const setAssessmentID = useSetRecoilState(assessmentIDState);
  const setHttp = useSetRecoilState(httpState);
  const setListener = useSetRecoilState(listenerState);
  const setBenchmarkID = useSetRecoilState(benchmarkIDState);
  const setOptions = useSetRecoilState(optionsState);
  const setProfileID = useSetRecoilState(profileIDState);
  const [loading, setLoading] = useRecoilState(loadingState);

  useEffect(() => {
    setOptions(options);
  }, [options]);

  useEffect(() => {
    const http = _http || new Http(slice(options, ["authKey", "host", "version"]));

    setHttp(http);
  }, [_http]);

  useEffect(() => {
    const listener = _listener || new Listener();

    setListener(listener);
  }, [_listener]);

  useEffect(() => {
    const {assessmentID} = options;

    setAssessmentID(assessmentID);
  }, [options.assessmentID]);

  useEffect(() => {
    const {benchmarkID} = options;

    setBenchmarkID(benchmarkID);
  }, [options.benchmarkID]);

  useEffect(() => {
    const {profileID} = options;

    setProfileID(profileID);
  }, [options.profileID]);

  useEffect(() => {
    setLoading(false);
  }, []);

  if(loading) { return null; }

  return children;
}

State.defaultProps = {
  http: null,
  listener: null,
  options: {}
};
State.propTypes = {
  children: PropTypes.node.isRequired,
  http: PropTypes.object,
  listener: PropTypes.object,
  options: PropTypes.shape({
    assessmentID: PropTypes.string,
    benchmarkID: PropTypes.string,
    profileID: PropTypes.string
  })
};

export default function Container(props) {
  return (
    <RecoilRoot>
      <State {...props} />
    </RecoilRoot>
  );
}
