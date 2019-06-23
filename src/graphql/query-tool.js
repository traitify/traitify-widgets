window.obj2arg = (function() {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

window.GraphQL = {};
GraphQL.toArgs = query => obj2arg(query, {noOuterBraces: true});
GraphQL.toQuery = function(object) {
  if (Array.isArray(object)) {
    return object.map(value => GraphQL.toQuery(value)).join(" ");
  } else if (typeof object === "object") {
    return Object.keys(object).map(key => `${key} { ${GraphQL.toQuery(object[key])} }`).join(" ");
  } else {
    return object;
  }
};

GraphQL.toNodeID = (type, id) => btoa(unescape(encodeURIComponent(`${type}:${id}`)));
GraphQL.toPaginationQuery = function(query) {
  if (!query) { return {}; }
  if (!query.length) { return query; }

  query[query.before ? "last" : "first"] = query.length;
  delete query.length;

  return query;
};