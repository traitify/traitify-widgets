import {isArray, isNumber, isObject, isString} from "lib/common/object/type";

export function errorsToText(prepend, _errors) {
  const errors = Array.isArray(_errors) ? _errors : [_errors];
  const text = errors.join("; ");

  return `${prepend}: ${text}`;
}

export function getResponseErrors(response) {
  if(isObject(response) && isArray(response.errors)) { return response.errors; }
  if(isObject(response) && isString(response.errors)) { return [response.errors]; }
  if(isObject(response) && isString(response.error)) { return [response.error]; }
  if(isObject(response) && isString(response.errorMessage)) { return [response.errorMessage]; }
  if(isString(response)) { return [response]; }

  return ["Unknown Errors"];
}

export function getResponseStatus(response) {
  if(isObject(response) && isNumber(response.status)) { return response.status; }

  return "Unknown Status";
}

export function responseToErrors({method, path, response}) {
  return errorsToText(`${method} - ${path} - ${getResponseStatus(response)}`, getResponseErrors(response));
}
