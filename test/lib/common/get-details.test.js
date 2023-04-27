import getDetails from "lib/common/get-details";
import mutable from "lib/common/object/mutable";
import assessment from "support/json/assessment/dimension-based.json";

describe("getDetails", () => {
  let options;

  beforeEach(() => {
    options = {
      name: "description",
      personality: mutable(assessment.personality_types[0].personality_type)
    };
  });

  it("shows first person", () => {
    options.perspective = "firstPerson";
    const details = options.personality.details.filter(({title}) => title === "first_person_description");
    const value = getDetails(options);

    expect(value).toEqual(details.map(({body}) => body));
  });

  it("shows third person", () => {
    options.perspective = "thirdPerson";
    const details = options.personality.details.filter(({title}) => title === "third_person_description");
    const value = getDetails(options);

    expect(value).toEqual(details.map(({body}) => body));
  });

  it("falls back to attribute", () => {
    const detail = options.personality.description;
    const value = getDetails(options);

    expect(value).toEqual([detail]);
  });

  it("falls back to fallback", () => {
    const details = options.personality.details.filter(({title}) => title !== "first_person_description");
    delete options.personality.description;
    options.fallback = false;
    options.personality = {...options.personality, details};
    options.perspective = "firstPerson";
    const value = getDetails(options);

    expect(value).toEqual([]);
  });

  it("falls back to opposing titlelized detail", () => {
    const detail = options.personality.details.find(({title}) => title === "third_person_description");
    const details = options.personality.details.filter(({title}) => !title.includes("person_description"));
    delete options.personality.description;
    options.name = "Description";
    options.personality.details = [...details, {...detail, title: "Third Person Description"}];
    options.perspective = "firstPerson";
    const value = getDetails(options);

    expect(value).toEqual([detail.body]);
  });

  it("falls back to titlelized detail", () => {
    const detail = options.personality.details.find(({title}) => title === "third_person_description");
    const details = options.personality.details.filter(({title}) => !title.includes("person_description"));
    delete options.personality.description;
    options.name = "Description";
    options.personality.details = [...details, {...detail, title: "First Person Description"}];
    options.perspective = "firstPerson";
    const value = getDetails(options);

    expect(value).toEqual([detail.body]);
  });

  it("falls back to third person", () => {
    const detail = options.personality.details.find(({title}) => title === "third_person_description");
    const details = options.personality.details.filter(({title}) => title !== "first_person_description");
    delete options.personality.description;
    options.personality = {...options.personality, details};
    options.perspective = "firstPerson";
    const value = getDetails(options);

    expect(value).toEqual([detail.body]);
  });

  it("falls back to first person", () => {
    const detail = options.personality.details.find(({title}) => title === "first_person_description");
    const details = options.personality.details.filter(({title}) => title !== "third_person_description");
    delete options.personality.description;
    options.personality = {...options.personality, details};
    options.perspective = "thirdPerson";
    const value = getDetails(options);

    expect(value).toEqual([detail.body]);
  });
});
