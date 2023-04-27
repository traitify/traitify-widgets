import capitalize from "lib/common/string/capitalize";

const detailsFrom = ({name, personality}) => {
  let details = personality.details
    .filter(({title}) => title === name)
    .map(({body}) => body);
  if(details.length > 0) { return details; }
  if(name.includes(" ")) { return details; }

  details = personality[name.toLowerCase()] || [];
  if(!Array.isArray(details)) { details = [details]; }

  return details.map((detail) => detail.title || detail.name || detail);
};

const detailsFromPerspective = ({name, personality, perspective: _perspective}) => {
  const perspective = _perspective.replace("Person", "");
  const options = [
    `${perspective}_person_${name.toLowerCase()}`,
    `${capitalize(perspective)} Person ${capitalize(name)}`
  ];

  return personality.details
    .filter(({title}) => options.includes(title))
    .map(({body}) => body);
};

export default function getDetails(options) {
  const {fallback = true, perspective} = options;
  if(!perspective) { return detailsFrom(options); }

  let details = detailsFromPerspective(options);
  if(details.length > 0) { return details; }

  details = detailsFrom(options);
  if(details.length > 0 || !fallback) { return details; }

  return detailsFromPerspective({...options, perspective: perspective === "thirdPerson" ? "firstPerson" : "thirdPerson"});
}
