export const mockFetch = (newMock) => {
  container.http.mocks.fetch.unshift(newMock);
  container.http.fetch.mockImplementation((...options) => {
    const mock = container.http.mocks.fetch.find(({request}) => request(...options));
    if(mock) { return Promise.resolve({json: () => mock.response(...options)}); }

    console.error("Unmocked Fetch", options); // eslint-disable-line no-console
    throw new Error("Unmocked Fetch");
  });
};

export const mockAssessment = (assessment, {id} = {}) => {
  container.assessmentID = id || assessment?.id;

  mockFetch({
    key: "assessment",
    request: (url, options) => {
      if(!url.includes(`/assessments/${id || assessment.id}`)) { return false; }
      if(options.method !== "GET") { return false; }

      return true;
    },
    response: () => assessment
  });
};

export const mockDeck = (deck, {id} = {}) => {
  mockFetch({
    key: "deck",
    request: (url, options) => {
      if(!url.includes(`/decks/${id || deck.id}`)) { return false; }
      if(options.method !== "GET") { return false; }

      return true;
    },
    response: () => deck
  });
};

export const useAssessment = (...options) => {
  beforeEach(() => { mockAssessment(...options); });
};

export const useDeck = (...options) => {
  beforeEach(() => { mockDeck(...options); });
};
