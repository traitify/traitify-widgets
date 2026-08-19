import {v7 as uuid} from "uuid";

export const chainRequestID = (widgetID) => `${widgetID}.${uuid().slice(-6)}`;
export const generateWidgetID = () => `widget-${uuid()}`;
