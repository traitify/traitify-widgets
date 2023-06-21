import {atom, atomFamily, noWait, selector, selectorFamily} from "recoil";
import except from "lib/common/object/except";
import {
  personalityAssessmentIDState,
  httpState,
  localeState,
  optionsState
} from "./base";

export const currentCareerIDState = atom({key: "current-career-id", default: null});
export const careerModalShowState = atom({key: "career-modal-show", default: false});
export const careersParamsState = atom({
  default: selector({
    get: ({get}) => {
      const options = get(optionsState).career || {};
      const params = {
        careers_per_page: options.perPage || 20,
        locale_key: get(localeState),
        page: 1,
        paged: true,
        sort: "match"
      };

      if(options.experienceLevels) { params.experience_levels = options.experienceLevels.join(","); }

      return params;
    },
    key: "careers-params/default"
  }),
  key: "careers-params"
});

const careersPathState = selector({
  get: ({get}) => {
    const options = get(optionsState).career || {};
    if(options.path) { return options.path; }

    const assessmentID = get(personalityAssessmentIDState);
    if(!assessmentID) { return null; }

    return `/assessments/${assessmentID}/matches/careers`;
  },
  key: "careers-path"
});

export const careersQuery = selector({
  get: async({get}) => {
    const http = get(httpState);
    const params = get(careersParamsState);
    const path = get(careersPathState);
    if(!path) { return {}; }

    const records = await http.get(path, params);

    return {params, records};
  },
  key: "careers-request"
});

export const careersState = selector({
  get: ({get}) => {
    const loadable = get(noWait(careersQuery));
    const {params, records} = loadable.state === "hasValue" ? loadable.contents : {};
    const fetching = loadable.state === "loading";

    return {fetching, params, records};
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
    if(!path) { return {}; }

    const http = get(httpState);
    const params = get(highlightedCareersParamsState);
    const records = await http.get(path, params);

    return {params, records};
  },
  key: "highlighted-careers-request"
});

export const highlightedCareersState = selector({
  get: ({get}) => {
    const loadable = get(noWait(highlightedCareersQuery));
    const {params, records} = loadable.state === "hasValue" ? loadable.contents : {};
    const fetching = loadable.state === "loading";

    return {fetching, params, records};
  },
  key: "highlighted-careers"
});

// NOTE: Allows setting a career from an external source but defaults to our career stores
export const careerState = atomFamily({
  default: selectorFamily({
    get: (id) => ({get}) => {
      let records = get(careersState).records || [];
      let record = records.find(({career: {id: recordID}}) => id === recordID);
      if(record) { return {...record.career, ...except(record, "career")}; }

      records = get(highlightedCareersState).records || [];
      record = records.find(({career: {id: recordID}}) => id === recordID);
      if(record) { return {...record.career, ...except(record, "career")}; }
    },
    key: "career/default"
  }),
  key: "career"
});

export const currentCareerState = selector({
  get: ({get}) => {
    const id = get(currentCareerIDState);

    return get(careerState(id));
  },
  key: "current-career"
});
