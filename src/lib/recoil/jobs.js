import {noWait, selector, selectorFamily} from "recoil";
import {httpState, optionsState} from "./base";
import {careerState, careersParamsState, currentCareerIDState} from "./career";

const jobsPathState = selectorFamily({
  get: (id) => ({get}) => {
    const {path} = get(optionsState).career?.jobs || {};
    if(!path) { return null; }
    if(typeof path === "string") { return path; }

    return path({career: get(careerState(id))});
  },
  key: "jobs-path"
});

export const jobsQuery = selectorFamily({
  get: (id) => async({get}) => {
    const path = get(jobsPathState(id));
    if(!path) { return null; }

    const http = get(httpState);
    const {location} = get(careersParamsState) || {};
    const params = {};
    if(location) { params.location = location; }

    const response = await http.get(path, params);
    const request = {params};
    if(!response) { return request; }
    if(Array.isArray(response)) { return {...request, records: response}; }
    if(Object.hasOwn(response, "records")) { return {...request, records: response.records}; }
    if(Object.hasOwn(response, "jobs")) { return {...request, records: response.jobs}; }

    return request;
  },
  key: "jobs-request"
});

const createHideState = () => ({fetching: false, hide: true, records: []});

export const jobsState = selectorFamily({
  get: (id) => ({get}) => {
    const loadable = get(noWait(jobsQuery(id)));
    const request = loadable.state === "hasValue" ? loadable.contents : {};
    const fetching = loadable.state === "loading";
    if(request) { return {fetching, ...request}; }

    const career = get(careerState(id)) || {};
    if(!Object.hasOwn(career, "jobs")) { return createHideState(); }

    return {fetching: false, records: career.jobs};
  },
  key: "jobs"
});

export const inlineJobsState = selectorFamily({
  get: (id) => ({get}) => {
    const {inline} = get(optionsState).career?.jobs || {};
    if(!inline) { return createHideState(); }

    return get(noWait(jobsState(id)));
  },
  key: "inline-jobs"
});

export const modalJobsState = selector({
  get: ({get}) => {
    const id = get(currentCareerIDState);
    const {inline} = get(optionsState).career?.jobs || {};
    if(!id || inline) { return createHideState(); }

    return get(noWait(jobsState(id)));
  },
  key: "modal-jobs"
});
