var _ = require('lodash');

// This is the structure of the store
var ___store = {
    a: {
        b: {
                __value: 2,
                __meta: {},
        },
        c: {
            __value: 3,
            __meta: {}
        },
        __meta: {},
    }
};

module.exports = function () {
    var store = {};
    var that = {};

    that.dump = () => {
        return _.keys(store).reduce((memo, k) => {
                memo[k] = that.getValue(k);
            return memo;
        }, {});
    };

    that.load = (obj) => {
        _.keys(obj).forEach(k => that.setValue(k, obj[k]));
    };

    that.delete = key => {
        key.split('.').reduce((memo, it, idx) => {
            var obj = memo[it];
            obj && idx === key.split('.').length - 1 && delete memo[it];
            return memo[it];
        }, store);
    };

    that.setMeta = (key, data) => {
        var leaf = that.getLeaf(key);
        leaf.__meta = leaf.__meta || {};

        _.extend(leaf.__meta, data);
    };

    that.getMeta = (key, name) => {
        var leaf = that.getLeaf(key);
        return leaf.__meta ? (name ? leaf.__meta[name] : leaf.__meta) : undefined;
    };

    that.setValue = (key, value) => {
        if(_.isArray(value)) {
            return value.forEach((it, idx) => that.setValue(`${key}.${idx}`, it));
        }

        if(_.isPlainObject(value)) {
            return _.each(value, (v, k) => that.setValue(`${key}.${k}`, v));
        }

        that.getLeaf(key).__value = value;
    };

    that.getValue = (key) => {
        var leaf = that.getLeaf(key);
        var value = leaf.__value;
        if(value) {
            return value;
        }

        var props = _.without(_.keys(leaf), '__meta', '__value');

        if (props.length === 0) {
            return undefined;
        }

        if(isArray(props)) {
            return props.map(idx => that.getValue(`${key}.${idx}`));
        }

        return props.reduce((memo, prop) => {
            memo[prop] = that.getValue(`${key}.${prop}`);
            return memo;
        }, {});

        function isArray(props) {
            for(var i=props.length;i--;) {
                if(parseInt(props[i], 10) !== i) {
                    return false;
                }
            }
            return true;
        }

    };

    that.getLeaf = (key) => {
        var parts = key.split('.');
        var length = parts.length;

        return parts.reduce((storeObj, part, idx) => {
            if(!storeObj[part]) {
                storeObj[part] = {};
            }
            if(idx === length - 1) {
                return storeObj[part];
            } else {
                storeObj[part] === undefined && (storeObj[part]= {});
                delete storeObj[part].__value;
                return storeObj[part];
            }

        },store);
    };


    return that;
}
