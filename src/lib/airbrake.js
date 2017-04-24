    
class Airbrake {

    jsonifyNotice(notice, maxLength) {
        function truncateObj(obj, level) {
            var dst = {};
            for (var attr in obj) {
                dst[attr] = truncate(obj[attr], level);
            }
            return dst;
        }
        var Truncator = (function () {
            function Truncator(level) {
                if (level === void 0) { level = 0; }
                this.maxStringLength = 1024;
                this.maxObjectLength = 128;
                this.maxArrayLength = 32;
                this.maxDepth = 8;
                this.keys = [];
                this.seen = [];
                for (var i = 0; i < level; i++) {
                    if (this.maxStringLength > 1) {
                        this.maxStringLength /= 2;
                    }
                    if (this.maxObjectLength > 1) {
                        this.maxObjectLength /= 2;
                    }
                    if (this.maxArrayLength > 1) {
                        this.maxArrayLength /= 2;
                    }
                    if (this.maxDepth > 1) {
                        this.maxDepth /= 2;
                    }
                }
            }
            Truncator.prototype.truncate = function (value, key, depth) {
                if (key === void 0) { key = ''; }
                if (depth === void 0) { depth = 0; }
                if (value === null || value === undefined) {
                    return value;
                }
                switch (typeof value) {
                    case 'boolean':
                    case 'number':
                    case 'function':
                        return value;
                    case 'string':
                        return this.truncateString(value);
                    case 'object':
                        break;
                    default:
                        return String(value);
                }
                if (value instanceof String) {
                    return this.truncateString(value.toString());
                }
                if (value instanceof Boolean ||
                    value instanceof Number ||
                    value instanceof Date ||
                    value instanceof RegExp) {
                    return value;
                }
                if (value instanceof Error) {
                    return value.toString();
                }
                if (this.seen.indexOf(value) >= 0) {
                    return "[Circular " + this.getPath(value) + "]";
                }
                var type = objectType(value);
                depth++;
                if (depth > this.maxDepth) {
                    return "[Truncated " + type + "]";
                }
                this.keys.push(key);
                this.seen.push(value);
                switch (type) {
                    case 'Array':
                        return this.truncateArray(value, depth);
                    case 'Object':
                        return this.truncateObject(value, depth);
                    default:
                        var saved = this.maxDepth;
                        this.maxDepth = 0;
                        var obj = this.truncateObject(value, depth);
                        obj.__type = type;
                        this.maxDepth = saved;
                        return obj;
                }
            };
            Truncator.prototype.getPath = function (value) {
                var index = this.seen.indexOf(value);
                var path = [this.keys[index]];
                for (var i = index; i >= 0; i--) {
                    var sub = this.seen[i];
                    if (sub && getAttr(sub, path[0]) === value) {
                        value = sub;
                        path.unshift(this.keys[i]);
                    }
                }
                return '~' + path.join('.');
            };
            Truncator.prototype.truncateString = function (s) {
                if (s.length > this.maxStringLength) {
                    return s.slice(0, this.maxStringLength) + '...';
                }
                return s;
            };
            Truncator.prototype.truncateArray = function (arr, depth) {
                var length = 0;
                var dst = [];
                for (var i in arr) {
                    var el = arr[i];
                    length++;
                    if (length >= this.maxArrayLength) {
                        break;
                    }
                    dst.push(this.truncate(el, i, depth));
                }
                return dst;
            };
            Truncator.prototype.truncateObject = function (obj, depth) {
                var length = 0;
                var dst = {};
                for (var attr in obj) {
                    var value = getAttr(obj, attr);
                    if (value === undefined || typeof value === 'function') {
                        continue;
                    }
                    length++;
                    if (length >= this.maxObjectLength) {
                        break;
                    }
                    dst[attr] = this.truncate(value, attr, depth);
                }
                return dst;
            };
            return Truncator;
        }());
        function truncate(value, level) {
            var t = new Truncator(level);
            return t.truncate(value);
        }
        exports.truncate = truncate;
        function getAttr(obj, attr) {
            // Ignore browser specific exception trying to read attribute (#79).
            try {
                return obj[attr];
            }
            catch (_) {
                return;
            }
        }
        function objectType(obj) {
            var s = Object.prototype.toString.apply(obj);
            return s.slice('[object '.length, -1);
        }






        if (maxLength === void 0) { maxLength = 64000; }
        var s = '';
        for (var level = 0; level < 8; level++) {
            notice.context = truncateObj(notice.context, level);
            notice.params = truncateObj(notice.params, level);
            notice.environment = truncateObj(notice.environment, level);
            notice.session = truncateObj(notice.session, level);
            s = JSON.stringify(notice);
            if (s.length < maxLength) {
                return s;
            }
        }
        var err = new Error("airbrake-js: cannot jsonify notice (length=" + s.length + " maxLength=" + maxLength + ")");
        err.params = {
            json: s.slice(0, Math.floor(maxLength / 2)) + '...',
        };
        throw err;
    }
    notify(){
        let p = {};
        let promise = new Promise((resolve, reject)=>{
            p.resolve = resolve;
            p.reject = reject;
        })
        promise.resolve = p.resolve;
        promise.reject = p.reject;
        let notice = this.params()
        this.constructor.cbCount = this.constructor.cbCount || 0;
        this.constructor.cbCount += 1;
        let cbCount = this.constructor.cbCount;
        var cbName = 'airbrakeCb' + String(cbCount);
        window[cbName] = function (resp) {
            try {
                delete window[cbName];
            }
            catch (_) {
                window[cbName] = undefined;
            }
            if (resp.id) {
                notice.id = resp.id;
                promise.resolve(notice);
                return;
            }
            if (resp.error) {
                var err_1 = new Error(resp.error);
                promise.reject(err_1);
                return;
            }
            var err = new Error(resp);
            promise.reject(err);
        };
        var payload = encodeURIComponent(this.jsonifyNotice(notice));
        var url = this.host + "/api/v3/projects/" + this.projectId + "/create-notice?key=" + this.projectKey + "&callback=" + cbName + "&body=" + payload;
        var document = window.document;
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = url;
        script.onload = function () { return head.removeChild(script); };
        script.onerror = function () {
            head.removeChild(script);
            var err = new Error('airbrake: JSONP script error');
            promise.reject(err);
        };
        head.appendChild(script);
        return promise;
    }
}
Airbrake.cbCount = 0;
export default Airbrake;