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

const cache = {};
cache.get = (name, {fallback} = {}) => {
  const value = localStorage.getItem(name);
  if(value) { return value; }

  cache.set(name, fallback);

  return fallback;
};
cache.set = (name, value) => {
  (value == "" || value == undefined)
    ? localStorage.removeItem(name)
    : localStorage.setItem(name, value);
};

function createWidget() {
  const testID = cache.get("testID");
  console.log("createWidget", testID);
  if(!testID) { return; }

  const targets = {"Default": "#default"};

  Traitify.options.assessmentID = testID;
  Traitify.options.locale = cache.get("locale");
  Traitify.options.surveyType = cache.get("surveyType");
  Traitify.render(targets).then(function() {
    console.log("Rendered");
  }).catch(function(error) {
    console.log(error);
  });
}

function booleanFrom(value, fallback) {
  if(value == "true") { return true; }
  if(value == "false") { return false; }
  if(value == true) { return true; }
  if(value == false) { return false; }
  if(fallback == undefined) { return false; }

  return fallback;
}

function createAssessment() {
  destroyWidget();

  if(cache.get("surveyType") === "cognitive") { return createCognitiveAssessment(); }

  const params = {
    deck_id: cache.get("deckID"),
    locale_key: cache.get("locale")
  };
  const customParams = JSON.parse(cache.get("params", {fallback: "{}"}));

  Object.keys(customParams).filter((key) => customParams[key])
    .forEach((key) => params[key] = customParams[key]);

  Traitify.http.post("/assessments", params).then((assessment) => {
    try {
      const id = assessment.id;
      console.log("createAssessment", id);

      cache.set("personalityTestID", id);
      cache.set("testID", id);
    } catch(error) {
      console.log(error);
    }
    setTimeout(createWidget, 500);
  });
}

function createCognitiveAssessment() {
  const query = Traitify.GraphQL.cognitive.create;
  const variables = {
    localeKey: cache.get("locale"),
    surveyID: cache.get("surveyID")
  };

  Traitify.http.post(Traitify.GraphQL.cognitive.path, {query, variables}).then((response) => {
    try {
      const id = response.data.createCognitiveTest.id;

      cache.set("cognitiveTestID", id);
      cache.set("testID", id);
    } catch(error) {
      console.log(error);
    }
    setTimeout(createWidget, 500);
  });
}

// TODO: Allow for checkbox and text option
function createOption({fallback, name, onChange, options, text}) {
  const element = createElement({className: "row", htmlFor: name, tag: "label", text});
  const select = createElement({
    id: name,
    name,
    onChange: onChange || onInputChange,
    tag: "select"
  });
  const selected = cache.get(name, {fallback});

  options.forEach(({text, value}) => {
    select.appendChild(createElement({selected: selected === value, tag: "option", text, value}));
  });

  element.appendChild(select);

  return element;
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

function destroyWidget() { Traitify.destroy(); }

function setupTargets() {
  const group = createElement({className: "group"});
  const total = Object.keys(allTargets).length;

  group.appendChild(createElement({id: "default"}));

  Array(total).fill().map((_, index) => index + 1).forEach((index) => {
    group.appendChild(createElement({id: `target-${index}`}));
  });

  document.body.appendChild(group);
}

function setupDom() {
  setupTargets();

  const locales = Traitify.i18n.supportedLocales;
  let group;
  let row;

  group = createElement({className: "group"});
  group.appendChild(createOption({
    fallback: "en-us",
    name: "locale",
    onChange: onInputChange,
    options: Object.keys(locales)
      .map((key) => ({text: locales[key], value: key}))
      .sort((a, b) => a.text.localeCompare(b.text)),
    text: "Locale:"
  }));
  row = createElement({className: "row"});
  row.appendChild(createElement({onClick: createWidget, tag: "button", text: "Refresh"}));
  row.appendChild(createElement({onClick: destroyWidget, tag: "button", text: "Destroy"}));
  group.appendChild(row);
  document.body.appendChild(group);

  group = createElement({className: "group"});
  group.appendChild(createOption({
    fallback: "personality",
    name: "surveyType",
    onChange: onSurveyTypeChange,
    options: [{text: "Cognitive", value: "cognitive"}, {text: "Personality", value: "personality"}],
    text: "Survey Type:"
  }));
  const surveyType = cache.get("surveyType", {fallback: "personality"});
  row = createElement({className: surveyType !== "personality" ? "hide" : "", id: "personality-options"});
  row.appendChild(createOption({
    fallback: "big-five",
    name: "deckID",
    onChange: onInputChange,
    options: [
      {text: "Big Five", value: "big-five"},
      {text: "Career Deck", value: "career-deck"},
      {text: "Core", value: "core"},
      {text: "Financial Risk Tolerance", value: "financial-risk-tolerance-2.0"},
      {text: "Perseverance", value: "perseverance"},
      {text: "Persuasion", value: "persuasion"},
    ],
    text: "Deck:"
  }));
  group.appendChild(row);
  group.appendChild(createElement({className: surveyType !== "cognitive" ? "hide" : "", id: "cognitive-options"}));

  row = createElement({className: "row"});
  row.appendChild(createElement({onClick: createAssessment, tag: "button", text: "Create"}));
  group.appendChild(row);
  document.body.appendChild(group);
}

function setupCognitive() {
  const query = Traitify.GraphQL.cognitive.surveys;

  Traitify.http.post(Traitify.GraphQL.cognitive.path, {query}).then((response) => {
    const options = response.data.cognitiveSurveys.edges
      .map(({node: {id, name}}) => ({text: name, value: id}));

    document.querySelector("#cognitive-options").appendChild(createOption({
      name: "surveyID",
      onChange: onInputChange,
      options,
      text: "Survey:"
    }));
  });
}

function onInputChange(e) {
  const name = e.target.name;
  const value = e.target.type === "checkbox" ? booleanFrom(e.target.checked) : e.target.value;

  cache.set(name, value);
}

// TODO: Add similar logic for each assessment type, so you have one cached for each type
function onSurveyTypeChange(e) {
  onInputChange(e);

  const name = e.target.name;
  const value = e.target.value;
  const testID = cache.get(`${value}TestID`);

  cache.set("testID", testID);

  const otherValue = value === "cognitive" ? "personality" : "cognitive";
  document.querySelector(`#${otherValue}-options`).classList.add("hide");
  document.querySelector(`#${value}-options`).classList.remove("hide");
}

setupDom();
setupCognitive();
createWidget();
