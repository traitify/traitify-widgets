import {useEffect} from "react";
import {useSetRecoilState} from "recoil";
import Cache from "lib/cache";
import slice from "lib/common/object/slice";
import GraphQL from "lib/graphql";
import Http from "lib/http";
import I18n from "lib/i18n";
import Listener from "lib/listener";
import {
  baseState,
  cacheState,
  graphqlState,
  httpState,
  i18nState,
  listenerState,
  localeState,
  optionsState
} from "lib/recoil";

export default function useProps(props) {
  const setBase = useSetRecoilState(baseState);
  const setCache = useSetRecoilState(cacheState);
  const setGraphql = useSetRecoilState(graphqlState);
  const setHttp = useSetRecoilState(httpState);
  const setI18n = useSetRecoilState(i18nState);
  const setListener = useSetRecoilState(listenerState);
  const setLocale = useSetRecoilState(localeState);
  const setOptions = useSetRecoilState(optionsState);
  const {
    assessmentID,
    benchmarkID,
    locale,
    options = {},
    orderID,
    packageID,
    profileID,
    surveyID
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
    const base = {};

    if(assessmentID) { base.assessmentID = assessmentID; }
    if(benchmarkID) { base.benchmarkID = benchmarkID; }
    if(orderID) { base.orderID = orderID; }
    if(packageID) { base.packageID = packageID; }
    if(profileID) { base.profileID = profileID; }
    if(surveyID) { base.surveyID = surveyID; }

    setBase(base);
  }, [assessmentID, benchmarkID, orderID, packageID, profileID, surveyID]);
}
