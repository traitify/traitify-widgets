import {createRef} from "react";
import {act} from "react-test-renderer";
import getCacheKey from "lib/common/get-cache-key";
import useUpdateAssessment from "lib/hooks/requests/graphql/use-update-assessment";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockFetch} from "support/container/http";
import flushAsync from "support/flush-async";
import useContainer from "support/hooks/use-container";
import useGlobalMock from "support/hooks/use-global-mock";

const path = "/test/graphql";
const query = "mutation { updateAssessment }";
const variables = {id: "assessment-xyz"};

describe("graphql/useUpdateAssessment", () => {
  let assessment;
  let assessmentCacheKey;
  let hook;

  function Component({options}) {
    hook.current = useUpdateAssessment(options);

    return null;
  }

  useContainer();
  useGlobalMock(console, "warn");

  beforeEach(() => {
    container.assessmentID = "assessment-xyz";
    mockAssessment(null);
    assessment = {id: "assessment-xyz"};
    assessmentCacheKey = getCacheKey("assessment", {id: assessment.id, locale: "en-us"});
    hook = createRef();
  });

  const setup = () => ComponentHandler.setup(Component, {
    props: {
      options: {
        key: "test-graphql",
        parse: (response) => response.data.assessment,
        path,
        success: (data) => !!data?.completedAt
      }
    }
  });

  it("posts query and variables to the path and runs the pipeline", async() => {
    const data = {completedAt: "2024-01-01", id: assessment.id};
    const mock = mockFetch({
      key: "test-graphql",
      request: (url, options) => url.includes(path) && options.method === "POST",
      response: () => ({data: {assessment: data}})
    });
    await setup();
    await act(async() => { await hook.current.trigger({assessment, query, variables}); });
    await flushAsync();

    expect(mock.called).toBe(1);
    expect(JSON.parse(mock.calls[1].body)).toEqual({query, variables});
    expect(container.cache.set).toHaveBeenCalledWith(assessmentCacheKey, data);
  });
});
