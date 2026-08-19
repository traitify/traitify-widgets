/* eslint-disable no-console, no-use-before-define */
/* global Traitify */
Traitify.http.authKey = "sptoechv411aqbqrp4l9a4eg2a";
Traitify.http.host = "https://api.traitify.com";

const allTargets = {
  "Personality.Archetype.Heading": "#target-1",
  "Personality.Archetype.Skills": "#target-2",
  "Personality.Archetype.Tips": "#target-3",
  "Personality.Base.Details": "#target-5",
  "Personality.Base.Heading": "#target-4",
  "Personality.Career.Container": "#target-6",
  // "Personality.Career.Details": "#default",
  // "Personality.Career.Filter": "#default",
  // "Personality.Career.List": "#default",
  // "Personality.Career.Modal": "#default",
  // "Personality.Dimension.Chart": "#default"
  // "Personality.Dimension.Details": {props: {type: {}}, target: "#default"},
  "Personality.Dimension.List": "#target-7",
  "Personality.Recommendation.Chart": "#target-8",
  // "Personality.Trait.Details": {props: {type: {}}, target: "#default"},
  "Personality.Trait.List": "#target-9",
  "Personality.Type.Chart": "#target-10",
  "Personality.Type.List": "#target-11",
  "Report.Attract": "#target-12",
  "Report.Candidate": "#target-13",
  "Report.Employee": "#target-14",
  "Report.Manager": "#target-15"
};

const booleanOptions = [
  {text: "Default", value: ""},
  {text: "Yes", value: "true"},
  {text: "No", value: "false"}
];
const cache = {
  get: (name, opts) => cacheFor(name).get(name, opts),
  remove: (name) => cacheFor(name).remove(name),
  set: (name, value, opts) => cacheFor(name).set(name, value, opts)
};
const cacheTTL = 3 * 60 * 60;
const envScopedKeys = [
  "assessmentID",
  "benchmarkID",
  "cognitiveSurveyID",
  "externalSurveyID",
  "externalVendor",
  "genericSurveyID",
  "orderID",
  "packageID",
  "profileID",
  "rjpSurveyID"
];
const globalCache = new Traitify.Cache({storage: localStorage});
const listCacheKeys = {};
const personalitySurveys = (window.TraitifyDemo || {}).personalitySurveys || [
  {text: "Big Five", value: "big-five"},
  {text: "Big Five Animated", value: "big-five-animated"},
  {text: "Big Five Animated Paradox", value: "big-five-animated-paradox"},
  {text: "Big Five Text", value: "big-five-text"},
  {text: "Career Deck", value: "career-deck"},
  {text: "Career Interest Animated", value: "career-interest-animated"},
  {text: "Core", value: "core"},
  {text: "Financial Risk Tolerance", value: "financial-risk-tolerance-2.0"},
  {text: "Perseverance", value: "perseverance"},
  {text: "Persuasion", value: "persuasion"}
];
const surveyTypes = ["benchmark", "cognitive", "external", "generic", "order", "personality", "rjp"];
let envCache = newEnvCache();

function booleanFrom(value, fallback) {
  if(value === "true") { return true; }
  if(value === "false") { return false; }
  if(value === true) { return true; }
  if(value === false) { return false; }
  if(fallback === undefined) { return false; }

  return fallback;
}

function cacheFor(name) {
  return envScopedKeys.includes(name) ? envCache : globalCache;
}

function clearListCache() {
  Object.keys(listCacheKeys).forEach((key) => cache.remove(key));
  setupLists();
}

function createAssessment({mode = "create"} = {}) {
  destroyWidget();

  switch(cache.get("surveyType")) {
    case "benchmark":
    case "order":
      return createWidget();
    case "cognitive": return createCognitiveAssessment({mode});
    case "external": return createExternalAssessment({mode});
    case "generic": return createGenericAssessment();
    case "rjp": return createRJPAssessment({mode});
    default: return createPersonalityAssessment({mode});
  }
}

function createCognitiveAssessment({mode}) {
  const cacheKey = `assessmentID.${cache.get("cognitiveSurveyID")}`;
  const load = mode === "load" && !!envCache.get(cacheKey);
  const query = Traitify.GraphQL.cognitive[load ? "get" : "create"];
  const variables = load ? {
    localeKey: cache.get("locale"),
    testID: envCache.get(cacheKey)
  } : {
    localeKey: cache.get("locale"),
    surveyID: cache.get("cognitiveSurveyID")
  };

  return saveAssessmentID({
    cacheKey,
    fetcher: () => Traitify.http.post(Traitify.GraphQL.cognitive.path, {query, variables})
      .then((response) => response.data[load ? "cognitiveTest" : "createCognitiveTest"].id)
  });
}

function createElement(options = {}) {
  const {className, id, onClick, onChange, tag, text, ...attributes} = options;
  const element = document.createElement(tag || "div");

  if(className) { element.className = className; }
  if(id) { element.id = id; }
  if(onClick) { element.addEventListener("click", onClick); }
  if(onChange) { element.addEventListener("change", onChange); }
  if(text) { element.appendChild(document.createTextNode(text)); }

  Object.keys(attributes).forEach((key) => {
    const value = attributes[key];

    if(value) { element.setAttribute(key, value); }
  });

  return element;
}

function createExternalAssessment({mode}) {
  const create = mode === "create";
  const cacheKey = `assessmentID.${cache.get("externalSurveyID")}`;
  const query = Traitify.GraphQL.external[create ? "create" : "getOrCreate"];
  const variables = create ? {
    externalSurveyKey: cache.get("externalSurveyID"),
    profileID: cache.get("profileID"),
    vendor: cache.get("externalVendor")
  } : {
    profileID: cache.get("profileID"),
    surveyKey: cache.get("externalSurveyID")
  };

  return saveAssessmentID({
    cacheKey,
    fetcher: () => Traitify.http.post({
      params: {query, variables},
      path: Traitify.GraphQL.external.path,
      version: Traitify.GraphQL.external.version
    }).then((response) => response.data[create ? "createAssessment" : "getOrCreateAssessment"].id)
  });
}

function createGenericAssessment() {
  const cacheKey = `assessmentID.${cache.get("genericSurveyID")}`;
  const query = Traitify.GraphQL.generic.create;
  const variables = {
    profileID: cache.get("profileID"),
    surveyID: cache.get("genericSurveyID")
  };

  return saveAssessmentID({
    cacheKey,
    fetcher: () => Traitify.http.post(Traitify.GraphQL.generic.path, {query, variables})
      .then((response) => response.data.getOrCreateAssessment.id)
  });
}

function createOption({fallback, name, onChange: _onChange, options, text, type}) {
  const element = createElement({className: "row", htmlFor: name, id: `${name}-option`, tag: "label", text});
  const onChange = _onChange || onInputChange;

  if(type === "combo") {
    const stored = cache.get(name, {fallback});
    const input = createElement({id: name, name, onChange, tag: "input", type: "text", value: stored});
    const select = createElement({tag: "select"});

    select.appendChild(createElement({tag: "option", text: "Select", value: ""}));
    (options || []).forEach(({text: optionText, value}) => {
      select.appendChild(createElement({selected: value === stored, tag: "option", text: optionText, value}));
    });
    select.addEventListener("change", (e) => {
      if(!e.target.value) { return; }

      input.value = e.target.value;
      cache.set(name, e.target.value);
    });

    element.appendChild(input);
    element.appendChild(select);
  } else if(options) {
    const select = createElement({id: name, name, onChange, tag: "select"});
    let selected = cache.get(name, {fallback});
    if(!selected && options[0]) {
      onChange({target: {name, type: "select", value: options[0].value}});

      selected = cache.get(name, {fallback});
    }

    options.forEach(({text: optionText, value}) => {
      select.appendChild(createElement({selected: selected === value, tag: "option", text: optionText, value}));
    });

    element.appendChild(select);
  } else {
    const input = createElement({
      id: name,
      name,
      onChange,
      tag: "input",
      type: type || "text",
      value: cache.get(name, {fallback})
    });

    element.appendChild(input);
  }

  return element;
}

function createPersonalityAssessment({mode}) {
  const cacheKey = `assessmentID.${cache.get("personalitySurveyID")}`;

  if(mode === "load" && envCache.get(cacheKey)) {
    return saveAssessmentID({cacheKey, fetcher: () => Promise.resolve(envCache.get(cacheKey))});
  }

  const customParams = JSON.parse(cache.get("params", {fallback: "{}"}));
  const params = {
    deck_id: cache.get("personalitySurveyID"),
    locale_key: cache.get("locale")
  };

  Object.keys(customParams).filter((key) => customParams[key])
    .forEach((key) => { params[key] = customParams[key]; });

  return saveAssessmentID({
    cacheKey,
    fetcher: () => Traitify.http.post("/assessments", params).then((assessment) => assessment.id)
  });
}

function createRJPAssessment({mode}) {
  const cacheKey = `assessmentID.${cache.get("rjpSurveyID")}`;
  const load = mode === "load" && !!envCache.get(cacheKey);
  const query = Traitify.GraphQL.rjp[load ? "get" : "create"];
  const variables = load ? {
    id: envCache.get(cacheKey)
  } : {
    localeKey: cache.get("locale"),
    profileID: cache.get("profileID"),
    surveyID: cache.get("rjpSurveyID")
  };

  return saveAssessmentID({
    cacheKey,
    fetcher: () => Traitify.http.post(Traitify.GraphQL.rjp.path, {query, variables})
      .then((response) => response.data[load ? "getAssessment" : "createAssessment"].id)
  });
}

function createWidget() {
  const surveyType = cache.get("surveyType");
  const targets = {Default: "#default"};

  if(surveyType === "benchmark") {
    const benchmarkID = cache.get("benchmarkID");
    const packageID = cache.get("packageID");
    const profileID = cache.get("profileID");
    console.log("createWidget", {benchmarkID, packageID, profileID});
    if(!benchmarkID && !packageID) { return; }
    if(!profileID) { return; }

    Traitify.options.benchmarkID = benchmarkID;
    Traitify.options.packageID = packageID;
    Traitify.options.profileID = profileID;
  } else if(surveyType === "order") {
    const orderID = cache.get("orderID");
    console.log("createWidget", {orderID});
    if(!orderID) { return; }
    Traitify.options.orderID = orderID;
  } else {
    const assessmentID = cache.get("assessmentID");
    console.log("createWidget", {assessmentID});
    if(!assessmentID) { return; }

    Traitify.options.assessmentID = assessmentID;
    Traitify.options.surveyType = surveyType;

    if(cache.get("personalitySurveyID")?.includes("career")) {
      targets.Career = "#target-1";

      Traitify.options.career = {
        experienceLevels: [3, 4, 5],
        jobs: {
          inline: true,
          // path: "/asdf",
          source: "Indeed"
        }
      };
    }
  }

  Traitify.options.colorScheme = cache.get("colorScheme");
  Traitify.options.locale = cache.get("locale");
  Traitify.options.perspective = cache.get("perspective");
  Traitify.options.report = cache.get("report");
  ["imagekit", "showHeaders", "showHelp"].forEach((key) => {
    const value = booleanFrom(cache.get(key), "default");

    if(value !== "default") { Traitify.options[key] = value; }
  });
  Traitify.options.showRecommendationList = true;
  Traitify.options.showTraitList = true;
  Traitify.options.survey = {};
  ["allowBack", "allowFullscreen", "showInstructions"].forEach((key) => {
    const value = booleanFrom(cache.get(`survey.${key}`), "default");

    if(value !== "default") { Traitify.options.survey[key] = value; }
  });
  Traitify.options.survey.captureLearningDisability = true;
  Traitify.options.survey.disableTimeLimit = true;
  Traitify.options.survey.initialLearningDisability = true;
  Traitify.render(targets).then(() => {
    console.log("Rendered");
  }).catch((error) => {
    console.log(error);
  });
}

function destroyWidget() {
  Traitify.destroy();
  ["assessmentID", "benchmarkID", "orderID", "packageID", "profileID", "surveyType"].forEach((key) => {
    delete Traitify.options[key];
  });
}

function getCacheKey(key) {
  return `${cache.get("environment", {fallback: "production"})}.${key}`;
}

function loadExternalSurveys(vendor) {
  if(!vendor) { return; }

  const query = Traitify.GraphQL.external.surveys;
  loadOrFetch({
    key: `external-surveys.${vendor}`,
    fetcher: () => Traitify.http.post({
      params: {query, variables: {vendor}},
      path: Traitify.GraphQL.external.path,
      version: Traitify.GraphQL.external.version
    }).then((response) => (
      (response.data.listSurveys || [])
        .map(({surveyKey, surveyName}) => ({text: surveyName, value: surveyKey}))
        .sort((a, b) => a.text.localeCompare(b.text))
    ))
  }).then((options) => {
    if(!options) { return; }
    if(!options.find(({value}) => value === cache.get("externalSurveyID"))) {
      cache.set("externalSurveyID", null);
    }

    updateOption({name: "externalSurveyID", options});
  });
}

function loadOrFetch({key, fetcher}) {
  const cacheKey = getCacheKey(key);
  const cached = cache.get(cacheKey);
  listCacheKeys[cacheKey] = true;
  if(cached) { return Promise.resolve(cached); }

  return fetcher().then((value) => {
    if(value && (!Array.isArray(value) || value.length > 0)) {
      cache.set(cacheKey, value, {expiresIn: cacheTTL});
    }

    return value;
  }).catch((error) => {
    console.warn(key, error);

    return null;
  });
}

function migrateCache() {
  if(cache.get("cache-migrated")) { return; }

  Object.keys(localStorage).forEach((key) => {
    const raw = localStorage.getItem(key);

    let parsed;
    try { parsed = JSON.parse(raw); } catch { parsed = undefined; }
    if(parsed && typeof parsed === "object" && "value" in parsed) { return; }

    localStorage.setItem(key, JSON.stringify({value: raw}));
  });

  envCache = newEnvCache();
  envScopedKeys.forEach((key) => {
    const value = globalCache.get(key);
    if(value == null) { return; }

    envCache.set(key, value);
    globalCache.remove(key);
  });

  const deck = globalCache.get("deckID");
  if(deck != null) {
    globalCache.set("personalitySurveyID", deck);
    globalCache.remove("deckID");
  }

  cache.set("cache-migrated", true);
}

function newEnvCache() {
  return new Traitify.Cache({namespace: globalCache.get("environment", {fallback: "production"}), storage: localStorage});
}

function onEnvironmentChange(e) {
  onInputChange(e);
  envCache = newEnvCache();
  setupTraitify();
  setupEnv();
}

function onExternalVendorChange(e) {
  onInputChange(e);
  loadExternalSurveys(e.target.value);
}

function onInputChange(e) {
  const {name} = e.target;
  const value = e.target.type === "checkbox" ? booleanFrom(e.target.checked) : e.target.value;

  cache.set(name, value);
}

function onSurveyIDChange(e) {
  onInputChange(e);
  syncAssessmentID();
}

function onSurveyTypeChange(e) {
  onInputChange(e);
  showSurveyOptions(e.target.value);
  syncAssessmentID();
  updateButtons();
}

function saveAssessmentID({cacheKey, fetcher}) {
  return fetcher().then((id) => {
    if(id) { envCache.set(cacheKey, id); }
    syncAssessmentID();
  }).catch((error) => {
    console.log(error);
  }).finally(() => setTimeout(createWidget, 500));
}

function setupBenchmarks() {
  loadOrFetch({
    key: "benchmarks",
    fetcher: () => Traitify.http.get("/assessments/recommendations", {per_page: 500, permission: "scorable"}).then((benchmarks) => {
      if(!Array.isArray(benchmarks)) { return null; }

      return benchmarks
        .map(({id, name}) => ({text: name, value: id}))
        .sort((a, b) => a.text.localeCompare(b.text));
    })
  }).then((options) => {
    if(!options) { return; }

    updateOption({name: "benchmarkID", options});
  });
}

function setupCognitive() {
  const query = Traitify.GraphQL.cognitive.surveys;

  loadOrFetch({
    key: "cognitive",
    fetcher: () => Traitify.http.post(Traitify.GraphQL.cognitive.path, {query}).then((response) => (
      response.data.cognitiveSurveys.edges
        .map(({node: {id, name}}) => ({text: name, value: id}))
        .sort((a, b) => a.text.localeCompare(b.text))
    ))
  }).then((options) => {
    if(!options) { return; }

    updateOption({name: "cognitiveSurveyID", options});
  });
}

function setupDom() {
  setupTargets();

  const locales = Traitify.i18n.supportedLocales;
  let column;
  let group;
  let row;

  group = createElement({className: "group"});
  row = createElement({className: "row gap-lg max-sm-flex-col"});
  column = createElement();
  column.appendChild(createElement({className: "column-header", text: "General Options"}));
  column.appendChild(createOption({
    name: "colorScheme",
    options: [
      {text: "Default", value: ""},
      {text: "Auto", value: "auto"},
      {text: "Dark", value: "dark"},
      {text: "Light", value: "light"}
    ],
    text: "Color Scheme:"
  }));
  column.appendChild(createOption({
    fallback: "en-us",
    name: "locale",
    options: Object.keys(locales)
      .map((key) => ({text: locales[key], value: key}))
      .sort((a, b) => a.text.localeCompare(b.text)),
    text: "Locale:"
  }));
  column.appendChild(createOption({
    name: "perspective",
    options: [
      {text: "Default", value: ""},
      {text: "First Person", value: "firstPerson"},
      {text: "Third Person", value: "thirdPerson"}
    ],
    text: "Perspective:"
  }));
  column.appendChild(createOption({
    name: "report",
    options: [
      {text: "Candidate", value: "candidate"},
      {text: "Employee", value: "employee"},
      {text: "Manager", value: "manager"}
    ],
    text: "Report:"
  }));
  row.appendChild(column);
  column = createElement();
  column.appendChild(createElement({className: "column-header", text: "Additional Options"}));
  [
    {name: "imagekit", text: "Imagekit:"},
    {name: "showHeaders", text: "Show Headers:"},
    {name: "showHelp", text: "Show Help:"}
  ].forEach(({name, text}) => {
    column.appendChild(createOption({name, options: booleanOptions, text}));
  });
  row.appendChild(column);
  column = createElement();
  column.appendChild(createElement({className: "column-header", text: "Survey Options"}));
  [
    {name: "survey.allowBack", text: "Allow Back:"},
    {name: "survey.allowFullscreen", text: "Allow Fullscreen:"},
    {name: "survey.showInstructions", text: "Show Instructions:"}
  ].forEach(({name, text}) => {
    column.appendChild(createOption({name, options: booleanOptions, text}));
  });
  row.appendChild(column);
  group.appendChild(row);
  row = createElement({className: "row"});
  row.appendChild(createElement({onClick: createWidget, tag: "button", text: "Refresh"}));
  row.appendChild(createElement({onClick: destroyWidget, tag: "button", text: "Destroy"}));
  row.appendChild(createElement({onClick: clearListCache, tag: "button", text: "Clear List Cache"}));
  group.appendChild(row);
  document.body.appendChild(group);

  group = createElement({className: "group"});
  group.appendChild(createOption({
    fallback: "production",
    name: "environment",
    onChange: onEnvironmentChange,
    options: [{text: "Production", value: "production"}, {text: "Staging", value: "staging"}],
    text: "Environment:"
  }));
  group.appendChild(createOption({
    fallback: "personality",
    name: "surveyType",
    onChange: onSurveyTypeChange,
    options: [
      {text: "Benchmark", value: "benchmark"},
      {text: "Cognitive", value: "cognitive"},
      {text: "External", value: "external"},
      {text: "Generic", value: "generic"},
      {text: "Order", value: "order"},
      {text: "Personality", value: "personality"},
      {text: "RJP", value: "rjp"}
    ],
    text: "Survey Type:"
  }));
  row = createElement({id: "personality-options"});
  row.appendChild(createOption({
    fallback: "big-five",
    name: "personalitySurveyID",
    onChange: onSurveyIDChange,
    options: personalitySurveys,
    text: "Deck:"
  }));
  group.appendChild(row);

  row = createElement({id: "cognitive-options"});
  row.appendChild(createOption({name: "cognitiveSurveyID", onChange: onSurveyIDChange, options: [], text: "Survey:"}));
  group.appendChild(row);

  row = createElement({id: "benchmark-options"});
  row.appendChild(createOption({name: "benchmarkID", text: "Benchmark ID:", type: "combo"}));
  row.appendChild(createOption({name: "packageID", text: "Package ID:", type: "combo"}));
  group.appendChild(row);

  row = createElement({id: "order-options"});
  row.appendChild(createOption({name: "orderID", text: "Order ID:"}));
  group.appendChild(row);

  row = createElement({id: "external-options"});
  row.appendChild(createOption({name: "externalVendor", onChange: onExternalVendorChange, options: [], text: "Vendor:"}));
  row.appendChild(createOption({name: "externalSurveyID", onChange: onSurveyIDChange, options: [], text: "Survey:"}));
  group.appendChild(row);

  row = createElement({id: "generic-options"});
  row.appendChild(createOption({name: "genericSurveyID", onChange: onSurveyIDChange, options: [], text: "Survey:"}));
  group.appendChild(row);

  row = createElement({id: "rjp-options"});
  row.appendChild(createOption({name: "rjpSurveyID", onChange: onSurveyIDChange, options: [], text: "Survey:"}));
  group.appendChild(row);

  row = createElement({id: "profile-options"});
  row.appendChild(createOption({name: "profileID", text: "Profile ID:"}));
  group.appendChild(row);

  row = createElement({id: "assessment-options"});
  row.appendChild(createOption({name: "assessmentID", text: "Assessment ID:"}));
  group.appendChild(row);

  row = createElement({className: "row"});
  row.appendChild(createElement({
    id: "create-button",
    onClick: (e) => withLoading({action: () => createAssessment({mode: "create"}), button: e.currentTarget}),
    tag: "button",
    text: "Create"
  }));
  row.appendChild(createElement({
    id: "load-button",
    onClick: (e) => withLoading({action: () => createAssessment({mode: "load"}), button: e.currentTarget}),
    tag: "button",
    text: "Load"
  }));
  group.appendChild(row);
  document.body.appendChild(group);

  showSurveyOptions(cache.get("surveyType", {fallback: "personality"}));
  updateButtons();
}

function setupEnv() {
  setupLists();

  ["orderID", "profileID"].forEach((name) => {
    document.querySelector(`#${name}`).value = cache.get(name) || "";
  });
  syncAssessmentID();
}

function setupExternal() {
  const post = (params) => Traitify.http.post({
    params,
    path: Traitify.GraphQL.external.path,
    version: Traitify.GraphQL.external.version
  });
  const query = Traitify.GraphQL.external.vendors;

  loadOrFetch({
    key: "external-vendors",
    fetcher: () => post({query}).then((response) => {
      const vendors = response.data.listVendors[0]?.vendors || [];

      return vendors.map((vendor) => ({text: vendor, value: vendor}));
    })
  }).then((options) => {
    if(!options) { return; }

    updateOption({name: "externalVendor", options});
    loadExternalSurveys(cache.get("externalVendor"));
  });
}

function setupGeneric() {
  const localeKey = cache.get("locale");
  const query = Traitify.GraphQL.generic.surveys;
  const variables = {localeKey};

  loadOrFetch({
    key: `generic.${localeKey}`,
    fetcher: () => Traitify.http.post(Traitify.GraphQL.generic.path, {query, variables})
      .then((response) => (
        (response.data?.listSurveys || [])
          .map(({id, name}) => ({text: name, value: id}))
          .sort((a, b) => a.text.localeCompare(b.text))
      ))
  }).then((options) => {
    if(!options) { return; }

    updateOption({name: "genericSurveyID", options});
  });
}

function setupListeners() {
  Traitify.listener.on("Results.initialized", () => console.log("Results.initialized"));
  Traitify.listener.on("Results.updated", () => console.log("Results.updated"));
  Traitify.listener.on("Survey.finished", (context) => console.log("Survey.finished", context));
  Traitify.listener.on("Survey.start", (context) => console.log("Survey.start", context));
  Traitify.listener.on("Surveys.finished", (context) => console.log("Surveys.finished", context));
}

function setupLists() {
  setupBenchmarks();
  setupCognitive();
  setupExternal();
  setupGeneric();
  setupPackages();
  setupRJP();
}

function setupPackages() {
  loadOrFetch({
    key: "packages",
    fetcher: () => Traitify.http.get("/packages", {per_page: 500}).then((packages) => {
      if(!Array.isArray(packages)) { return null; }

      return packages
        .map(({id, name}) => ({text: name, value: id}))
        .sort((a, b) => a.text.localeCompare(b.text));
    })
  }).then((options) => {
    if(!options) { return; }

    updateOption({name: "packageID", options});
  });
}

function setupRJP() {
  const localeKey = cache.get("locale");
  const query = Traitify.GraphQL.rjp.list;
  const variables = {localeKey};

  loadOrFetch({
    key: `rjp.${localeKey}`,
    fetcher: () => Traitify.http.post(Traitify.GraphQL.rjp.path, {query, variables})
      .then((response) => {
        if(response.errors) { console.warn("rjp-surveys", response.errors); }

        return (response.data?.listSurveys || [])
          .map(({id, name}) => ({text: name, value: id}))
          .sort((a, b) => a.text.localeCompare(b.text));
      })
  }).then((options) => {
    if(!options) { return; }

    updateOption({name: "rjpSurveyID", options});
  });
}

function setupTargets() {
  const group = createElement({className: "group"});
  const total = Object.keys(allTargets).length;

  group.appendChild(createElement({id: "target-0"}));
  group.appendChild(createElement({id: "default"}));

  Array(total).fill().map((_, index) => index + 1).forEach((index) => {
    group.appendChild(createElement({id: `target-${index}`}));
  });

  document.body.appendChild(group);
}

function setupTraitify() {
  const environment = cache.get("environment");

  if(environment === "staging") {
    Traitify.http.host = "https://api.stag.awse.traitify.com";
  } else {
    Traitify.http.host = "https://api.traitify.com";
  }
}

function showSurveyOptions(surveyType) {
  surveyTypes.forEach((type) => {
    document.querySelector(`#${type}-options`).classList.toggle("hide", type !== surveyType);
  });
  document.querySelector("#assessment-options").classList.toggle("hide", ["benchmark", "order"].includes(surveyType));
  document.querySelector("#profile-options").classList.toggle("hide", !["benchmark", "external", "generic", "rjp"].includes(surveyType));
}

function syncAssessmentID() {
  const type = cache.get("surveyType", {fallback: "personality"});

  cache.set("assessmentID", envCache.get(`assessmentID.${cache.get(`${type}SurveyID`)}`));
  document.querySelector("#assessmentID").value = cache.get("assessmentID") || "";
}

function updateButtons() {
  const createButton = document.querySelector("#create-button");
  const loadButton = document.querySelector("#load-button");
  if(!createButton || !loadButton) { return; }

  const surveyType = cache.get("surveyType", {fallback: "personality"});
  const supported = ["cognitive", "external", "personality", "rjp"].includes(surveyType);

  createButton.classList.toggle("hide", !supported);
  loadButton.textContent = surveyType === "generic" ? "Create / Load" : "Load";
}

function updateOption({name, options}) {
  const label = document.querySelector(`#${name}-option`);
  const input = label.querySelector("input");
  const select = label.querySelector("select");
  let selected = cache.get(name);

  if(!input && !selected && options[0]) {
    selected = options[0].value;
    cache.set(name, selected);
    syncAssessmentID();
  }

  const optionElements = options.map(({text, value}) => (
    createElement({selected: value === selected, tag: "option", text, value})
  ));
  // NOTE: Combo
  if(input) {
    input.value = selected || "";
    optionElements.unshift(createElement({tag: "option", text: "Select", value: ""}));
  }

  select.replaceChildren(...optionElements);
}

function withLoading({action, button}) {
  button.classList.add("loading");
  button.setAttribute("disabled", "");

  return Promise.resolve(action()).finally(() => {
    button.classList.remove("loading");
    button.removeAttribute("disabled");
  });
}

migrateCache(); // NOTE: Migrates cache format for demo - Remove 2027/11/1
setupTraitify();
setupDom();
setupEnv();
setupListeners();
createWidget();
