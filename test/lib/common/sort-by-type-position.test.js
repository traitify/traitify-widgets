import sortByTypePosition from "lib/common/sort-by-type-position";

describe("sortByTypePosition", () => {
  let type1;
  let type2;
  let type3;

  beforeEach(() => {
    type1 = {personality_type: {details: [{body: 1, title: "Position"}], name: "Uno"}};
    type2 = {personality_type: {details: [{body: 2, title: "Position"}], name: "Dos"}};
    type3 = {personality_type: {details: [{body: 3, title: "Position"}], name: "Tres"}};
  });

  it("returns new array", () => {
    const types = [type1, type2, type3];
    const value = sortByTypePosition(types);

    expect(types[0]).toEqual(type1);
    expect(value).not.toBe(types);
  });

  it("falls back", () => {
    type2 = {personality_type: {details: [], name: "Dos"}};

    const types = [type1, type3, type2];
    const value = sortByTypePosition(types);

    expect(value).toEqual([type1, type2, type3]);
  });

  it("sorts", () => {
    const types = [type2, type1, type3];
    const value = sortByTypePosition(types);

    expect(value).toEqual([type1, type2, type3]);
  });
});
