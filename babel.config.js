module.exports = {
  "sourceMaps": true,
  "presets": [
    "airbnb",
    "@babel/preset-env"
  ],
  // TODO: Evaluate which Stage 0-3 proposals we're using
  "plugins": [
    "@babel/plugin-transform-proto-to-assign", // Not stage 0, IE 10
    "@babel/plugin-transform-react-jsx", // Not stage 0

    // Stage 3
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-syntax-import-meta",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-json-strings",

    // Stage 2
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ],
    "@babel/plugin-proposal-function-sent",
    "@babel/plugin-proposal-export-namespace-from",
    "@babel/plugin-proposal-numeric-separator",
    "@babel/plugin-proposal-throw-expressions",

    // Stage 1
    "@babel/plugin-proposal-export-default-from",
    "@babel/plugin-proposal-logical-assignment-operators",
    "@babel/plugin-proposal-optional-chaining",
    [
      "@babel/plugin-proposal-pipeline-operator",
      {
        "proposal": "minimal"
      }
    ],
    "@babel/plugin-proposal-nullish-coalescing-operator",
    "@babel/plugin-proposal-do-expressions",

    // Stage 0
    "@babel/plugin-proposal-function-bind"
  ]
}
