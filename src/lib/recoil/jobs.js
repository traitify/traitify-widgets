import {noWait, selector, selectorFamily} from "recoil";
import {httpState, optionsState} from "./base";
import {careerState, careersParamsState} from "./career";

const jobsPathState = selector({
  get: ({get}) => {
    const career = get(careerState);
    const options = get(optionsState).career || {};

    if(career?.id && options.jobsPath) { return options.jobsPath(career.id); }

    return null;
  },
  key: "jobs-path"
});

export const jobsQuery = selector({
  get: async({get}) => {
    const career = get(careerState);
    const path = get(jobsPathState);

    if(!career || !path) { return {}; }

    const http = get(httpState);
    const careerParams = get(careersParamsState);

    const params = {};
    if(careerParams.location) { params.location = careerParams.location; }

    const jobs = await http.get(path, params);

    return jobs;
  },
  key: "jobs-request"
});

export const jobsState = selector({
  get: ({get}) => {
    const {inline, source} = get(optionsState)?.career?.jobs || {};
    if(!source || inline) { return {fetching: false, records: []}; }

    const loadable = get(noWait(jobsQuery));
    const {jobs} = loadable.state === "hasValue" ? loadable.contents : [];
    const fetching = loadable.state === "loading";
    return {fetching, records: jobs || []};
  },
  key: "jobs"
});

export const inlineJobsPathState = selectorFamily({
  get: (id) => ({get}) => {
    const options = get(optionsState).career || {};

    if(options.jobsPath) { return options.jobsPath(id); }

    return null;
  },
  key: "inline-jobs-path"
});

export const inlineJobsQuery = selectorFamily({
  get: (id) => async({get}) => {
    const path = get(inlineJobsPathState(id));

    if(!path) return {};

    const http = get(httpState);
    const careerParams = get(careersParamsState);

    const params = {};
    if(careerParams.location) { params.location = careerParams.location; }

    const jobs = await http.get(path, params);

    return jobs;
  },
  key: "inline-jobs-request"
});

export const inlineJobsState = selectorFamily({
  get: (id) => ({get}) => {
    const {inline, source} = get(optionsState)?.career?.jobs || {};
    if(!source || !inline) { return {fetching: false, records: []}; }

    const loadable = get(noWait(inlineJobsQuery(id)));
    const {jobs} = loadable.state === "hasValue" ? loadable.contents : [];
    const fetching = loadable.state === "loading";
    return {fetching, records: jobs || []};
  },
  key: "inline-jobs"
});
