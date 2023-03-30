/* eslint-disable react/forbid-prop-types */
import PropTypes from "prop-types";
import {useEffect} from "react";
import {useRecoilState, useSetRecoilState} from "recoil";
import slice from "lib/common/object/slice";
import Cache from "lib/cache";
import Http from "lib/http";
import I18n from "lib/i18n";
import GraphQL from "lib/graphql";
import Listener from "lib/listener";
import {
  activeState,
  benchmarkIDState,
  cacheState,
  graphqlState,
  httpState,
  i18nState,
  listenerState,
  loadingState,
  localeState,
  optionsState,
  profileIDState
} from "lib/recoil";

function State({children, ...props}) {
  const setActive = useSetRecoilState(activeState);
  const setBenchmarkID = useSetRecoilState(benchmarkIDState);
  const setCache = useSetRecoilState(cacheState);
  const setGraphql = useSetRecoilState(graphqlState);
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
    options = {},
    profileID,
    testID
  } = props;

  useEffect(() => {
    setOptions({showHeaders: false, showInstructions: true, ...options});
  }, [options]);

  useEffect(() => {
    if(!locale) { return; }

    setLocale(locale);
  }, [locale]);

  useEffect(() => {
    setGraphql(props.graphql || GraphQL);
  }, [props.graphql]);

  useEffect(() => {
    const cache = props.cache || new Cache();

    setCache(cache);
  }, [props.cache]);

  useEffect(() => {
    const http = props.http || new Http(slice(props, ["authKey", "host", "version"]));

    setHttp(http);
  }, [props.http]);

  useEffect(() => {
    const i18n = props.i18n || new I18n();

    setI18n(i18n);
  }, [props.i18n]);

  useEffect(() => {
    const listener = props.listener || new Listener();

    setListener(listener);
  }, [props.listener]);

  useEffect(() => {
    const id = assessmentID || testID;

    setActive(id ? {id, type: options.surveyType || "personality"} : null);
  }, [assessmentID, options.surveyType, testID]);

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
  assessmentID: null,
  benchmarkID: null,
  cache: null,
  graphql: null,
  http: null,
  i18n: null,
  listener: null,
  locale: null,
  options: {},
  profileID: null,
  testID: null
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
  profileID: PropTypes.string,
  testID: PropTypes.string
};

export default State;
