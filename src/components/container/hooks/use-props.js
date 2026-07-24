import {useEffect, useState} from "react";
import {useSetRecoilState} from "recoil";
import Cache from "lib/cache";
import slice from "lib/common/object/slice";
import GraphQL from "lib/graphql";
import Http from "lib/http";
import I18n from "lib/i18n";
import Listener from "lib/listener";
import {
  appendRequestIDState,
  baseState,
  cacheState,
  graphqlState,
  httpState,
  i18nState,
  listenerState,
  localeState,
  optionsState,
  requestIDState
} from "lib/recoil";
import {chainRequestID, generateWidgetID} from "lib/request-id";

const EMPTY_OPTIONS = {};

export default function useProps(props) {
  const setBase = useSetRecoilState(baseState);
  const setCache = useSetRecoilState(cacheState);
  const setGraphql = useSetRecoilState(graphqlState);
  const appendRequestID = useSetRecoilState(appendRequestIDState);
  const setHttp = useSetRecoilState(httpState);
  const setRequestID = useSetRecoilState(requestIDState);
  const setI18n = useSetRecoilState(i18nState);
  const setListener = useSetRecoilState(listenerState);
  const setLocale = useSetRecoilState(localeState);
  const setOptions = useSetRecoilState(optionsState);
  const [fallbackListener] = useState(() => new Listener());
  const listener = props.listener || fallbackListener;
  const {
    assessmentID,
    benchmarkID,
    locale,
    options = EMPTY_OPTIONS,
    orderID,
    packageID,
    profileID
  } = props;

  useEffect(() => {
    // NOTE: showInstructions should be true but we don't want a breaking change
    const surveyOptions = {showInstructions: false, ...(options.survey || {})};

    setOptions({showHeaders: false, showHelp: true, ...options, survey: surveyOptions});
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
    const http = props.http || new Http(slice(options, ["authKey", "host", "version"]));
    http.listener = listener;
    setHttp(http);
  }, [props.http, listener]);

  useEffect(() => {
    const widgetID = options.requestID || generateWidgetID();
    setRequestID(widgetID);

    return listener.on("Http.request", (request) => {
      const requestID = chainRequestID(widgetID);
      // NOTE: Defer updating state so it happens after the render
      queueMicrotask(() => appendRequestID(requestID));

      request.options.headers = {...request.options.headers, "X-Request-Id": requestID};
    });
  }, [listener]);

  useEffect(() => {
    setI18n(props.i18n || new I18n());
  }, [props.i18n]);

  useEffect(() => {
    setListener(listener);
  }, [listener]);

  useEffect(() => {
    const base = {};

    if(assessmentID) { base.assessmentID = assessmentID; }
    if(benchmarkID) { base.benchmarkID = benchmarkID; }
    if(orderID) { base.orderID = orderID; }
    if(packageID) { base.packageID = packageID; }
    if(profileID) { base.profileID = profileID; }

    setBase(base);
  }, [assessmentID, benchmarkID, orderID, packageID, profileID]);
}
