/* eslint-disable import/prefer-default-export */
import {selector} from "recoil";
import {orderState} from "./order";

export const assessmentsState = selector({
  get: ({get}) => {
    const order = get(orderState);
    if(!order) { return null; }

    return order.assessments;
  },
  key: "assessments"
});
