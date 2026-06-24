/* eslint-disable no-console */
import {createRef} from "react";
import {act} from "react-test-renderer";
import useStartAssessment from "lib/hooks/requests/use-start-assessment";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockFetch, mockSettings} from "support/container/http";
import flushAsync from "support/flush-async";
import useContainer from "support/hooks/use-container";
import useGlobalMock from "support/hooks/use-global-mock";

const path = "/test/graphql";
const query = "mutation { startAssessment }";
const variables = {id: "assessment-xyz"};
const params = {query, variables};

describe("useStartAssessment", () => {
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
    mockSettings({});
    assessment = {id: "assessment-xyz", startedAt: null};
    hook = createRef();
  });

  const setup = (overrides = {}) => ComponentHandler.setup(Component, {
    props: {options: {key: "test-start", ...overrides}}
  });

  const mockRequest = (response) => mockFetch({
    key: "test-start",
    request: (url, options) => url.includes(path) && options.method === "POST",
    response: () => response
  });

  const request = () => container.http.post({path, params});

  const start = async(value = assessment) => {
    await act(async() => { await hook.current.trigger({assessment: value, request}); });
    await flushAsync();
  };

  describe("when not started", () => {
    let mock;

    beforeEach(async() => {
      mock = mockRequest({data: {startAssessment: {id: assessment.id}}});
      await setup();
      await start();
    });

    it("posts the mutation", () => {
      expect(mock.called).toBe(1);
      expect(JSON.parse(mock.calls[1].body)).toEqual({query, variables});
    });

    it("does not update cached state", () => {
      expect(container.cache.set).not.toHaveBeenCalled();
    });
  });

  describe("when already started", () => {
    it("does nothing", async() => {
      const mock = mockRequest({data: {startAssessment: {id: assessment.id}}});
      await setup();
      await start({...assessment, startedAt: "2024-01-01"});

      expect(mock.called).toBe(0);
    });
  });

  describe("without an assessment", () => {
    it("does nothing", async() => {
      const mock = mockRequest({data: {startAssessment: {id: assessment.id}}});
      await setup();
      await start(null);

      expect(mock.called).toBe(0);
    });
  });

  describe("error response", () => {
    beforeEach(async() => {
      mockRequest({errors: ["boom"]});
      await setup();
      await start();
    });

    it("warns", () => {
      expect(console.warn).toHaveBeenCalledWith("test-start", ["boom"]);
    });
  });
});
