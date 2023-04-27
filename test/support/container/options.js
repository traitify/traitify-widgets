export const mockOption = (key, value) => {
  container.options[key] = value;
};

export const mockOptions = (options) => {
  container.options = {...container.options, ...options};
};

export const useOption = (key, value) => {
  beforeEach(() => { mockOption(key, value); });
};

export const useOptions = (options) => {
  beforeEach(() => { mockOptions(options); });
};
