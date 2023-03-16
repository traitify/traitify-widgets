import {atom, selector} from "recoil";
import {
  assessmentIDState,
  httpState,
  localeState,
  optionsState
} from "./base";

export const careerState = atom({key: "career"});
export const careerModalShowState = atom({key: "career-modal-show", default: false});
export const careersParamsState = atom({
  default: selector({
    get: ({get}) => {
      const options = get(optionsState).career || {};

      // TODO: Page?
      return {
        careers_per_page: options.perPage || 20,
        locale_key: get(localeState),
        paged: true
      };
    },
    key: "careers-params/default"
  }),
  key: "careers-params"
});

const careersPathState = selector({
  get: ({get}) => {
    const options = get(optionsState).career || {};
    if(options.path) { return options.path; }

    const assessmentID = get(assessmentIDState);
    if(!assessmentID) { return null; }

    return `/assessments/${assessmentID}/matches/careers`;
  },
  key: "careers-path"
});

// TODO: Put cache in front of queries with ability to bust it
export const careersQuery = selector({
  get: async({get}) => {
    const http = get(httpState);
    const params = get(careersParamsState);
    const path = get(careersPathState);
    const response = await http.post(path, params);

    // TODO: Return request states
    // TODO: Combine current and previous if page > 1
    // TODO: Return if moreCareers
    return response;
  },
  key: "careers"
});

export const highlightedCareersParamsState = selector({
  get: ({get}) => {
    const {page, ...params} = get(careersParamsState);

    return params;
  },
  key: "highlighted-careers-params"
});

export const highlightedCareersQuery = selector({
  get: async({get}) => {
    const options = get(optionsState).career || {};
    const path = options.highlightedPath;
    if(!path) { return null; }

    const http = get(httpState);
    const params = get(highlightedCareersParamsState);
    const response = await http.post(path, params);

    // TODO: Return request states
    // TODO: Return if moreCareers
    return response;
  },
  key: "highlighted-careers"
});
