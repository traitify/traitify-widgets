import guideQuery from "lib/graphql/queries/guide";

describe("guide query", () => {
  it("sets default params", () => {
    const defaultQuery = guideQuery({params: {assessmentId: "xyz", localeKey: "es-US"}});

    expect(defaultQuery).toBe(`{ guide(assessmentId:"xyz",localeKey:"es-US") { competencies { id name introduction order questionSequences { id name personality_type_id questions { id text adaptability order purpose } } } }}`);
  });

  it("overrides default params", () => {
    const fields = [
      "name",
      {competencies: ["id", "name"]}
    ];

    const query = guideQuery({params: {assessmentId: "xyz", localeKey: "es-US"}, fields});

    expect(query).toBe(`{ guide(assessmentId:"xyz",localeKey:"es-US") { name competencies { id name } }}`);
  });
});
