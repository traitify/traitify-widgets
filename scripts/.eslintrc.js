module.exports = {
  env: {
    node: true
  },
  extends: ["traitify"],
  rules: {
    "keyword-spacing": ["error", {
      after: false,
      before: false,
      overrides: {
        as: {before: true, after: true},
        async: {before: true, after: true}, // NOTE: Added this
        case: {before: true, after: true},
        catch: {before: true, after: false},
        const: {before: true, after: true},
        default: {before: true, after: true},
        else: {before: true, after: true},
        export: {before: true, after: true},
        from: {before: true, after: true},
        import: {before: true, after: true},
        let: {before: true, after: true},
        return: {before: true, after: true},
        this: {before: true, after: true},
        try: {before: true, after: true}
      }
    }]
  },
  settings: {
    "import/resolver": {
      webpack: {
        "config": "webpack.config.js",
        "config-index": 1
      }
    }
  }
};
