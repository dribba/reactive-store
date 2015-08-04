var _ = require('lodash');
var R = require('ramda');

var ReactiveStore = function () {
    "use strict";
    var currentContext;
    var dict = {};
    var debug;

    var contextList = [];

    function Context(fn) {
        var deps = [];

        var that = {
            fn: fn,
            flush: function () {
                _.some(deps, R.prop('invalid')) && that.run(false);
            },
            addDependency: function (dep) {
                deps.indexOf(dep) === -1 && deps.push(dep);
            },
            run: function (opts) {
                deps = [];
                var prevContext = currentContext;
                currentContext = that;
                fn(opts);
                currentContext = prevContext;
            }
        };
        return that;
    }

    Context.flush = function () {
        contextList.forEach(function(c) {
            c.flush();
        });
    };

    function Dependency() {
        var that = {
            changed: function () {
                that.invalid = true;
                Context.flush();
            },
            depend: function () {
                currentContext && currentContext.addDependency(that);
            }
        };
        return that;
    }

    function getFromDict(key, dflt) {
        var keys = _.filter(_.keys(dict), function (k) {
            return k === key || k.indexOf(key + '.') === 0;
        });

        if (keys.length === 0) {
            return dict[key] = {value: dflt, deps: []};
        }

        if (keys.length === 1 && keys[0] === key) {
            return dict[key];
        }

        dict[key] = dict[key] || {value: undefined, deps: []};  // Need this to have a deps for this key

        return isArray(keys) ? array() : object();


        function array() {
            return _.reduce(keys, function(ret, k) {
                var propName = k.replace(key + '.', '');
                var value = dict[k].value;
                if(value !== undefined) {
                    var idx = _.last(k.split('.'));
                    ret.value[idx] = value;
                }
                return ret;
            }, {value:[], deps: dict[key].deps});
        }

        function object() {
            return _.reduce(keys, function (ret, k) {
                if(k === key) {
                    return ret;
                }
                var propName = k.replace(key + '.', '');
                var value = dict[k].value;
                if (value !== undefined) {
                    _.set(ret.value, propName, value);
                }
                return ret;
            }, {value: {}, deps: dict[key].deps});
        }

        function isArray(keys) {
            return _.every(keys, function(key, idx) {
                var itemIdx = key.replace(/^[^[\.]*\.([0-9]*)$/, '$1');
                return itemIdx === idx + '';    // indexes are numeric and contiguous
            });
        }
    }

    function notify(key) {
        var deps = [];
        while(key.length) {
            if(dict[key]) {
                deps = deps.concat(dict[key].deps);
                dict[key].deps = [];
            }
            if(key.indexOf('.') !== -1) {
                key = key.replace(/\.[^\.]*$/, '');
            } else {
                key = '';
            }
        }

        _.each(deps, function(dep) {
            dep.changed();
        });
    }

    var that = {
        clearChildren: function(key) {
            _.each(_.keys(that.dump()), function(k) {
                key !== k && _.startsWith(k, key) && dict[k].deps.length === 0 && (delete dict[k]);
            });
        },
        set: function (key, val) {
            debug && console.log('set('+key+', '+val+')');
            _.isPlainObject(val) ? setObject() : (_.isArray(val) ? setArray() : setValue());


            function setObject() {
                _.each(val, function(v, k) {
                    that.set(key+'.'+k, v);
                });
                getFromDict(key).dflt = {};
                _.keys(val).length === 0 && notify(key); // notify on empty object being stored
            }

            function setArray() {
                that.clearChildren(key);
                _.each(val, function(v, idx) {
                    that.set(key+'.'+idx, v);
                });
                getFromDict(key).dflt = [];
                val.length === 0 && notify(key);    // notify if storing an empty array
            }

            function setValue() {
                var obj = getFromDict(key);
                if(obj.value !== val) {
                    obj.value = val;
                    obj.dflt = undefined;
                    notify(key);
                }
            }
        },
        get: function (key) {
            debug && console.log('get('+key+')');
            var obj = getFromDict(key);
            var dep = Dependency();
            dep.depend();
            obj.deps.push(dep);
            return isArray(obj.value) ? makeArray(obj.value) : (obj.value !== undefined ? obj.value : obj.dflt);

            function isArray(v) {
                return _.isPlainObject(v) && _.every(Object.keys(v), function(key, idx) {
                    var itemIdx = key.replace(/^[^[\.]*\.([0-9]*)$/, '$1');
                    return itemIdx === idx + '';    // indexes are numeric and contiguous
                });
            }
            function makeArray(v) {
                return _.reduce(v, function(ret, v, k) {
                    ret[k] = v;
                    return ret;
                }, []);
            }
        },
        dump: function() {
            return _.reduce(_.keys(dict), function(ret, key) {
                var v = dict[key].value;
                if(v !== undefined) {
                    _.isDate(v) && (v = v.toISOString());
                    ret[key] = v;
                }
                return ret;
            }, {})
        },

        load: function(obj) {
            _.each(obj, function(v, k) {
                /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})/.test(v) && (v = new Date(v));
                dict[k] = {value: v, deps:[]};
            });
        },

        autorun: function (fn) {
            var ctx = _.find(contextList, {fn: fn});
            if (ctx) {
                ctx.run(false);
            } else {
                ctx = Context(fn);
                ctx.run(true);
                contextList.push(ctx);
            }
        },

        nonReactive: function(fn) {
            var prevContext = currentContext;
            currentContext = undefined;
            fn();
            currentContext = prevContext;
        },

        debug: {
            on: function() {
                debug = true;
            },
            off: function() {
                debug = false;
            }
        }
    };
    return that;
};

module.exports = ReactiveStore;