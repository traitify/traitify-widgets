expect.extend({
  any() {
    return {message: () => "Expected anything", pass: true};
  },
  stringContainingAll(value, ...strings) {
    const missing = strings.find((string) => !value.includes(string));

    return missing
      ? {message: () => `Expected string to contain ${missing}`, pass: false}
      : {message: () => `Expected string not to contain ${strings.join("\n\n")}`, pass: true};
  }
});
