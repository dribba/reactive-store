module.exports = function Notifier(dict) {
    var keysToNotify = new Set();

    return {
        add(key) {
            keysToNotify.add(key);
        },
        flush() {
            var deps = new Set();
            var keys = keysToNotify;
            keysToNotify = new Set();

            Array.from(keys).forEach(getDeps);
            Array.from(deps).forEach(dep => dep.changed());

            function getDeps(key) {
                while(key.length) {
                    dict[key]  && Array.from(dict[key].deps).forEach(deps.add.bind(deps));
                    if(key.indexOf('.') !== -1) {
                        key = key.replace(/\.[^\.]*$/, '');
                    } else {
                        key = '';
                    }
                }

            }
        }
    }
}