/* eslint-disable import/prefer-default-export */
import {noWait, selector} from "recoil";
import {orderState} from "./order";

export const assessmentsState = selector({
  get: ({get}) => {
    const loadable = get(noWait(orderState));
    if(loadable.state !== "hasValue") { return null; }

    return loadable.contents?.assessments;
  },
  key: "assessments"
});
