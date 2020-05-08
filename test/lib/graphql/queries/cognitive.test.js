import {create, get, surveys, update} from "lib/graphql/queries/cognitive";

describe("Graphql", () => {
  describe("Queries", () => {
    describe("Cognitive", () => {
      describe("create", () => {
        const params = {localeKey: "en-US", surveyId: "abc"};

        it("creates mutation", () => {
          const query = create({params, fields: ["completed", "id", {questions: ["id"]}]});

          expect(query).toMatchSnapshot();
        });

        it("creates mutation with defaults", () => {
          const query = create({params});

          expect(query).toMatchSnapshot();
        });
      });

      describe("get", () => {
        const params = {localeKey: "en-US", testId: "abc"};

        it("creates query", () => {
          const query = get({params, fields: ["completed", "id", {questions: ["id"]}]});

          expect(query).toMatchSnapshot();
        });

        it("creates query with defaults", () => {
          const query = get({params});

          expect(query).toMatchSnapshot();
        });
      });

      describe("surveys", () => {
        it("creates query", () => {
          const query = surveys({fields: {edges: {node: ["id"]}}});

          expect(query).toMatchSnapshot();
        });

        it("creates query with defaults", () => {
          const query = surveys();

          expect(query).toMatchSnapshot();
        });
      });

      describe("update", () => {
        const params = {
          answers: [{answerId: "a-1", questionId: "q-1", timeTaken: 100}],
          overallTimeTaken: 2500,
          testId: "abc"
        };

        it("creates mutation", () => {
          const query = update({params, fields: ["message"]});

          expect(query).toMatchSnapshot();
        });

        it("creates mutation with defaults", () => {
          const query = update({params});

          expect(query).toMatchSnapshot();
        });
      });
    });
  });
});
