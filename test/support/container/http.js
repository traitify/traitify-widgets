import dig from "lib/common/object/dig";

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

export const mockAssessment = (...params) => {
  const [response, mockOptions] = params.length === 1 && params[0]?.implementation
    ? [null, ...params]
    : params;
  const {id: _id, implementation} = mockOptions || {};
  const id = _id || response?.id || container.assessmentID;
  const mock = {
    key: "assessment",
    request: (url, options) => {
      if(!url.includes(`/assessments/${id}`)) { return false; }
      if(options.method !== "GET") { return false; }

      return true;
    }
  };

  container.assessmentID = id;
  implementation
    ? mock.implementation = implementation
    : mock.response = () => response;

  return mockFetch(mock);
};

export const mockAssessments = (...params) => {
  const [response, mockOptions] = params.length === 1 && params[0]?.implementation
    ? [null, ...params]
    : params;
  const {benchmarkID: _benchmarkID, profileID: _profileID, implementation} = mockOptions || {};
  const benchmarkID = _benchmarkID || response?.benchmarkID || container.benchmarkID;
  const profileID = _profileID || response?.profileID || container.profileID;
  const mock = {
    key: "assessments",
    request: (url, options) => {
      if(!url.includes("/xavier/graphql")) { return false; }
      if(options.method !== "POST") { return false; }
      if(!options.body) { return false; }

      const variables = dig(JSON.parse(options.body), "variables") || {};

      return variables.benchmarkID === benchmarkID && variables.profileID === profileID;
    }
  };

  container.assessmentID = null;
  container.benchmarkID = benchmarkID;
  container.profileID = profileID;
  implementation
    ? mock.implementation = implementation
    : mock.response = () => ({data: {recommendation: response}});

  return mockFetch(mock);
};

// NOTE: Allow params to be [response, {id}] or {id, implementation}
export const mockAssessmentStarted = (...params) => {
  const [response, mockOptions] = params.length === 1 && params[0]?.implementation
    ? [null, ...params]
    : params;
  const {id: _id, implementation} = mockOptions || {};
  const id = _id || container.assessmentID;
  const mock = {
    key: "assessment-started",
    request: (url, options) => {
      if(!url.includes(`/assessments/${id}/started`)) { return false; }
      if(options.method !== "GET") { return false; }

      return true;
    }
  };

  implementation
    ? mock.implementation = implementation
    : mock.response = () => response;

  return mockFetch(mock);
};

// NOTE: Allow params to be [response, {id}] or {id, implementation}
export const mockAssessmentSubmit = (...params) => {
  const [response, mockOptions] = params.length === 1 && params[0]?.implementation
    ? [null, ...params]
    : params;
  const {id: _id, implementation} = mockOptions || {};
  const id = _id || container.assessmentID;
  const mock = {
    key: "assessment-slides",
    request: (url, options) => {
      if(!url.includes(`/assessments/${id}/slides`)) { return false; }
      if(options.method !== "PUT") { return false; }

      return true;
    }
  };

  implementation
    ? mock.implementation = implementation
    : mock.response = () => response;

  return mockFetch(mock);
};

export const mockBenchmark = (benchmark, {id} = {}) => {
  container.benchmarkID = id || benchmark?.benchmarkId;

  return mockFetch({
    key: "benchmark",
    request: (url, options) => {
      if(!url.includes("/recommendations/graphql")) { return false; }
      if(options.method !== "POST") { return false; }
      if(!options.body) { return false; }

      const variables = dig(JSON.parse(options.body), "variables") || {};

      return variables.benchmarkID === container.benchmarkID;
    },
    response: () => ({data: {getDimensionRangeBenchmark: benchmark}})
  });
};

export const mockCareers = (careers, {assessmentID: _assessmentID, page} = {}) => {
  const assessmentID = _assessmentID || container.assessmentID;

  return mockFetch({
    key: "careers",
    request: (url, options) => {
      if(!url.includes(`/assessments/${assessmentID}/matches/careers`)) { return false; }
      if(options.method !== "GET") { return false; }
      if(page && !url.includes(`page=${page}`)) { return false; }

      return true;
    },
    response: () => careers
  });
};

export const mockCognitiveAssessment = (...params) => {
  const [response, mockOptions] = params.length === 1 && params[0]?.implementation
    ? [null, ...params]
    : params;
  const {id: _id, implementation} = mockOptions || {};
  const id = _id || response?.id || container.assessmentID;
  const mock = {
    key: "cognitive-assessment",
    request: (url, options) => {
      if(!url.includes("/cognitive-tests/graphql")) { return false; }
      if(options.method !== "POST") { return false; }
      if(!options.body) { return false; }

      const variables = dig(JSON.parse(options.body), "variables") || {};

      return variables.testID === id && !Object.hasOwn(variables, "answers");
    }
  };

  container.assessmentID = id;
  implementation
    ? mock.implementation = implementation
    : mock.response = () => ({data: {cognitiveTest: response}});

  return mockFetch(mock);
};

export const mockCognitiveSubmit = (...params) => {
  const [response, mockOptions] = params.length === 1 && params[0]?.implementation
    ? [null, ...params]
    : params;
  const {id: _id, implementation} = mockOptions || {};
  const id = _id || response?.id || container.assessmentID;
  const mock = {
    key: "cognitive-assessment-submit",
    request: (url, options) => {
      if(!url.includes("/cognitive-tests/graphql")) { return false; }
      if(options.method !== "POST") { return false; }
      if(!options.body) { return false; }

      const variables = dig(JSON.parse(options.body), "variables") || {};

      return variables.testID === id && Object.hasOwn(variables, "answers");
    }
  };

  container.assessmentID = id;
  implementation
    ? mock.implementation = implementation
    : mock.response = () => ({data: {completeCognitiveTest: response}});

  return mockFetch(mock);
};

export const mockDeck = (deck, {id} = {}) => (
  mockFetch({
    key: "deck",
    request: (url, options) => {
      if(!url.includes(`/decks/${id || deck.id}`)) { return false; }
      if(options.method !== "GET") { return false; }

      return true;
    },
    response: () => deck
  })
);

export const mockGuide = (guide, {assessmentID} = {}) => (
  mockFetch({
    key: "guide",
    request: (url, options) => {
      if(!url.includes("/interview_guides/graphql")) { return false; }
      if(options.method !== "POST") { return false; }
      if(!options.body) { return false; }

      const variables = dig(JSON.parse(options.body), "variables") || {};

      return variables.assessmentID === (assessmentID || guide.assessmentId);
    },
    response: () => (
      guide
        ? {
          data: {
            customInterviewGuide: {
              clientInterviewGuide: guide.client,
              personalityInterviewGuide: guide.personality
            }
          }
        } : {data: {guide}}
    )
  })
);

export const mockHighlightedCareers = (careers, {path} = {}) => (
  mockFetch({
    key: "highlighted-careers",
    request: (url, options) => {
      if(!url.includes(path)) { return false; }
      if(options.method !== "GET") { return false; }

      return true;
    },
    response: () => careers
  })
);

export const mockSettings = (settings) => (
  mockFetch({
    key: "settings",
    request: (url, options) => {
      if(!url.includes("/organizations/settings")) { return false; }
      if(options.method !== "GET") { return false; }

      return true;
    },
    response: () => settings
  })
);

export const useAssessment = (...options) => { beforeEach(() => { mockAssessment(...options); }); };
export const useBenchmark = (...options) => { beforeEach(() => { mockBenchmark(...options); }); };
export const useCareers = (...options) => { beforeEach(() => { mockCareers(...options); }); };
export const useDeck = (...options) => { beforeEach(() => { mockDeck(...options); }); };
export const useGuide = (...options) => { beforeEach(() => { mockGuide(...options); }); };
export const useHighlightedCareers = (...options) => {
  beforeEach(() => { mockHighlightedCareers(...options); });
};
export const useSettings = (...options) => { beforeEach(() => { mockSettings(...options); }); };
