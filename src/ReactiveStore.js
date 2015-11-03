var _ = require('lodash');
var Dict = require('./Dict');
var Notifier = require('./Notifier');
var ReactiveContext = require('./ReactiveContext');
var Dependency = require('./Dependency');

function ReactiveStore() {
    "use strict";
    var dict = Dict();
    var debug;

    window.dict = dict;

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
                dict.set(key, val);
                notifier.add(key);
            }
        },
        get: function (key) {
            debug && console.log('get('+key+')');
            if(key === undefined) {
                throw new Error("Can not get value of undefined key");
            }
            key = convertToDotNotation(key);
            var val = dict.get(key);

            if(ReactiveContext.current) {
                var dep = Dependency();
                dep.depend();
                dict.addDependency(key, dep);
            }

            return val;
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