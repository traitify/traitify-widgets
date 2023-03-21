Traitify.options.authKey = "sptoechv411aqbqrp4l9a4eg2a";
Traitify.options.host = "https://api.traitify.com";

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

function createWidget() {
  const surveyType = localStorage.getItem("survey-type");
  const assessmentID = localStorage.getItem(surveyType === "cognitive" ? "test-id" : "assessment-id");
  if(!assessmentID) { return; }

  const targets = {
    "Report.Candidate": "#default"
  };

  Traitify.options.assessmentID = assessmentID;
  Traitify.render(targets).then(function() {
    console.log("Rendered");
  }).catch(function(error) {
    console.log(error);
  });
}

function createElement({className, id}) {
  const element = document.createElement("div");

  if(className) { element.className = className; }
  if(id) { element.id = id; }

  return element;
}

function setupTargets() {
  const row = createElement({className: "row", id: "targets"});
  const total = Object.keys(allTargets).length;

  row.appendChild(createElement({id: "default"}));

  Array(total).fill().map((_, index) => index + 1).forEach((index) => {
    row.appendChild(createElement({id: `target-${index}`}));
  });

  document.body.appendChild(row);
}

setupTargets();
createWidget();
