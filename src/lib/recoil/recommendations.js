/* eslint-disable import/prefer-default-export */
import {noWait, selector} from "recoil";
import dig from "lib/common/object/dig";
import {assessmentQuery} from "./assessment";

export const recommendationsState = selector({
  get: ({get}) => {
    const loadable = get(noWait(assessmentQuery));
    const assessment = loadable.state === "hasValue" ? loadable.contents : {};
    const recommendations = dig(assessment, "recommendations");

    return recommendations;
  },
  key: "recommendations"
});
