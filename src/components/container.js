/* eslint-disable react/forbid-prop-types */
import PropTypes from "prop-types";
import {useEffect} from "react";
import {RecoilRoot, useRecoilState, useSetRecoilState} from "recoil";
import slice from "lib/common/object/slice";
import Http from "lib/http";
import I18n from "lib/i18n";
import Listener from "lib/listener";
import {
  assessmentIDState,
  benchmarkIDState,
  httpState,
  i18nState,
  listenerState,
  loadingState,
  localeState,
  optionsState,
  profileIDState
} from "lib/recoil";

function State({children, http: _http, i18n: _i18n, listener: _listener, options}) {
  const setAssessmentID = useSetRecoilState(assessmentIDState);
  const setBenchmarkID = useSetRecoilState(benchmarkIDState);
  const setHttp = useSetRecoilState(httpState);
  const setI18n = useSetRecoilState(i18nState);
  const setListener = useSetRecoilState(listenerState);
  const setLocale = useSetRecoilState(localeState);
  const setOptions = useSetRecoilState(optionsState);
  const setProfileID = useSetRecoilState(profileIDState);
  const [loading, setLoading] = useRecoilState(loadingState);
  const {
    assessmentID,
    benchmarkID,
    locale,
    profileID,
    ...extraOptions
  } = options;

  useEffect(() => {
    setOptions(extraOptions);
  }, [options]);

  useEffect(() => {
    if(!locale) { return; }

    setLocale(locale);
  }, [locale]);

  useEffect(() => {
    const http = _http || new Http(slice(options, ["authKey", "host", "version"]));

    setHttp(http);
  }, [_http]);

  useEffect(() => {
    const i18n = _i18n || new I18n();

    setI18n(i18n);
  }, [_i18n]);

  useEffect(() => {
    const listener = _listener || new Listener();

    setListener(listener);
  }, [_listener]);

  useEffect(() => {
    setAssessmentID(assessmentID);
  }, [assessmentID]);

  useEffect(() => {
    setBenchmarkID(benchmarkID);
  }, [benchmarkID]);

  useEffect(() => {
    setProfileID(profileID);
  }, [profileID]);

  useEffect(() => {
    setLoading(false);
  }, []);

  if(loading) { return null; }

  return children;
}

State.defaultProps = {
  http: null,
  i18n: null,
  listener: null,
  options: {}
};
State.propTypes = {
  children: PropTypes.node.isRequired,
  http: PropTypes.object,
  i18n: PropTypes.object,
  listener: PropTypes.object,
  options: PropTypes.shape({
    assessmentID: PropTypes.string,
    benchmarkID: PropTypes.string,
    locale: PropTypes.string,
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
