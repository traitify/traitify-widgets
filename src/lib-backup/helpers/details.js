/* eslint-disable import/prefer-default-export */
export function getDetail({name, personality: {details}}) {
  const {body} = details.find(({title}) => title === name) || {};

  return body;
}
