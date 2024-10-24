import dig from "traitify/lib/common/object/dig";
import * as graphql from "lib/graphql/assessment";

export const mockFetch = (_newMock) => {
  const newMock = {called: 0, calls: [], ..._newMock};

  container.http.mocks.fetch.unshift(newMock);
  container.http.fetch.mockImplementation((...options) => {
    const mock = container.http.mocks.fetch.find(({request}) => request(...options));
    if(mock) {
      mock.called += 1;
      mock.calls.push(...options);

      if(mock.implementation) { return mock.implementation(mock, ...options); }
      return Promise.resolve({json: () => mock.response(...options)});
    }

    console.error([ // eslint-disable-line no-console
      `Test: ${expect.getState().currentTestName}\n`,
      "Error: Unmocked Fetch\n\n"
    ].join(""), options);
    throw new Error("Unmocked Fetch");
  });

  return newMock;
};

// NOTE: Allow params to be [response, {id}] or {id, implementation}
export const mockAssessment = (...params) => {
  const [response, mockOptions] = params.length === 1 && params[0]?.implementation
    ? [null, ...params]
    : params;
  const {id: _id, implementation} = mockOptions || {};
  const id = _id || response?.id || container.assessmentID;
  const mock = {
    key: "assessment",
    request: (url, options) => {
      if(!url.includes(graphql.path)) { return false; }
      if(options.method !== "POST") { return false; }
      if(!options.body) { return false; }

      const body = JSON.parse(options.body);
      const query = dig(body, "query") || "";
      if(!query.includes("query assessment(")) { return false; }

      const variables = dig(body, "variables") || {};
      return variables.assessmentID === id;
    }
  };

  container.assessmentID = id;
  implementation
    ? mock.implementation = implementation
    : mock.response = () => ({data: {assessment: response}});

  return mockFetch(mock);
};

// NOTE: Allow params to be [response, {id}] or {id, implementation}
export const mockAssessmentStarted = (...params) => {
  const [response, mockOptions] = params.length === 1 && params[0]?.implementation
    ? [null, ...params]
    : params;
  const {id: _id, implementation} = mockOptions || {};
  const id = _id || response?.id || container.assessmentID;
  const mock = {
    key: "assessment",
    request: (url, options) => {
      if(!url.includes(graphql.path)) { return false; }
      if(options.method !== "POST") { return false; }
      if(!options.body) { return false; }

      const body = JSON.parse(options.body);
      const query = dig(body, "query") || "";
      if(!query.includes("mutation startAssessment(")) { return false; }

      const variables = dig(body, "variables") || {};
      return variables.assessmentID === id;
    }
  };

  implementation
    ? mock.implementation = implementation
    : mock.response = () => ({data: {startAssessment: response}});

  return mockFetch(mock);
};

// NOTE: Allow params to be [response, {id}] or {id, implementation}
export const mockAssessmentSubmit = (...params) => {
  const [response, mockOptions] = params.length === 1 && params[0]?.implementation
    ? [null, ...params]
    : params;
  const {id: _id, implementation} = mockOptions || {};
  const id = _id || response?.id || container.assessmentID;
  const mock = {
    key: "assessment",
    request: (url, options) => {
      if(!url.includes(graphql.path)) { return false; }
      if(options.method !== "POST") { return false; }
      if(!options.body) { return false; }

      const body = JSON.parse(options.body);
      const query = dig(body, "query") || "";
      if(!query.includes("mutation updateAssessmentAnswer(")) { return false; }

      const variables = dig(body, "variables") || {};
      return variables.assessmentID === id;
    }
  };

  implementation
    ? mock.implementation = implementation
    : mock.response = () => ({data: {updateAssessmentAnswer: response}});

  return mockFetch(mock);
};

export const useAssessment = (...options) => { beforeEach(() => { mockAssessment(...options); }); };
