var R = require('ramda');

var ReactiveContext = module.exports = function(fn) {
    var deps = [];

    var that = {
        fn: fn,
        flush: function () {
            _.some(deps, R.prop('invalid')) && that.run(false);
        },
        addDependency: function (dep) {
            deps.indexOf(dep) === -1 && deps.push(dep);
        },
        run: function (opts) {
            deps = [];
            var prevContext = ReactiveContext.current;
            ReactiveContext.current = that;
            fn(opts);
            ReactiveContext.current = prevContext;
        }
    };
    return that;
}

ReactiveContext.flushAll = function () {
    ReactiveContext.list.forEach(c => c.flush());
};

ReactiveContext.list = [];
