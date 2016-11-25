var Set = require('core-js/library/fn/set');
var arrayFrom = require('core-js/library/fn/array/from');

module.exports = function Notifier(dict) {
    var keysToNotify = new Set();

    var that = {
        add(key) {
            keysToNotify.add(key);
            return that;
        },
        flush() {
            var deps = new Set();
            var keys = keysToNotify;
            keysToNotify = new Set();

            arrayFrom(keys).forEach(getDeps);
            arrayFrom(deps).forEach(dep => dep.changed());

            function getDeps(key) {
                while(key.length) {
                    dict.getDependencies(key).forEach(deps.add.bind(deps));
                    if(key.indexOf('.') !== -1) {
                        key = key.replace(/\.[^\.]*$/, '');
                    } else {
                        key = '';
                    }
                }
            }
        }
    };
    return that;
}
