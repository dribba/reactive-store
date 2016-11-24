(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("lodash"));
	else if(typeof define === 'function' && define.amd)
		define(["lodash"], factory);
	else if(typeof exports === 'object')
		exports["reactive-store"] = factory(require("lodash"));
	else
		root["reactive-store"] = factory(root["lodash"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(1);
	var Dict = __webpack_require__(2);
	var Notifier = __webpack_require__(4);
	var ReactiveContext = __webpack_require__(5);
	var Dependency = __webpack_require__(6);

	function ReactiveStore() {
	    "use strict";

	    var dict = Dict();
	    var debug;

	    function convertToDotNotation(key) {
	        return key.replace(/\[([0-9]*)\]/g, '.$1'); // replace [] array syntax with dot notation
	    }

	    var that = {
	        clearChildren: function clearChildren(key) {
	            dict.clearChildren(key);
	            Notifier(dict).add(key).flush();
	        },
	        set: function set(key, val) {
	            debug && console.log('set(' + key + ', ' + val + ')');
	            var notifier = Notifier(dict);
	            set(key, val);
	            notifier.flush();

	            function set(key, val) {
	                if (key === undefined) {
	                    throw new Error("Can not get value of undefined key");
	                }
	                key = convertToDotNotation(key);

	                if (JSON.stringify(val) !== JSON.stringify(dict.get(key))) {
	                    _.flattenDeep(dict.set(key, val)).forEach(notifier.add);
	                }
	            }
	        },
	        get: function get(key) {
	            debug && console.log('get(' + key + ')');
	            if (key === undefined) {
	                throw new Error("Can not get value of undefined key");
	            }
	            key = convertToDotNotation(key);
	            var val = dict.get(key);

	            if (ReactiveContext.current) {
	                var dep = Dependency();
	                dep.depend();
	                dict.addDependency(key, dep);
	            }

	            return val;
	        },

	        dump: function dump(key) {
	            debug && console.log('dump(' + key + ')');
	            if (key === undefined) {
	                return dict.dump();
	            }

	            key = convertToDotNotation(key);
	            return dict.dump(key);
	        },

	        load: dict.load,

	        autorun: ReactiveContext.autorun,
	        nonReactive: ReactiveContext.nonReactive,
	        raw: dict.raw,
	        wipe: dict.wipe,
	        debug: {
	            on: function on() {
	                debug = true;
	            },
	            off: function off() {
	                debug = false;
	            }
	        }
	    };
	    return that;
	};

	module.exports = ReactiveStore;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var MetaStore = __webpack_require__(3);
	var _ = __webpack_require__(1);

	module.exports = function () {
	    var that = {};
	    var store = MetaStore();
	    that.raw = store.raw;
	    that.delete = store.delete;
	    that.dump = store.dump;
	    that.load = store.load;
	    that.set = store.setValue;
	    that.get = function (key, dflt) {
	        var value = store.getValue(key);
	        if (value === undefined) {
	            return dflt;
	        }
	        return value;
	    };
	    that.wipe = store.wipe;
	    that.addDependency = function (key, dep) {
	        var deps = store.getMeta(key, 'deps');
	        store.setMeta(key, { deps: deps ? deps.concat(dep) : [dep] });
	    };

	    that.getDependencies = function (key) {
	        return store.getMeta(key, 'deps') || [];
	    };
	    that.clearChildren = function (key) {
	        _.keys(that.get(key)).forEach(function (k) {
	            return store.delete(key + '.' + k);
	        });
	    };

	    return that;
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(1);

	// This is the structure of the store
	var ___store = {
	    a: {
	        b: {
	            __value: 2,
	            __meta: {}
	        },
	        c: {
	            __value: 3,
	            __meta: {}
	        },
	        __meta: {}
	    }
	};

	module.exports = function () {
	    var store = {};
	    var that = {};
	    that.wipe = function () {
	        return store = {};
	    };
	    that.raw = function () {
	        return store;
	    };
	    that.dump = function (startKey) {

	        if (startKey) return that.getValue(startKey, false);

	        var out = _.keys(store).reduce(function (memo, k) {
	            memo[k] = that.getValue(k);
	            return memo;
	        }, {});
	        convertDatesToStrings(out);
	        return out;

	        function convertDatesToStrings(out) {
	            _.each(out, function (v, k) {
	                _.isDate(v) && (out[k] = v.toISOString());
	                _.isPlainObject(v) && convertDatesToStrings(v);
	            });
	        }
	    };

	    that.load = function (obj) {
	        convertDateStringsToDates(obj);
	        _.each(obj, function (v, k) {
	            return that.setValue(k, v);
	        });

	        function convertDateStringsToDates(obj) {
	            _.each(obj, function (v, k) {
	                /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})/.test(v) && (obj[k] = new Date(v));
	            });
	        }
	    };

	    that.delete = function (key) {
	        key.split('.').reduce(function (memo, it, idx) {
	            var obj = memo[it];
	            obj && idx === key.split('.').length - 1 && delete memo[it];
	            return memo[it];
	        }, store);
	    };

	    that.setMeta = function (key, data) {
	        var leaf = that.getLeaf(key);
	        leaf.__meta = leaf.__meta || {};

	        _.extend(leaf.__meta, data);
	    };

	    that.getMeta = function (key, name) {
	        var leaf = that.getLeaf(key);
	        return leaf.__meta ? name ? leaf.__meta[name] : leaf.__meta : undefined;
	    };

	    that.setValue = function (key, value) {
	        if (_.isArray(value)) {
	            that.setMeta(key, { type: 'array' });
	            clearExtraArrayValues();
	            return [key].concat(value.map(function (it, idx) {
	                return that.setValue(key + '.' + idx, it);
	            }));
	        }

	        if (isArrayElement(key, value)) {
	            that.setMeta(getParentKey(key), { type: 'array' });
	        }

	        if (_.isPlainObject(value)) {
	            that.setMeta(key, { type: 'object' });
	            return [key].concat(Object.keys(value).map(function (k) {
	                return that.setValue(key + '.' + k, value[k]);
	            }));
	        }

	        if (value === undefined) {
	            _.keys(that.getValue(key)).forEach(function (k) {
	                return that.delete(key + '.' + k);
	            });
	        }

	        that.setMeta(key, { type: 'plain' });
	        that.getLeaf(key).__value = value;
	        return [key];

	        function clearExtraArrayValues() {
	            var curr = that.getValue(key);
	            if (_.isArray(curr)) {
	                var extra = curr.length - value.length;
	                if (extra > 0) {
	                    for (var i = value.length; i < value.length + extra; i++) {
	                        that.delete(key + '.' + i);
	                    }
	                }
	            }
	        }

	        function isArrayElement(key, value) {
	            if (_.isArray(value)) {
	                return true;
	            }
	            var parts = key.split('.');
	            if (parts.length > 1 && isNaN(_.last(parts)) === false) {
	                var parentKey = getParentKey(key);
	                var candidate = that.getValue(parentKey);
	                var keys = Object.keys(candidate);
	                return _.isEmpty(keys) === false && Object.keys(candidate).every(function (v, idx) {
	                    return parseInt(v) === idx;
	                });
	            }
	            return false;
	        }
	    };

	    function getParentKey(key) {
	        var parts = key.split('.');
	        if (parts.length === 1) {
	            return undefined;
	        }
	        return _.initial(key.split('.')).join('.');
	    }

	    that.getValue = function (key) {
	        var create = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	        var leaf = that.getLeaf(key, create);

	        if (leaf === undefined) {
	            return undefined;
	        }

	        var value = leaf.__value;
	        var type = leaf.__meta ? leaf.__meta.type : undefined;
	        var props = getProps(leaf);

	        if (type === undefined && props.length === 0) {
	            return undefined;
	        }

	        if (value !== undefined) {
	            return value;
	        }

	        if (props.length === 0 && type !== 'object' && type !== 'array') {
	            return undefined;
	        }

	        if (that.getMeta(key, 'type') === 'array') {
	            return props.reduce(function (out, idx) {
	                var value = that.getValue(key + '.' + idx);
	                value && out.push(value);
	                return out;
	            }, []);
	        }

	        return props.reduce(function (memo, prop) {
	            var val = that.getValue(key + '.' + prop);
	            val !== undefined && (memo[prop] = val);
	            return memo;
	        }, {});
	    };

	    that.getLeafIfExists = function (key) {
	        return that.getLeaf(key, false);
	    };

	    that.getLeaf = function (key) {
	        var create = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

	        var parts = key.split('.');

	        // try is a cheap way to break the reduce if we are not creating objects as we go
	        try {
	            return parts.reduce(function (storeObj, part, idx) {
	                if (!storeObj[part]) {
	                    create && (storeObj[part] = {});
	                }
	                return storeObj[part];
	            }, store);
	        } catch (e) {
	            return undefined;
	        }
	    };

	    that.getLeafs = function (key) {
	        var root = that.getLeafIfExists(key);
	        return root ? _.flattenDeep(walk(root)) : [];

	        function walk(root) {
	            return getProps(root).reduce(function (leafs, prop) {
	                var child = root[prop];
	                isLeaf(child) ? leafs.push(child) : leafs.push(walk(child));
	                return leafs;
	            }, []);
	        }
	    };

	    return that;

	    function getProps(leaf) {
	        return _.without(_.keys(leaf), '__value', '__meta');
	    }

	    function isLeaf(candidate) {
	        return candidate.__value !== undefined && getProps(candidate).length === 0;
	    }
	};

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function Notifier(dict) {
	    var keysToNotify = new Set();

	    var that = {
	        add: function add(key) {
	            keysToNotify.add(key);
	            return that;
	        },
	        flush: function flush() {
	            var deps = new Set();
	            var keys = keysToNotify;
	            keysToNotify = new Set();

	            Array.from(keys).forEach(getDeps);
	            Array.from(deps).forEach(function (dep) {
	                return dep.changed();
	            });

	            function getDeps(key) {
	                while (key.length) {
	                    dict.getDependencies(key).forEach(deps.add.bind(deps));
	                    if (key.indexOf('.') !== -1) {
	                        key = key.replace(/\.[^\.]*$/, '');
	                    } else {
	                        key = '';
	                    }
	                }
	            }
	        }
	    };
	    return that;
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(1);

	var ReactiveContext = module.exports = function (fn) {
	    var deps = [];

	    var prop = function prop(key) {
	        return function (obj) {
	            return key in obj ? obj[key] : undefined;
	        };
	    };

	    var that = {
	        fn: fn,
	        flush: function flush() {
	            deps.length && _.some(deps, prop('invalid')) && that.run(false);
	        },
	        addDependency: function addDependency(dep) {
	            deps.indexOf(dep) === -1 && deps.push(dep);
	        },
	        run: function run(opts) {
	            deps = [];
	            var prevContext = ReactiveContext.current;
	            ReactiveContext.current = that;
	            fn(opts);
	            ReactiveContext.current = prevContext;
	        }
	    };
	    return that;
	};

	ReactiveContext.flushAll = function () {
	    ReactiveContext.list.forEach(function (c) {
	        return c.flush();
	    });
	};

	ReactiveContext.autorun = function (fn) {
	    var ctx = _.find(ReactiveContext.list, { fn: fn });
	    if (ctx) {
	        ctx.run(false);
	    } else {
	        ctx = ReactiveContext(fn);
	        ctx.run(true);
	        ReactiveContext.list.push(ctx);
	    }
	    return {
	        stop: function stop() {
	            ReactiveContext.list = _.without(ReactiveContext.list, ctx);
	        }
	    };
	};

	ReactiveContext.nonReactive = function (fn) {
	    var prevContext = ReactiveContext.current;
	    ReactiveContext.current = undefined;
	    fn();
	    ReactiveContext.current = prevContext;
	};

	ReactiveContext.list = [];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ReactiveContext = __webpack_require__(5);

	module.exports = function Dependency() {
	    var that = {
	        changed: function changed() {
	            that.invalid = true;
	            ReactiveContext.flushAll();
	        },
	        depend: function depend() {
	            ReactiveContext.current && ReactiveContext.current.addDependency(that);
	        }
	    };
	    return that;
	};

/***/ }
/******/ ])
});
;