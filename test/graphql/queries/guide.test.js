import guideQuery from "graphql/queries/guide";

describe("guide query", () => {
  it("sets default params", () => {
    const defaultQuery = guideQuery({params: {assessmentId: "4f2a3c1c-57e4-4a86-b59c-4ebbf7787a8a"}});
    expect(defaultQuery).toBe(`{ guide(localeKey:"en-US",assessmentId:"4f2a3c1c-57e4-4a86-b59c-4ebbf7787a8a") { deckId id name competencies { id name introduction order questionSequences { id name questions { id text adaptability order purpose } } } }}`);
  });

  it("overrides default params", () => {
    const fields = [
      "name",
      {competencies: ["id", "name"]}
    ];

    const query = guideQuery({params: {assessmentId: "4f2a3c1c-57e4-4a86-b59c-4ebbf7787a8a"}, fields});
    expect(query).toBe(`{ guide(localeKey:"en-US",assessmentId:"4f2a3c1c-57e4-4a86-b59c-4ebbf7787a8a") { name competencies { id name } }}`);
  });
});
