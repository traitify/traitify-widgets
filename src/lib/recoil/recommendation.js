/* eslint-disable import/prefer-default-export */
import {selector} from "recoil";
import {benchmarkIDState} from "./base";
import {recommendationsState} from "./recommendations";

export const recommendationState = selector({
  get: ({get}) => {
    const benchmarkID = get(benchmarkIDState);
    if(!benchmarkID) { return null; }

    const recommendations = get(recommendationsState) || [];
    return recommendations.find(({recommendation_id: id}) => id === benchmarkID);
  },
  key: "recommendation"
});
