import {useEffect} from "react";
import {useSetRecoilState} from "recoil";
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
  localeState,
  optionsState,
  profileIDState
} from "lib/recoil";

export default function useProps(props) {
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
  const {
    assessmentID,
    benchmarkID,
    locale,
    options = {},
    profileID
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
    setActive(assessmentID ? {id: assessmentID, loading: true, type: options.surveyType || "personality"} : null);
  }, [assessmentID, options.surveyType]);

  useEffect(() => { setBenchmarkID(benchmarkID); }, [benchmarkID]);

  useEffect(() => { setProfileID(profileID); }, [profileID]);
}
