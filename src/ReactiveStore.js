import _ from 'lodash';
import Dict from './Dict';
import Notifier from './Notifier';
import ReactiveContext from './ReactiveContext';
import Dependency from './Dependency';

export default function ReactiveStore() {
    "use strict";
    var dict = Dict();
    var debug;

    function convertToDotNotation(key) {
        return key.replace(/\[([0-9]*)\]/g, '.$1'); // replace [] array syntax with dot notation
    }

    var that = {
        clearChildren: function(key) {
            dict.clearChildren(key);
            Notifier(dict).add(key).flush();
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

                if(JSON.stringify(val) !== JSON.stringify(dict.get(key))) {
                    _.flattenDeep(dict.set(key, val)).forEach(notifier.add);
                }
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

        dump: (key)=>{
            debug && console.log('dump('+key+')');
            if(key === undefined) {
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
        toString() {
            return `ReactiveStore() => ${this.dump()}`;
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
