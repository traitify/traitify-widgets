import guideQuery from "lib/graphql/queries/guide";

describe("Graphql", () => {
  describe("Queries", () => {
    describe("Guide", () => {
      describe("get", () => {
        it("creates query", () => {
          const query = guideQuery({
            params: {assessmentId: "xyz", localeKey: "es-US"},
            fields: ["name", {competencies: ["id", "name"]}]
          });

          expect(query).toMatchSnapshot();
        });

        it("creates query with defaults", () => {
          const query = guideQuery({params: {assessmentId: "xyz", localeKey: "es-US"}});

          expect(query).toMatchSnapshot();
        });
      });
    });
  });
});
