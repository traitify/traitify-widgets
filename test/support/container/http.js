import dig from "lib/common/object/dig";

export const mockFetch = (_newMock) => {
  const newMock = {called: 0, ..._newMock};

  container.http.mocks.fetch.unshift(newMock);
  container.http.fetch.mockImplementation((...options) => {
    const mock = container.http.mocks.fetch.find(({request}) => request(...options));
    if(mock) {
      mock.called += 1;

      if(mock.implementation) { return mock.implementation(mock, ...options); }
      return Promise.resolve({json: () => mock.response(...options)});
    }

    console.error("Unmocked Fetch", options); // eslint-disable-line no-console
    throw new Error("Unmocked Fetch");
  });

  return newMock;
};

export const mockAssessment = (assessment, {id} = {}) => {
  container.assessmentID = id || assessment?.id;

  return mockFetch({
    key: "assessment",
    request: (url, options) => {
      if(!url.includes(`/assessments/${id || assessment.id}`)) { return false; }
      if(options.method !== "GET") { return false; }

      return true;
    },
    response: () => assessment
  });
};

// NOTE: Allow params to be [response, {id}] or {id, implementation}
export const mockAssessmentSlides = (...params) => {
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
    response: () => ({data: {guide}})
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

export const useAssessment = (...options) => { beforeEach(() => { mockAssessment(...options); }); };
export const useBenchmark = (...options) => { beforeEach(() => { mockBenchmark(...options); }); };
export const useCareers = (...options) => { beforeEach(() => { mockCareers(...options); }); };
export const useDeck = (...options) => { beforeEach(() => { mockDeck(...options); }); };
export const useGuide = (...options) => { beforeEach(() => { mockGuide(...options); }); };
export const useHighlightedCareers = (...options) => {
  beforeEach(() => { mockHighlightedCareers(...options); });
};
