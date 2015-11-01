module.exports = function() {
    var that = {};

    that.dump = function() {
        return _.reduce(_.keys(that), function(ret, key) {
            var v = that[key].value;
            if(v !== undefined) {
                _.isDate(v) && (v = v.toISOString());
                ret[key] = v;
            }
            return ret;
        }, {})
    }

    return that;
};