# Paradox

This first section is what Paradox most likely needs to update. The "Version 2 to Version 3" section is the full reference guide.

### NPM

Updates are still being made, so this command may need to be run again later

```
yarn upgrade traitify-widgets@alpha
```

### Auth

```
// Old
Traitify.setHost("https://api.traitify.com");
Traitify.setPubliCKey("Your Traitify public key");

// New
Traitify.http.authKey = "Your Traitify public key";
Traitify.http.host = "https://api.traitify.com";
```

### Component

```
// Old
assessment = traitify.ui.component();
assessment.assessmentID("an assessment id you have generated via a server side client");
assessment.target("#the-id-of-the-target-you-wish-to-render-to");
assessment.render();

// New
Traitify.options.assessmentID = "your-assessment-id";
Traitify.render("#the-id-of-the-target-you-wish-to-render-to");
```

When using a benchmark

```
Traitify.options.benchmarkID = "your-benchmark-id";
Traitify.options.profileID = "your-profile-id";
```

### Locale

```
// Old
assessment.locale("es-us");
Traitify.ui.setLocale("es-us");

// New
Traitify.options.locale = "es-us";
Traitify.updateLocale("es-us"); // Needed if widget is already rendered
```

### Report

```
// Old
assessment.perspective("thirdPerson");
assessment.view("manager");

// New
Traitify.options.report = "manager";
```

### Other

- Remove `.theme("paradox")`

# Version 2 to Version 3

## General

- Options have changed from functions (`benchmarkID(id)`) to an object (`.options.benchmarkID = id`)
- Some options have been rename from allow* to show*
  - allow is for actions (back, fullscreen)
  - show is for content (headers, instructions)
- SlideDeck has been renamed Survey
- Guide has been split into Guide.Client and Guide.Personality
- Various helper objects have been exposed
  - Components
  - GraphQL
  - http
  - hooks
  - i18n
  - listener

## Setup

### CDN

##### NOTE: This change is not yet live

```
<!-- Old -->
<script src="https://cdn.traitify.com/js/v2/traitify.js"></script>

<!-- New -->
<script src="https://cdn.traitify.com/js/v3/traitify.js"></script>
```

### Installation

##### NOTE: This change is not yet live

```
npm i --save traitify-widgets@latest
npm i --save traitify-widgets@2 // To continue to use the old version
```

##### NOTE: This is the current workaround

```
npm i --save traitify-widgets@alpha
```

## Usage

### Auth

```
// Old
Traitify.setHost("https://api.traitify.com");
Traitify.setPubliCKey("Your Traitify public key");

// New
Traitify.http.authKey = "Your Traitify public key";
Traitify.http.host = "https://api.traitify.com";
```

### Components

- Components used directly must be wrapped by a new Container component
- The Container will manage the options and state as well as fetch data
- The Container can wrap multiple components
- Container accepts these props
  - assessmentID
  - authKey
  - benchmarkID
  - graphql
  - host
  - locale
  - options
  - profileID
  - version

```
// Old
import {Components} from "traitify-widgets";

export default function Personality({id}) {
  return <Components.Results assessmentID={id} />;
}

// New
import {Components} from "traitify-widgets";

export default function Personality({id}) {
  return (
    <Components.Container assessmentID={id}>
      <Components.Results />
    </Components.Container>
  );
}
```

### Initialization

```
// Old
assessment = traitify.ui.component();
assessment.assessmentID("an assessment id you have generated via a server side client");
assessment.target("#the-id-of-the-target-you-wish-to-render-to");
assessment.render();

// New
Traitify.options.assessmentID = "an assessment id you have generated via a server side client";
Traitify.render("#the-id-of-the-target-you-wish-to-render-to");
```

### Options

#### Disabled Components

Some disabled components have been changed/renamed

```
// Old
Traitify.ui.options.disabledComponents = [
  "InterviewGuide",
  "PersonalityDimensionColumns"
];

// New
Traitify.options.disabledComponents = [
  "Guide",
  "PersonalityDimensionChart"
];
```

#### Locale

```
// Old
assessment.locale("nl-nl");
Traitify.ui.setLocale("es-us");

// New
Traitify.options.locale = "es-us";
Traitify.updateLocale("en-us");
```

#### Nested

```
// Old
Traitify.ui.options.careerOptions = {};
Traitify.ui.options.slideDeck = {};

// New
Traitify.options.career = {};
Traitify.options.survey = {};
```

#### Reports

```
// Old
assessment.perspective("thirdPerson");
assessment.view("manager");

// New
Traitify.options.report = "manager";
```

#### Targets

Components are now nested. Most will be found under `Results.Personality`

```
// Old
assessment.targets({
  "Careers": "#careers",
  "Guide": "#guide",
  "SlideDeck": "#slide-deck",
  "PersonalityTraits": "#personality-traits",
  "PersonalityTypes": "#personality-types",
  "Results": "#results"
});
assessment.render();

// New
Traitify.render({
  "Careers": "#careers",
  "Results": "#results",
  "Results.Career.Container": "#careers",
  "Results.Guide.Personality": "#guide",
  "Results.Personality.Type.List": "#personality-types",
  "Results.Personality.Trait.List": "#personality-traits",
  "Survey": "#survey"
});
```

### Events

```
// Old
assessment.on("SlideDeck.Initialized", function(){
  console.log("SlideDeck.Initialized");
});

assessment.on("SlideDeck.UpdateSlide", function(event, slideResponse){
  console.log("SlideDeck.UpdateSlide", slideResponse);
});

assessment.on("SlideDeck.Finished", function(){
  console.log("SlideDeck.Finished");
});

// New
Traitify.listener.on("Survey.initialized", () => {
  console.log("Survey.initialized");
});

Traitify.listener.on("Survey.updated", () => {
  console.log("Survey.updated");
});

Traitify.listener.on("Survey.updateSlide", ({response}) => {
  console.log("Survey.finished", response);
});

Traitify.listener.on("Survey.finished", ({response}) => {
  console.log("Survey.finished", response);
});
```

### Removed

- callback having context.customContent (was available for career components)
- Traitify.options.theme => paradox is now the only theme
- Traitify.ui (use Traitify directly)
