# Traitify Widgets

## Installing and Initializing The Library

The widgets can be installed through our CDN or npm. Usage through the CDN will maintain backwards compatibility, while the npm library will use semantic versioning.

### CDN

```
<script src="https://cdn.traitify.com/js/v2/traitify.js"></script>
<script>
  Traitify.setHost('your host url');
  Traitify.setPublicKey('your public key');

  assessment = Traitify.ui.component();
  assessment.assessmentID('an assessment id you have generated via a server side client');
  assessment.target("#the-id-of-the-target-you-wish-to-render-to");
  assessment.render();
</script>
```

### npm

#### Installation
```
npm i --save traitify-widgets
```

#### Usage
```
import traitify from "traitify-widgets";

assessment = traitify.ui.component();
assessment.assessmentID('an assessment id you have generated via a server side client');
assessment.target("#the-id-of-the-target-you-wish-to-render-to");
assessment.render();
```

[Click here](src/index.js) to view other classes available to import, such as the `TraitifyClient`.

## Rendering Components

### All Decks

#### SlideDeck
```
assessment.render("SlideDeck"); // Render just the SlideDeck in the target element
```

#### Results
```
assessment.render("Results"); // Render just the Results in the target element
```

#### Personality Types/Dimensions
```
assessment.render("PersonalityTypes"); // Render just the Type/Dimensions in the target element
```

#### Personality Traits
```
assessment.render("PersonalityTraits"); // Render just the Traits in the target element
```

#### Personality Details
```
assessment.render("PersonalityDetails"); // Render just the details in the target element
```

### Type Based Decks (ex. career-deck, core, heroes)

#### Personality Blend
```
assessment.render("PersonalityBlend"); // Render just the Blend in the target element
```

### Careers Deck Components (career-deck)

#### Render All Career Components
```
assessment.render("Careers"); // Render all the career components
```

#### Specific Career Components

#### Career Filter
```
assessment.render("CareerFilter"); // Render the career filter
```

#### Career Results
```
assessment.render("CareerResults"); // Render the career list
```

#### Career Modal
```
assessment.render("CareerModal"); // Render the career modal
```

### Additional Career Component Customizations

#### Add content to the Career Filter
```
// Add content to the career filter
Traitify.ui.on("CareerFilter.updated", function(context){
  context.customContent.appendChild(document.createTextNode("I am custom content"));
});
```

#### Add content to the Career Modal
```
// Add content to the career modal
Traitify.ui.on("CareerModal.updated", function(context){
  if(!context.customContent){ return; }
  context.customContent.appendChild(document.createTextNode("I am custom content"));
});
```

#### Trigger a refresh of the career results with different params
```
// Update parameters and re-request careers
Traitify.ui.trigger("Careers.mergeParams", this, {experienceLevels: [4, 5], page: 1});
```

#### Get your careers from a different endpoint
This is useful if you want to get the career results server side and modify the data returned or just want to proxy through your own server.
```
Traitify.ui.options.careerOptions.path = "/my-career-endpoint";
```

#### Change which experience levels are in the filter
```
Traitify.ui.options.careerOptions.experienceLevels = [4, 5];
```

#### Change how many results to show per page
```
Traitify.ui.options.careerOptions.perPage = 10;
```

### Dimension Based Decks (big-five)

#### Radar Graph
```
assessment.render("Radar"); // Render just the Radar graph in the target element
```

#### Personality Heading
```
assessment.render("PersonalityHeading"); // Render just the archetype in the target element
```

### Render multiple components in specific elements
```
  assessment.targets({
    "SlideDeck": "#slide-deck",
    "PersonalityTypes": "#personality-types",
    "PersonalityTraits": "#personality-traits",
    "Results": "#results",
    "Careers": "#careers",
  });

  assessment.render();
```

## Events
```
  // Event handlers must be set before the render command, or they will not be called.
  assessment.on("SlideDeck.Finished", function(){
    console.log("SlideDeck.Finished");
  });

  assessment.on("SlideDeck.Initialized", function(){
    console.log("SlideDeck.Initialized");
  });

  assessment.on("SlideDeck.IsReady", function(){
    console.log("SlideDeck.IsReady");
  });

  assessment.on("SlideDeck.UpdateSlide", function(event, slideResponse){
    console.log("SlideDeck.UpdateSlide");
    console.log(slideResponse);
  });

  assessment.on("SlideDeck.BackSlide", function(){
    console.log("SlideDeck.BackSlide");
  });

  assessment.on("SlideDeck.Fullscreen", function(event, isFullScreen){
    console.log("SlideDeck.Fullscreen");
    console.log(isFullScreen);
  });

  assessment.on("Results.Initialized", function(){
    console.log("Results.Initialized");
  });

  assessment.on("PersonalityTypes.Initialized", function(){
    console.log("PersonalityTypes.Initialized");
  });

  assessment.on("PersonalityTraits.Initialized", function(){
    console.log("PersonalityTraits.Initialized");
  });
```

## Options
### Internationalization Options
```
// Set globally
Traitify.ui.setLocale("es-us");
```
or
```
// Set just for the instance of the widget
assessment.locale("nl-nl");
```
Here is a list of the available locales (`en-us` is the default):
  - Creole - `ht-us`
  - Dutch - `nl-nl`
  - English (GB) - `en-gb`
  - English (United States) - `en-us`
  - French (Canadian) - `fr-ca`
  - French (France) - `fr-fr`
  - Norwegian - `no-no`
  - Spanish (United States) - `es-us`
  - Swedish - `sv-se`

### Render a back button to allow users to change answers during the test
```
  assessment.allowBack();
```

### Allow the user to click a button to go full screen
```
  assessment.allowFullscreen();
```

### Render results using specific perspective
\* currently only the `big-five` assessment has perspective content
```
  assessment.perspective("firstPerson");

  OR

  assessment.perspective("thirdPerson");
```

## Traitify Client
We expose our JavaScript api client that you can use to make additional calls to our API from the client side. We make available `get`, `put`, and `post` functions. These methods will use the api key and url you configured when you initialized the Traitify library. Here is an example that returns career matches for a `career-deck` assessment. Further documentation on the API methods available can be found at https://app.traitify.com/developer/documentation.

```
<script src="https://cdn.traitify.com/js/v2/traitify.js"></script>
<script>
  Traitify.setHost('your host url');
  Traitify.setPublicKey('your public key');
  var assessmentId = 'an assessment id you have generated via a server side client';
  Traitify.get('/assessments/' + assessmentId + '/matches/careers').then(function(career_matches){
    console.log(career_matches);
  });
</script>
```

## Contibuting

### Setup

```sh
npm install
npm run dev
```

### Build

```sh
npm run build
```

### Tools in Use

- React: https://reactjs.org
- Webpack: https://webpack.github.io
