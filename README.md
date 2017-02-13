# Traitify Widgets

## Initializing The Library
```
Traitify.setHost('your host url')
        .setPublicKey('your public key');

assessment = Traitify.ui.assessmentId('an assessment id you have generated via a server side client')
assessment.target("#the-id-of-the-target-you-wish-to-render-to")
assessment.render();
```

## Events
```
assessment.on("SlideDeck.Finished", function(){
  console.log("finished")
})
```

## Setup

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

## Tools

- Webpack: https://webpack.github.io
- Preact: https://github.com/developit/preact
- Preact Compat: https://github.com/developit/preact-compat

## Contibuting

Checkout [Preact Boilerplate] to understand some of the tools this repository uses

[Preact Boilerplate]: https://github.com/developit/preact-boilerplate
