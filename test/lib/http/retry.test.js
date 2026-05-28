import withRetry from "lib/http/retry";
import flushAsync from "support/flush-async";

describe("withRetry", () => {
  const okResponse = (status = 200) => ({ok: status < 400, status});

  it("returns response when fetch succeeds", async() => {
    const response = okResponse(200);
    const fetch = jest.fn().mockResolvedValue(response);
    const result = withRetry({fetch, method: "GET", options: {}});

    await flushAsync(Infinity);

    expect(await result).toBe(response);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("retries on configured status codes", async() => {
    const fetch = jest.fn()
      .mockResolvedValueOnce(okResponse(503))
      .mockResolvedValueOnce(okResponse(200));
    const result = withRetry({fetch, method: "GET", options: {statuses: [503]}});

    await flushAsync(Infinity);

    expect((await result).status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("does not retry on status not in statuses list", async() => {
    const fetch = jest.fn().mockResolvedValue(okResponse(500));
    const result = withRetry({fetch, method: "GET", options: {statuses: [503]}});

    await flushAsync(Infinity);

    expect((await result).status).toBe(500);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("stops retrying after max attempts", async() => {
    const fetch = jest.fn().mockResolvedValue(okResponse(503));
    const result = withRetry({fetch, method: "GET", options: {max: 2, statuses: [503]}});

    await flushAsync(Infinity);

    expect((await result).status).toBe(503);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("retries on network errors by default", async() => {
    const error = new TypeError("Network failure");
    const fetch = jest.fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValueOnce(okResponse(200));
    const result = withRetry({fetch, method: "GET", options: {}});

    await flushAsync(Infinity);

    expect((await result).status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("rethrows error when retries exhausted", async() => {
    const error = new TypeError("Network failure");
    const fetch = jest.fn().mockRejectedValue(error);
    const result = withRetry({fetch, method: "GET", options: {max: 1}}).catch((e) => e);

    await flushAsync(Infinity);

    expect(await result).toBe(error);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("does not retry methods not in the methods list", async() => {
    const fetch = jest.fn().mockResolvedValue(okResponse(503));
    const result = withRetry({fetch, method: "PATCH", options: {statuses: [503]}});

    await flushAsync(Infinity);

    expect((await result).status).toBe(503);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("retries methods when added to the methods list", async() => {
    const fetch = jest.fn()
      .mockResolvedValueOnce(okResponse(503))
      .mockResolvedValueOnce(okResponse(200));
    const result = withRetry({
      fetch,
      method: "PATCH",
      options: {methods: ["patch"], statuses: [503]}
    });

    await flushAsync(Infinity);

    expect((await result).status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it("uses retryIf when provided", async() => {
    const retryIf = jest.fn()
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);
    const fetch = jest.fn().mockResolvedValue(okResponse(418));
    const result = withRetry({fetch, method: "POST", options: {retryIf}});

    await flushAsync(Infinity);

    expect((await result).status).toBe(418);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(retryIf).toHaveBeenCalledWith(
      expect.objectContaining({attempt: 0, response: expect.objectContaining({status: 418})})
    );
  });

  it("calls retryBlock before each retry", async() => {
    const retryBlock = jest.fn();
    const fetch = jest.fn()
      .mockResolvedValueOnce(okResponse(503))
      .mockResolvedValueOnce(okResponse(503))
      .mockResolvedValueOnce(okResponse(200));
    const result = withRetry({
      fetch,
      method: "GET",
      options: {retryBlock, statuses: [503]}
    });

    await flushAsync(Infinity);

    await result;
    expect(retryBlock).toHaveBeenCalledTimes(2);
    expect(retryBlock).toHaveBeenNthCalledWith(1, expect.objectContaining({attempt: 0}));
    expect(retryBlock).toHaveBeenNthCalledWith(2, expect.objectContaining({attempt: 1}));
  });

  it("applies exponential backoff", async() => {
    const fetch = jest.fn()
      .mockResolvedValueOnce(okResponse(503))
      .mockResolvedValueOnce(okResponse(503))
      .mockResolvedValueOnce(okResponse(200));
    const delays = [];
    const setTimeoutSpy = jest.spyOn(global, "setTimeout").mockImplementation((callback, ms) => {
      delays.push(ms);
      callback();

      return 0;
    });
    const result = withRetry({
      fetch,
      method: "GET",
      options: {backoffFactor: 2, interval: 100, intervalRandomness: 0, statuses: [503]}
    });

    await flushAsync(Infinity);

    await result;
    expect(delays).toEqual([100, 200]);
    setTimeoutSpy.mockRestore();
  });

  it("caps delay at maxInterval", async() => {
    const fetch = jest.fn()
      .mockResolvedValueOnce(okResponse(503))
      .mockResolvedValueOnce(okResponse(503))
      .mockResolvedValueOnce(okResponse(200));
    const delays = [];
    const setTimeoutSpy = jest.spyOn(global, "setTimeout").mockImplementation((callback, ms) => {
      delays.push(ms);
      callback();

      return 0;
    });
    const result = withRetry({
      fetch,
      method: "GET",
      options: {
        backoffFactor: 10,
        interval: 100,
        intervalRandomness: 0,
        maxInterval: 500,
        statuses: [503]
      }
    });

    await flushAsync(Infinity);

    await result;
    expect(delays).toEqual([100, 500]);
    setTimeoutSpy.mockRestore();
  });
});
