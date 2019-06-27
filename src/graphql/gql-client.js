export default class GraphQL {
  obj2arg = (function() {
    const _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    const get = function get(object, property, receiver) {
      if(object === null) object = Function.prototype;
      const desc = Object.getOwnPropertyDescriptor(object, property);

      if(desc === undefined) {
        const parent = Object.getPrototypeOf(object);

        if(parent === null) {
          return undefined;
        } else {
          return get(parent, property, receiver);
        }
      } else if("value" in desc) {
        return desc.value;
      } else {
        const getter = desc.get;

        if(getter === undefined) {
          return undefined;
        }

        return getter.call(receiver);
      }
    };

    const set = function set(object, property, value, receiver) {
      const desc = Object.getOwnPropertyDescriptor(object, property);

      if(desc === undefined) {
        const parent = Object.getPrototypeOf(object);

        if(parent !== null) {
          set(parent, property, value, receiver);
        }
      } else if("value" in desc && desc.writable) {
        desc.value = value;
      } else {
        const setter = desc.set;

        if(setter !== undefined) {
          setter.call(receiver, value);
        }
      }

      return value;
    };

    function Enum(value) {
      if(!(this instanceof Enum)) return new Enum(value);
      this.value = value;
    }

    function isString(obj) {
      return typeof obj === "string";
    }

    function isEnum(obj) {
      return obj instanceof Enum;
    }

    function isArray(obj) {
      return Array.isArray(obj);
    }

    function isObject(obj) {
      return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" && obj !== null;
    }

    function isFunction(obj) {
      return typeof obj === "function";
    }

    function escapeString(str) {
      if(!isString(str)) return "";
      return String(str).replace(/\\/gm, "\\\\").replace(/\//gm, "\\/").replace(/\b/gm, "")
        .replace(/\f/gm, "\\f")
        .replace(/\n/gm, "\\n")
        .replace(/\r/gm, "\\r")
        .replace(/\t/gm, "\\t")
        .replace(/"/gm, "\\\"");
    }

    function includes(obj, key) {
      return isArray(obj) && obj.indexOf(key) !== -1;
    }

    function forEach(obj, fn) {
      try {
        if(isArray(obj)) {
          let idx = 0;
          let _iteratorNormalCompletion = true;
          let _didIteratorError = false;
          let _iteratorError;

          try {
            for(var _iterator = obj[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              const val = _step.value;

              if(fn(val, idx) === false)break;
              idx++;
            }
          } catch(err) {
            _didIteratorError = true;
            _iteratorError = err;
          }finally{
            try {
              if(!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            }finally{
              if(_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        } else {
          for(const key in obj) {
            if(fn(obj[key], key) === false)break;
          }
        }
      } catch(err) {

      }
    }

    function map(obj, fn) {
      const output = [];
      forEach(obj, (v, k) => output.push(fn(v, k)));
      return output;
    }

    function circular(obj) {
      const value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "[Circular]";

      const circularEx = function circularEx(_obj) {
        const key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        const seen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        seen.push(_obj);
        if(isObject(_obj)) {
          forEach(_obj, (o, i) => {
            if(includes(seen, o)) _obj[i] = isFunction(value) ? value(_obj, key, seen.slice(0)) : value; else circularEx(o, i, seen.slice(0));
          });
        }
        return _obj;
      };

      if(!obj)throw new Error("circular requires an object to examine");
      return circularEx(obj, value);
    }

    const utils = {
      Enum,
      isString,
      isEnum,
      isArray,
      isObject,
      isFunction,
      escapeString,
      includes,
      forEach,
      map,
      circular
    };

    /*
     * @name - graphql-obj2arg
     * @description - Convert JavaScript a object into a GraphQL argument string
     * @author - Branden Horiuchi <bhoriuchi@gmail.com>
     *
     */
    const ARRAY = "array";
    const BOOLEAN = "boolean";
    const DATE = "date";
    const ENUM = "enum";
    const FLOAT = "float";
    const INT = "int";
    const NULL = "null";
    const NUMBER = "number";
    const OBJECT = "object";
    const STRING = "string";
    const UNDEFINED = "undefined";
    const RX_BOOLEAN = /^Boolean::/;
    const RX_DATE = /^Date::/;
    const RX_ENUM = /^Enum::/;
    const RX_FLOAT = /^Float::/;
    const RX_INT = /^Int::/;
    const RX_OUTER_BRACES = /^{|^\[|\]$|}$/g;

    function getType(obj) {
      if(obj === null) {
        return {obj, type: NULL};
      } else if(obj === undefined) {
        return {obj, type: UNDEFINED};
      } else if(obj instanceof utils.Enum) {
        return {obj: obj.value, type: ENUM};
      } else if((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === STRING) {
        if(obj.match(RX_BOOLEAN)) return {obj: Boolean(obj.replace(RX_BOOLEAN, "")), type: BOOLEAN};
        if(obj.match(RX_DATE)) return {obj: new Date(obj.replace(RX_DATE, "")), type: DATE};
        if(obj.match(RX_ENUM)) return {obj: obj.replace(RX_ENUM, ""), type: ENUM};
        if(obj.match(RX_FLOAT)) return {obj: obj.replace(RX_FLOAT, ""), type: FLOAT};
        if(obj.match(RX_INT)) return {obj: obj.replace(RX_INT, ""), type: INT};
        return {obj, type: STRING};
      } else if((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === BOOLEAN) {
        return {obj, type: BOOLEAN};
      } else if((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === NUMBER) {
        return obj % 1 === 0 ? {obj, type: INT} : {obj, type: FLOAT};
      } else if(Array.isArray(obj)) {
        return {obj, type: ARRAY};
      } else if(obj instanceof Date) {
        return {obj, type: DATE};
      } else if((typeof obj === "undefined" ? "undefined" : _typeof(obj)) === OBJECT) {
        return {obj, type: OBJECT};
      } else {
        return {obj, type: UNDEFINED};
      }
    }

    const toArguments = function toArguments(obj) {
      const options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      const keepNulls = options.keepNulls === true;
      const noOuterBraces = options.noOuterBraces === true;

      const toLiteral = function toLiteral(o) {
        const _getType = getType(o);

        const obj = _getType.obj;

        const type = _getType.type;

        const _ret = (function() {
          switch(type) {
            case ARRAY:
              var arrList = [];
              utils.forEach(obj, (v) => {
                const arrVal = toLiteral(v);
                if(arrVal === NULL && keepNulls || arrVal && arrVal !== NULL) arrList.push(arrVal);
              });
              return {
                v: `[${arrList.join(",")}]`
              };
            case OBJECT:
              var objList = [];
              utils.forEach(obj, (v, k) => {
                const objVal = toLiteral(v);
                if(objVal === NULL && keepNulls || objVal && objVal !== NULL) objList.push(`${k}:${objVal}`);
              });
              return {
                v: `{${objList.join(",")}}`
              };
            case DATE:
              return {
                v: `"${obj.toISOString()}"`
              };
            case FLOAT:
              var s = String(obj);
              return {
                v: s.indexOf(".") === -1 ? `${s}.0` : s
              };
            case NULL:
              return {
                v: NULL
              };
            case STRING:
              return {
                v: `"${utils.escapeString(obj)}"`
              };
            case UNDEFINED:
              return {
                v: undefined
              };
            default:
              return {
                v: String(obj)
              };
          }
        }());

        if((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
      };

      const objStr = toLiteral(utils.circular(obj));
      return noOuterBraces ? objStr.replace(RX_OUTER_BRACES, "") : objStr;
    };

    toArguments.Enum = utils.Enum;
    toArguments.escapeString = utils.escapeString;

    return toArguments;
  }());
  toArgs = (query) => this.obj2arg(query, {noOuterBraces: true});
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
