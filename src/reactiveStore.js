var _ = require('lodash');
var Dict = require('./Dict');
var Notifier = require('./Notifier');
var ReactiveContext = require('./ReactiveContext');
var Dependency = require('./Dependency');

function ReactiveStore() {
    "use strict";
    var dict = Dict();
    var debug;

    function convertToDotNotation(key) {
        return key.replace(/\[([0-9]*)\]/g, '.$1'); // replace [] array syntax with dot notation
    }

    var that = {
        clearChildren: function(key) {
            _.each(_.keys(that.dump()), function(k) {
                var obj = dict.get(k)
                key !== k && _.startsWith(k, key) && (obj.deps.length === 0 ? (dict.delete(k)) : obj.value = undefined);
            });
        },
        set: function (key, val) {
            debug && console.log('set(' + key + ', ' + val + ')');
            var notifier = Notifier(dict);
            set(key,val);
            notifier.flush();

            function set(key, val) {
                if (key === undefined) {
                    throw new Error("Can not get value of undefined key");
                }
                key = convertToDotNotation(key);

                _.isPlainObject(val) ? setObject() : (_.isArray(val) ? setArray() : setValue());

                function setObject() {
                    _.each(val, function (v, k) {
                        set(`${key}.${k}`, v);
                    });
                    dict.setDefaultValue(key, {});
                    _.keys(val).length === 0 && notifier.add(key); // notify on empty object being stored
                }

                function setArray() {
                    that.clearChildren(key);
                    _.each(val, function (v, idx) {
                        set(key + '.' + idx, v);
                    });
                    dict.setDefaultValue(key, []);
                    val.length === 0 && notifier.add(key);    // notify if storing an empty array
                }

                function setValue() {
                    var obj = dict.get(key);
                    if (obj.value !== val) {
                        obj.value = val;
                        obj.dflt = undefined;
                        notifier.add(key);
                    }
                }
            }
        },
        get: function (key) {
            debug && console.log('get('+key+')');
            if(key === undefined) {
                throw new Error("Can not get value of undefined key");
            }
            key = convertToDotNotation(key);
            var obj = dict.get(key);

            if(ReactiveContext.current) {
                var dep = Dependency();
                dep.depend();
                obj.deps.push(dep);
            }

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
        dump: dict.dump,

        load: function(obj) {
            _.each(obj, function(v, k) {
                /(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})/.test(v) && (v = new Date(v));
                dict.set(k, {value: v, deps:[]});
            });
        },

        autorun: ReactiveContext.autorun,
        nonReactive: ReactiveContext.nonReactive,

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