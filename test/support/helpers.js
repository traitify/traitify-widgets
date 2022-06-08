export function flushPromises() { return new Promise(setImmediate); }

export function mockOptions(fn, options) { return fn.mockImplementation((key) => options[key]); }

export function mockProps(keys) {
  const props = {};

  keys.forEach((key) => {
    switch(key) {
      case "cache":
        props[key] = {
          get: jest.fn().mockName("get"),
          set: jest.fn().mockName("set")
        };
        break;
      case "getCacheKey":
        props[key] = jest.fn().mockName(key).mockImplementation((_key) => _key);
        break;
      case "isReady":
        props[key] = jest.fn().mockName(key).mockReturnValue(true);
        break;
      case "traitify":
        props[key] = {
          get: jest.fn().mockName("get"),
          post: jest.fn().mockName("post"),
          put: jest.fn().mockName("put")
        };
        break;
      case "translate":
        props[key] = jest.fn().mockName(key).mockImplementation((value, options) => (
          options ? `${value} - ${JSON.stringify(options)}` : value
        ));
        break;
      case "ui":
        props[key] = {
          current: {},
          off: jest.fn().mockName("off"),
          on: jest.fn().mockName("on"),
          trigger: jest.fn().mockName("trigger")
        };
        break;
      default:
        props[key] = jest.fn().mockName(key);
    }
  });

  return props;
}

export function mockUI() {
  const callbacks = {};
  const current = {};

  return {
    current,
    on: jest.fn().mockName("on").mockImplementation((_key, callback) => {
      const key = _key.toLowerCase();

      callbacks[key] = callbacks[key] || [];
      callbacks[key].push(callback);
      return this;
    }),
    off: jest.fn().mockName("off").mockImplementation((_key, callback) => {
      const key = _key.toLowerCase();

      callbacks[key] = callbacks[key] || [];
      callbacks[key] = callbacks[key].filter((_callback) => (_callback !== callback));

      if(callbacks[key].length === 0) { delete callbacks[key]; }

      return this;
    }),
    trigger: jest.fn().mockName("trigger").mockImplementation((_key, context, value) => {
      current[_key] = value;

      const key = _key.toLowerCase();
      const widgetID = context.props && context.props.widgetID;
      const widgetKey = widgetID && `widget-${widgetID}.${key}`.toLowerCase();

      if(callbacks[widgetKey]) {
        callbacks[widgetKey].forEach((callback) => {
          callback.apply(this, [context, value]);
        });
      }

      if(callbacks[key]) {
        callbacks[key].forEach((callback) => {
          callback.apply(this, [context, value]);
        });
      }

      if(callbacks.all) {
        callbacks.all.forEach((callback) => {
          callback.apply(this, [key, context, value]);
        });
      }

      return this;
    })
  };
}
