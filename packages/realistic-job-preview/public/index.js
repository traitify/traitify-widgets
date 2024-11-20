RJP.http.authKey = "sptoechv411aqbqrp4l9a4eg2a";
RJP.http.host = "https://api.traitify.com";

const cache = {prefix: "rjp"};
cache.getKey = (name) => [cache.prefix, name].filter(Boolean).join("-");
cache.get = (name, {fallback} = {}) => {
  const key = cache.getKey(name);
  const value = localStorage.getItem(key);
  if(value) { return value; }

  cache.set(name, fallback);

  return fallback;
};
cache.set = (name, value) => {
  const key = cache.getKey(name);

  (value == "" || value == undefined)
    ? localStorage.removeItem(key)
    : localStorage.setItem(key, value);
};

function createWidget() {
  const targets = {"Default": "#default"};

  const assessmentID = cache.get("assessmentID");
  console.log("createWidget", {assessmentID});
  if(!assessmentID) { return; }

  RJP.options.assessmentID = assessmentID;
  RJP.options.colorScheme = cache.get("colorScheme");
  RJP.options.locale = cache.get("locale");
  RJP.render(targets).then(function() {
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
  const query = RJP.GraphQL.assessment.create;
  const variables = {
    localeKey: cache.get("locale"),
    profileID: cache.get("profileID"),
    surveyID: cache.get("surveyID")
  };

  RJP.http.post(RJP.GraphQL.assessment.path, {query, variables}).then((response) => {
    console.log("createAssessment", response);

    try {
      const {id} = response.data.createAssessment;

      cache.set("assessmentID", id);
    } catch(error) {
      console.log(error);
    }
    setTimeout(createWidget, 500);
  });
}

function createOption({fallback, name, onChange, options, text, type}) {
  const element = createElement({className: "row", htmlFor: name, tag: "label", text});

  if(options) {
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
  } else {
    const input = createElement({
      id: name,
      name,
      onChange: onChange || onInputChange,
      tag: "input",
      type: type || "text",
      value: cache.get(name, {fallback})
    });

    element.appendChild(input);
  }

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

function destroyWidget() { RJP.destroy(); }

function setupTargets() {
  const group = createElement({className: "group"});
  const total = 5;

  group.appendChild(createElement({id: "target-0"}));
  group.appendChild(createElement({id: "default"}));

  Array(total).fill().map((_, index) => index + 1).forEach((index) => {
    group.appendChild(createElement({id: `target-${index}`}));
  });

  document.body.appendChild(group);
}

function setupDom() {
  setupTargets();

  const locales = RJP.i18n.supportedLocales;
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
  row.appendChild(column);
  group.appendChild(row);
  row = createElement({className: "row"});
  row.appendChild(createElement({onClick: createWidget, tag: "button", text: "Refresh"}));
  row.appendChild(createElement({onClick: destroyWidget, tag: "button", text: "Destroy"}));
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
  group.appendChild(createOption({name: "profileID", text: "Profile ID:"}));
  group.appendChild(createElement({id: "survey-options"}));

  row = createElement({className: "row"});
  row.appendChild(createElement({onClick: createAssessment, tag: "button", text: "Create"}));
  group.appendChild(row);
  document.body.appendChild(group);
}

function setupSurveys() {
  const query = RJP.GraphQL.survey.list;

  RJP.http.post(RJP.GraphQL.survey.path, {query}).then((response) => {
    const options = response.data.realisticJobPreviews
      .map(({id, name}) => ({text: name, value: id}))
      .sort((a, b) => a.text.localeCompare(b.text));
    const surveyID = cache.get("surveyID")
    if(!surveyID) { cache.set("surveyID", options[0].value); }

    document.querySelector("#survey-options").appendChild(createOption({
      name: "surveyID",
      onChange: onInputChange,
      options,
      text: "Survey:"
    }));
  });
}

function setupTraitify() {
  const environment = cache.get("environment");

  if(environment === "staging") {
    RJP.http.host = "https://api.stag.awse.traitify.com";
  } else {
    RJP.http.host = "https://api.traitify.com";
  }
}

function onEnvironmentChange(e) {
  onInputChange(e);
  setupTraitify();
}
function onInputChange(e) {
  const name = e.target.name;
  const value = e.target.type === "checkbox" ? booleanFrom(e.target.checked) : e.target.value;

  cache.set(name, value);
}

setupTraitify();
setupDom();
setupSurveys();
createWidget();
