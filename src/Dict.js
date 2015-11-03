var MetaStore = require('./MetaStore');

module.exports = () => {
    var that = {};
    var store = MetaStore();
    that.raw = store.raw;
    that.delete = store.delete;
    that.dump = store.dump;
    that.set = store.setValue;
    that.get = (key, dflt) => {
        var value = store.getValue(key);
        if (value === undefined) {
            return dflt;
        }
        return value;
    };
    that.addDependency = (key, dep) => {
        var deps = store.getMeta(key, 'deps');
        store.setMeta(key, {deps: deps ? deps.concat(dep) : [dep]});
    };

    that.getDependencies = (key) => store.getMeta(key, 'deps') || [];
    that.clearChildren = key => {
        var leafs = store.getLeafs(key);
        leafs.forEach(leaf => leaf.__value = undefined);
    };

    return that;
};