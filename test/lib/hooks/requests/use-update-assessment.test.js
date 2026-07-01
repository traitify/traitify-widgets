/* eslint-disable no-console */
import {createRef} from "react";
import {act} from "react-test-renderer";
import getCacheKey from "lib/common/get-cache-key";
import useUpdateAssessment from "lib/hooks/requests/use-update-assessment";
import ComponentHandler from "support/component-handler";
import {mockAssessment, mockFetch} from "support/container/http";
import flushAsync from "support/flush-async";
import useContainer from "support/hooks/use-container";
import useGlobalMock from "support/hooks/use-global-mock";

const completedAt = "2024-01-01";
const path = "/test/graphql";
const query = "mutation { updateAssessment }";
const variables = {id: "assessment-xyz"};
const params = {query, variables};
const retryDelay = 2000;

describe("useUpdateAssessment", () => {
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

  const setup = (overrides = {}) => ComponentHandler.setup(Component, {
    props: {
      options: {
        key: "test-update",
        parse: (response) => response.data.assessment,
        success: (data) => !!data?.completedAt,
        ...overrides
      }
    }
  });

  const mockRequest = (response) => mockFetch({
    key: "test-update",
    request: (url, options) => url.includes(path) && options.method === "POST",
    response: () => response
  });

  const request = () => container.http.post({path, params});

  const trigger = async() => {
    await act(async() => {
      await hook.current.trigger({assessment, request});
      jest.advanceTimersByTime(retryDelay);
    });
    await flushAsync();
  };

  describe("successful response", () => {
    let data;
    let mock;

    beforeEach(async() => {
      data = {completedAt, id: assessment.id};
      mock = mockRequest({data: {assessment: data}});
      await setup();
      await trigger();
    });

    it("posts the mutation", () => {
      expect(mock.called).toBe(1);
      expect(JSON.parse(mock.calls[1].body)).toEqual(params);
    });

    it("updates cached state", () => {
      expect(container.cache.set).toHaveBeenCalledWith(assessmentCacheKey, data);
    });
  });

  describe("save false", () => {
    beforeEach(async() => {
      mockRequest({data: {assessment: {completedAt, id: assessment.id}}});
      await setup({save: false});
      await trigger();
    });

    it("invalidates cached state instead of seeding it", () => {
      expect(container.cache.remove).toHaveBeenCalledWith(assessmentCacheKey);
      expect(container.cache.set).not.toHaveBeenCalled();
    });
  });

  it("runs the provided request regardless of transport", async() => {
    const data = {completedAt, id: assessment.id};
    const sendRequest = jest.fn().mockName("request")
      .mockResolvedValue({data: {assessment: data}});
    await setup();
    await act(async() => { await hook.current.trigger({assessment, request: sendRequest}); });

    expect(sendRequest).toHaveBeenCalledTimes(1);
    expect(container.cache.set).toHaveBeenCalledWith(assessmentCacheKey, data);
  });

  describe("unsuccessful response", () => {
    beforeEach(async() => {
      mockRequest({data: {assessment: {completedAt: null, id: assessment.id}}});
      await setup();
      await trigger();
    });

    it("does not update cached state", () => {
      expect(container.cache.set).not.toHaveBeenCalled();
    });
  });

  describe("error response", () => {
    beforeEach(async() => {
      mockRequest({errors: ["boom"]});
      await setup();
      await trigger();
    });

    it("warns", () => {
      expect(console.warn).toHaveBeenCalledWith("test-update", ["boom"]);
    });

    it("increments attempts", () => {
      expect(hook.current.attempts).toBe(1);
    });

    it("does not update cached state", () => {
      expect(container.cache.set).not.toHaveBeenCalled();
    });
  });

  describe("guards", () => {
    it("ignores requests without an assessment", async() => {
      const mock = mockRequest({data: {assessment: {id: assessment.id}}});
      await setup();
      await act(async() => { await hook.current.trigger({assessment: null, request}); });

      expect(mock.called).toBe(0);
    });

    it("ignores requests when already complete", async() => {
      const mock = mockRequest({data: {assessment: {id: assessment.id}}});
      await setup();
      await act(async() => {
        await hook.current.trigger({assessment: {...assessment, completedAt}, request});
      });

      expect(mock.called).toBe(0);
    });

    it("ignores concurrent requests", async() => {
      const mock = mockFetch({
        implementation: () => new Promise(() => {}),
        key: "test-update",
        request: (url, options) => url.includes(path) && options.method === "POST"
      });
      await setup();
      act(() => { hook.current.trigger({assessment, request}); });
      act(() => { hook.current.trigger({assessment, request}); });

      expect(mock.called).toBe(1);
    });
  });

  describe("retries", () => {
    it("retries three times before giving up", async() => {
      const mock = mockRequest({errors: ["boom"]});
      await setup();
      await trigger();
      await trigger();
      await trigger();
      await trigger();
      await trigger();

      expect(mock.called).toBe(4);
    });

    it("calls onFailure once retries are exhausted", async() => {
      const onFailure = jest.fn().mockName("onFailure");
      mockRequest({errors: ["boom"]});
      await setup({onFailure});
      await trigger();
      await trigger();
      await trigger();

      expect(onFailure).not.toHaveBeenCalled();

      await trigger();

      expect(onFailure).toHaveBeenCalledTimes(1);
    });
  });

  describe("reset", () => {
    it("clears the attempt counter", async() => {
      mockRequest({errors: ["boom"]});
      await setup();
      await trigger();

      expect(hook.current.attempts).toBe(1);

      await act(async() => { hook.current.reset(); });

      expect(hook.current.attempts).toBe(0);
    });
  });
});
