import {atom, noWait, selector, selectorFamily} from "recoil";
import {httpState, optionsState} from "./base";
import {careerState, careersParamsState} from "./career";

export const careerJobsState = atom({key: "career-modal-jobs", default: {fetching: false, jobs: []}});
export const jobOptionsState = atom({key: "job-options", default: {}});

const jobsPathState = selector({
  get: ({get}) => {
    const career = get(careerState);
    const options = get(optionsState).career || {};

    if(options.jobsPath) { return `${options.jobsPath}/${career.id}/jobs`; }

    return `/api/user/careers/${career.id}/jobs`;
  },
  key: "jobs-path"
});

export const jobsQuery = selector({
  get: async({get}) => {
    const career = get(careerState);
    if(!career) { return {}; }

    const http = get(httpState);
    const path = get(jobsPathState);
    const careerParams = get(careersParamsState);

    const params = {};
    careerParams.location && (params.location = careerParams.location);

    const jobs = await http.get(path, params);

    return jobs;
  },
  key: "jobs-request"
});

export const jobsState = selector({
  get: ({get}) => {
    const {inline_jobs: inlineJobs, job_source: jobSource} = get(jobOptionsState);
    const isActive = jobSource && !inlineJobs;

    const loadable = isActive ? get(noWait(jobsQuery)) : {};
    const {jobs} = loadable.state === "hasValue" ? loadable.contents : [];
    const fetching = loadable.state === "loading";
    return {fetching, jobs: jobs || []};
  },
  key: "jobs"
});

export const inlineJobsPathState = selectorFamily({
  get: (id) => ({get}) => {
    const options = get(optionsState).career || {};

    if(options.jobsPath) { return `${options.jobsPath}/${id}/jobs`; }

    return `/api/user/careers/${id}/jobs`;
  },
  key: "inline-jobs-path"
});
export const inlineJobsQuery = selectorFamily({
  get: (id) => async({get}) => {
    if(!id) { return {}; }

    const http = get(httpState);
    const path = get(inlineJobsPathState(id));
    const careerParams = get(careersParamsState);

    const params = {};
    careerParams.location && (params.location = careerParams.location);

    const jobs = await http.get(path, params);

    return jobs;
  },
  key: "inline-jobs-request"
});
export const inlineJobsState = selectorFamily({
  get: (id) => ({get}) => {
    const {inline_jobs: inlineJobs, job_source: jobSource} = get(jobOptionsState);
    const isActive = jobSource && inlineJobs;

    const loadable = isActive ? get(noWait(inlineJobsQuery(id))) : {};
    const {jobs} = loadable.state === "hasValue" ? loadable.contents : [];
    const fetching = loadable.state === "loading";
    return {fetching, jobs: jobs || []};
  },
  key: "inline-jobs"
});
