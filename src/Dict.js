var MetaStore = require('./MetaStore');
var _ = require('lodash');

module.exports = () => {
    var that = {};
    var store = MetaStore();
    that.raw = store.raw;
    that.delete = store.delete;
    that.dump = store.dump;
    that.load = store.load;
    that.set = store.setValue;
    that.get = (key, dflt) => {
        var value = store.getValue(key, false);
        return value === undefined ? dflt : value;
    };
    that.addDependency = (key, dep) => {
        var deps = store.getMeta(key, 'deps');
        store.setMeta(key, {deps: deps ? deps.concat(dep) : [dep]});
    };

    that.getDependencies = (key) => store.getMeta(key, 'deps') || [];
    that.clearChildren = key => {
        _.each(that.get(key), (v, k) => {
            _.isPlainObject(v) ? that.clearChildren(`${key}.${k}`) : that.set(`${key}.${k}`, undefined);
        });
    };

    return that;
};