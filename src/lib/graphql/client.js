import obj2arg from "graphql-obj2arg";

export default class GraphQL {
  toArgs = (query) => obj2arg(query, {noOuterBraces: true});
  toQuery = function(object) {
    if(Array.isArray(object)) {
      return object.map((value) => this.toQuery(value)).join(" ");
    } else if(typeof object === "object") {
      return Object.keys(object).map((key) => `${key} { ${this.toQuery(object[key])} }`).join(" ");
    } else {
      return object;
    }
  };
}
