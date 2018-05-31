# Traitify Widgets

## Initializing The Library
```
<script src="https://cdn.traitify.com/js/v2/traitify.js"></script>
<script>
Traitify.setHost('your host url');
Traitify.setPublicKey('your public key');

assessment = Traitify.ui.assessmentId('an assessment id you have generated via a server side client');
assessment.target("#the-id-of-the-target-you-wish-to-render-to");
assessment.render();
</script>
```

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

### Type Based Decks (ex. career-deck,core,heroes)

#### Personality Blend
```
assessment.render("PersonalityBlend"); // Render just the Blend in the target element
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
### Render a back button to allow users to change answers during the test
```
  assessment.allowBack(true);
```

### Allow the user to click a button to go full screen
```
  assessment.allowFullScreen(true);
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

Checkout [Preact Boilerplate] to understand some of the tools this repository uses

[Preact Boilerplate]: https://github.com/developit/preact-boilerplate

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

- Webpack: https://webpack.github.io
- Preact: https://github.com/developit/preact
- Preact Compat: https://github.com/developit/preact-compat
