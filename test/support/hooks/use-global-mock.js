/* eslint-disable no-param-reassign */
export default function useGlobalMock(base, key) {
  let original;

  beforeEach(() => {
    original = base[key];

    base[key] = jest.fn().mockName(key);
  });

  afterEach(() => { base[key] = original; });

  return base[key];
}
