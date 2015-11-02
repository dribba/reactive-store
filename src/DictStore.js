var _ = require('lodash');

var x = {
    a: {
        b: {
                __value: 2,
                __deps: [],
        },
        c: {
            __value: 3,
            __deps: []
        },
        __deps: [],
    }
};

module.exports = function () {
    var store = {};
    var that = {};

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

        var props = _.without(_.keys(leaf), '__deps', '__value');

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
                storeObj[part] = {__deps:[]};
            }
            if(idx === length - 1) {
                return storeObj[part];
            } else {
                storeObj[part] === undefined && (storeObj[part]= {__deps:[]});
                delete storeObj[part].__value;
                return storeObj[part];
            }

        },store);
    };


    return that;
}
