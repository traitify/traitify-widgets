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

// NOTE: Allow params to be [response, {id}] or {id, implementation}
export const mockAssessmentSkip = (...params) => {
  const [response, mockOptions] = params.length === 1 && params[0]?.implementation
    ? [null, ...params]
    : params;
  const {id: _id, implementation} = mockOptions || {};
  const id = _id || container.assessmentID;
  const mock = {
    key: "assessment-skip",
    request: (url, options) => {
      if(!url.includes(`/assessments/${id}/skip`)) { return false; }
      if(options.method !== "PUT") { return false; }

      return true;
    }
  };

  implementation
    ? mock.implementation = implementation
    : mock.response = () => response;

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
      if(options.method !== "PUT") { return false; }

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

export const mockCognitiveSkip = (...params) => {
  const [response, mockOptions] = params.length === 1 && params[0]?.implementation
    ? [null, ...params]
    : params;
  const {id: _id, implementation} = mockOptions || {};
  const id = _id || response?.id || container.assessmentID;
  const mock = {
    key: "cognitive-assessment-skip",
    request: (url, options) => {
      if(!url.includes("/cognitive-tests/graphql")) { return false; }
      if(options.method !== "POST") { return false; }
      if(!options.body) { return false; }

      const query = dig(JSON.parse(options.body), "query") || {};
      const variables = dig(JSON.parse(options.body), "variables") || {};

      return variables.testID === id && query.includes("skipCognitiveTest");
    }
  };

  container.assessmentID = id;
  implementation
    ? mock.implementation = implementation
    : mock.response = () => ({data: {skipCognitiveTest: response}});

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

export const mockExternalAssessment = (...params) => {
  const [response, mockOptions] = params.length === 1 && params[0]?.implementation
    ? [null, ...params]
    : params;
  const {id: _id, implementation} = mockOptions || {};
  const id = _id || response?.assessmentId || container.assessmentID;
  const mock = {
    key: "external-assessment",
    request: (url, options) => {
      if(!url.includes("/external_assessments/graphql")) { return false; }
      if(options.method !== "POST") { return false; }
      if(!options.body) { return false; }

      const variables = dig(JSON.parse(options.body), "variables") || {};

      return variables.id === id;
    }
  };

  container.assessmentID = id;
  implementation
    ? mock.implementation = implementation
    : mock.response = () => ({data: {getAssessment: response}});

  return mockFetch(mock);
};

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

export const mockOrder = (...params) => {
  const [response, mockOptions] = params.length === 1 && params[0]?.implementation
    ? [null, ...params]
    : params;
  const {orderID: _orderID, implementation} = mockOptions || {};
  const orderID = _orderID || response?.id || container.orderID;
  const mock = {
    key: "order",
    request: (url, options) => {
      if(!url.includes("/orders/graphql")) { return false; }
      if(options.method !== "POST") { return false; }
      if(!options.body) { return false; }

      const variables = dig(JSON.parse(options.body), "variables") || {};

      return variables.id === orderID;
    }
  };

  container.assessmentID = null;
  container.orderID = orderID;
  implementation
    ? mock.implementation = implementation
    : mock.response = () => ({data: {order: response}});

  return mockFetch(mock);
};

export const mockRecommendation = (...params) => {
  const [response, mockOptions] = params.length === 1 && params[0]?.implementation
    ? [null, ...params]
    : params;
  const {benchmarkID: _benchmarkID, profileID: _profileID, implementation} = mockOptions || {};
  const benchmarkID = _benchmarkID || response?.benchmarkID || container.benchmarkID;
  const profileID = _profileID || response?.profileID || container.profileID;
  const mock = {
    key: "recommendation",
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

export const mockTranslations = (translations) => (
  mockFetch({
    key: "translate",
    request: (url, options) => {
      if(!url.includes("/xavier/translations")) { return false; }
      if(options.method !== "GET") { return false; }

      return true;
    },
    response: () => translations
  })
);

export const mockUserCompletedFeedback = (assessmentId, completed = false) => (
  mockFetch({
    key: "user-completed-feedback",
    request: (url, options) => {
      if(!url.includes(`/feedback/assessments/${assessmentId}/status`)) { return false; }
      if(options.method !== "GET") { return false; }
      return true;
    },
    response: () => ({status: completed ? "complete" : "incomplete"})
  })
);

export const mockFeedbackSurvey = (feedbackSurvey, surveyId) => (
  mockFetch({
    key: "feedback-survey",
    request: (url, options) => {
      if(!url.includes("/xavier/graphql")) { return false; }
      if(options.method !== "POST") { return false; }
      if(!options.body) { return false; }

      const variables = dig(JSON.parse(options.body), "variables") || {};

      return variables.surveyId === surveyId;
    },
    response: () => ({data: {feedbackSurvey}})
  })
);

export const useAssessment = (...options) => { beforeEach(() => { mockAssessment(...options); }); };
export const useBenchmark = (...options) => { beforeEach(() => { mockBenchmark(...options); }); };
export const useCareers = (...options) => { beforeEach(() => { mockCareers(...options); }); };
export const useCognitiveAssessment = (...options) => {
  beforeEach(() => { mockCognitiveAssessment(...options); });
};
export const useDeck = (...options) => { beforeEach(() => { mockDeck(...options); }); };
export const useGuide = (...options) => { beforeEach(() => { mockGuide(...options); }); };
export const useHighlightedCareers = (...options) => {
  beforeEach(() => { mockHighlightedCareers(...options); });
};
export const useSettings = (...options) => { beforeEach(() => { mockSettings(...options); }); };
export const useTranslations = (...options) => {
  beforeEach(() => { mockTranslations(...options); });
};
