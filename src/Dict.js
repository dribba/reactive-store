module.exports = () => {
    var that = {};
    var dict = {};

    that.delete = key => delete dict[key];

    that.dump = () => {
        return _.reduce(_.keys(dict), function (ret, key) {
            var v = dict[key].value;
            if (v !== undefined) {
                _.isDate(v) && (v = v.toISOString());
                ret[key] = v;
            }
            return ret;
        }, {})
    };

    that.setDefaultValue = (key, dflt) => that.get(key).dflt = dflt;

    that.set = (key, obj) => dict[key] = obj;

    that.get = (key, dflt) => {
        var keys = _.keys(dict).filter(k => k === key || k.startsWith(`${key}.`));

        if (keys.length === 0) {
            return dict[key] = {value: dflt, deps: []};
        }

        if (keys.length === 1 && keys[0] === key) {
            return dict[key];
        }

        dict[key] = dict[key] || {value: undefined, deps: []};  // Need this to have a deps for this key

        return isArray(keys) ? array() : object();


        function array() {
            return _.reduce(keys, function (ret, k) {
                var propName = k.replace(key + '.', '');
                var value = dict[k].value;
                if (value !== undefined) {
                    var idx = _.last(k.split('.'));
                    ret.value[idx] = value;
                }
                return ret;
            }, {value: [], deps: dict[key].deps});
        }

        function object() {
            return _.reduce(keys, function (ret, k) {
                if (k === key) {
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
            return _.every(keys, function (key, idx) {
                var itemIdx = key.replace(/^[^[\.]*\.([0-9]*)$/, '$1');
                return itemIdx === idx + '';    // indexes are numeric and contiguous
            });
        }
    };


    return that;
};