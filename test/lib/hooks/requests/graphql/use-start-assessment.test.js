import {createRef} from "react";
import {act} from "react-test-renderer";
import useStartAssessment from "lib/hooks/requests/graphql/use-start-assessment";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockFetch} from "support/container/http";
import flushAsync from "support/flush-async";
import useContainer from "support/hooks/use-container";
import useGlobalMock from "support/hooks/use-global-mock";

const path = "/test/graphql";
const query = "mutation { startAssessment }";
const variables = {id: "assessment-xyz"};

describe("graphql/useStartAssessment", () => {
  let assessment;
  let hook;

  function Component({options}) {
    hook.current = useStartAssessment(options);

    return null;
  }

  useContainer();
  useGlobalMock(console, "warn");

  beforeEach(() => {
    container.assessmentID = "assessment-xyz";
    mockAssessment(null);
    assessment = {id: "assessment-xyz", startedAt: null};
    hook = createRef();
  });

  const setup = () => ComponentHandler.setup(Component, {
    props: {options: {key: "test-graphql-start", path}}
  });

  it("posts query and variables to the path", async() => {
    const mock = mockFetch({
      key: "test-graphql-start",
      request: (url, options) => url.includes(path) && options.method === "POST",
      response: () => ({data: {startAssessment: {id: assessment.id}}})
    });
    await setup();
    await act(async() => { await hook.current.trigger({assessment, query, variables}); });
    await flushAsync();

    expect(mock.called).toBe(1);
    expect(JSON.parse(mock.calls[1].body)).toEqual({query, variables});
  });
});
