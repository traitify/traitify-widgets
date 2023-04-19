# Traitify Widgets

## Installing and Initializing The Library

The widgets can be installed through our CDN or npm. Usage through the CDN will maintain backwards compatibility, while the npm library will use semantic versioning.

### CDN

```
<script src="https://cdn.traitify.com/js/v3/traitify.js"></script>
<script>
  Traitify.http.authKey = "Your Traitify public key";
  Traitify.http.host = "https://api.traitify.com";

  Traitify.options.assessmentID = "an assessment id you have generated via a server side client";
  Traitify.render("#the-id-of-the-target-you-wish-to-render-to");
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

traitify.options.assessmentID = "an assessment id you have generated via a server side client";
traitify.render("#the-id-of-the-target-you-wish-to-render-to");
```

[Click here](src/index.js) to view other classes available to import, such as `Http`.

## Rendering Components

[Click here](src/components/index.js) to view available to components, such as the `Results.Personality.Type.List`.

#### Survey

```
Traitify.render({Survey: "#dom-id"}); // Render just the Survey in the target element
```

#### Results

```
Traitify.render({Results: "#dom-id"}); // Render just the Results in the target element
```

### Career Component Customizations

#### Get your careers from a different endpoint

This is useful if you want to get the career results server side and modify the data returned or just want to proxy through your own server.

```
Traitify.options.career.path = "/my-career-endpoint";
```

#### Change which experience levels are in the filter

```
Traitify.options.career.experienceLevels = [4, 5];
```

#### Change how many results to show per page

```
Traitify.options.career.perPage = 10;
```

### Render multiple components in specific elements

```
Traitify.render({
  "Survey": "#survey",
  "Results": "#results",
  "Results.Career.Container": "#careers",
  "Results.Guide": "#guide",
  "Results.Personality.Type.List": "#personality-types",
  "Results.Personality.Trait.List": "#personality-traits"
});
```

### React/JSX

- Components used directly must be wrapped by a Container component
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
- If you've set options in a Traitify instance, pass them as props to the Container

```
import traitify, {Components} from "traitify-widgets";

export default function Personality({id}) {
  return (
    <Components.Container {...traitify.props()} assessmentID={id}>
      <Components.Results />
    </Components.Container>
  );
}
```

## Events

Most components trigger an initialized and updated event. Some components offer additional events. Event handlers must be set before the render command, or they will not be called.

```
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

## Options

### Internationalization Options

```
Traitify.options.locale = "en-us";

// Or if the component has already been rendered
Traitify.updateLocale("en-us");
```

Here is a list of the available locales (`en-us` is the default):
  - Chinese - `zh-cn`
  - Creole - `ht-us`
  - Dutch - `nl-nl`
  - English (GB) - `en-gb`
  - English (United States) - `en-us`
  - French (Canadian) - `fr-ca`
  - French (France) - `fr-fr`
  - Japanese - `ja-jp`
  - Norwegian - `no-no`
  - Portuguese - `pt-br`
  - Spanish (United States) - `es-us`
  - Swedish - `sv-se`

### Render a back button to allow users to change answers during the test

```
Traitify.options.survey.allowBack = true;
```

### Allow the user to click a button to go full screen

```
Traitify.options.survey.allowFullscreen = true;
```

### Allow the user to view section results section headers

```
Traitify.options.showHeaders = true;
```

### Render results using specific perspective

\* currently only the `big-five` assessment has perspective content

```
Traitify.options.perspective = "firstPerson";

OR

Traitify.options.perspective = "thirdPerson";
```

## Reports

### Big Five Hiring Manager Report

```
Traitify.options.report = "manager";
```

This report also makes use of a benchmark/recommendation. It will default to the benchmark used to create an assessment. To use a different benchmark, you can pass the ID as an option.

```
Traitify.options.benchmarkID = benchmarkID;
```

### Big Five Candidate Report

```
Traitify.options.report = "candidate";
```

### Engage Employee Report

```
Traitify.options.report = "employee";
```

## Traitify HTTP

We expose our JavaScript api client that you can use to make additional calls to our API from the client side. We make available `get`, `put`, and `post` functions. These methods will use the api key and url you configured when you initialized the Traitify library. Here is an example that returns career matches for a `career-deck` assessment. Further documentation on the API methods available can be found at https://app.traitify.com/developer/documentation.

```
<script src="https://cdn.traitify.com/js/v3/traitify.js"></script>
<script>
  Traitify.http.authKey = "Your Traitify public key";
  Traitify.http.host = "https://api.traitify.com";

  const assessmentID = "an assessment id you have generated via a server side client";

  Traitify.http.get(`/assessments/${assessmentID}/matches/careers`).then((matches) => {
    console.log(matches);
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
