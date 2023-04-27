import {useEffect} from "react";
import {useResetRecoilState, useSetRecoilState} from "recoil";
import slice from "lib/common/object/slice";
import Cache from "lib/cache";
import GraphQL from "lib/graphql";
import useDidUpdate from "lib/hooks/use-did-update";
import Http from "lib/http";
import I18n from "lib/i18n";
import Listener from "lib/listener";
import {
  activeState,
  assessmentsState,
  benchmarkIDState,
  cacheState,
  graphqlState,
  httpState,
  i18nState,
  listenerState,
  localeState,
  optionsState,
  packageIDState,
  profileIDState
} from "lib/recoil";

export default function useProps(props) {
  const resetAssessments = useResetRecoilState(assessmentsState);
  const setActive = useSetRecoilState(activeState);
  const setBenchmarkID = useSetRecoilState(benchmarkIDState);
  const setCache = useSetRecoilState(cacheState);
  const setGraphql = useSetRecoilState(graphqlState);
  const setHttp = useSetRecoilState(httpState);
  const setI18n = useSetRecoilState(i18nState);
  const setListener = useSetRecoilState(listenerState);
  const setLocale = useSetRecoilState(localeState);
  const setOptions = useSetRecoilState(optionsState);
  const setPackageID = useSetRecoilState(packageIDState);
  const setProfileID = useSetRecoilState(profileIDState);
  const {
    assessmentID,
    benchmarkID,
    locale,
    options = {},
    packageID,
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
    setCache(props.cache || new Cache());
  }, [props.cache]);

  useEffect(() => {
    setHttp(props.http || new Http(slice(options, ["authKey", "host", "version"])));
  }, [props.http]);

  useEffect(() => {
    setI18n(props.i18n || new I18n());
  }, [props.i18n]);

  useEffect(() => {
    setListener(props.listener || new Listener());
  }, [props.listener]);

  useEffect(() => {
    setActive(assessmentID ? {id: assessmentID, loading: true, type: options.surveyType || "personality"} : null);
  }, [assessmentID, options.surveyType]);

  useEffect(() => { setBenchmarkID(benchmarkID); }, [benchmarkID]);
  useEffect(() => { setPackageID(packageID); }, [packageID]);
  useEffect(() => { setProfileID(profileID); }, [profileID]);
  useDidUpdate(() => { resetAssessments(); }, [benchmarkID, packageID, profileID]);
}
