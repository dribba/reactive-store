ReactiveStore = function () {
    "use strict";
    var currentContext;
    var dict = {};

    var contextList = [];

    function Context(fn) {
        var deps = [];

        var that = {
            fn: fn,
            flush: function () {
                _.some(deps, _fn.dot('invalid')) && that.run({});
            },
            addDependency: function (dep) {
                deps.indexOf(dep) === -1 && deps.push(dep);
            },
            run: function (opts) {
                deps = [];
                var prevContext = currentContext;
                currentContext = that;
                fn(opts);
                currentContext = prevContext;
            }
        };
        return that;
    }

    Context.flush = function () {
        _fn.fmap(_fn.exec('flush'), contextList);
    };

    function Dependency() {
        var that = {
            changed: function () {
                that.invalid = true;
                Context.flush();
            },
            depend: function () {
                currentContext && currentContext.addDependency(that);
            }
        };
        return that;
    }

    function getFromDict(key, dflt) {
        var keys = _.filter(_.keys(dict), function (k) {
            return k === key || k.indexOf(key + '.') === 0;
        });

        if (keys.length === 0) {
            return dict[key] = {value: dflt, deps: []};
        }

        if (keys.length === 1 && keys[0] === key) {
            return dict[key];
        }

        dict[key] = dict[key] || {value: undefined, deps: []};  // Need this to have a deps for this key
        return _.reduce(keys, function (ret, k) {
            var propName = k.replace(key + '.', '');
            var value = dict[k].value;
            if(value !== undefined) {
                _fn.setProp(propName, ret.value, value);
            }
            return ret;
        }, {value: {}, deps: dict[key].deps});
    }

    function notify(key) {
        var deps = [];
        while(key.length) {
            if(dict[key]) {
                deps = deps.concat(dict[key].deps);
                dict[key].deps = [];
            }
            if(key.indexOf('.') !== -1) {
                key = key.replace(/\.[^\.]*$/, '');
            } else {
                key = '';
            }
        }

        _.each(deps, function(dep) {
            dep.changed();
        });
    }

    var that = {
        set: function (key, val) {
            _.isPlainObject(val) ? setObject() : setValue();


            function setObject() {
                _.each(val, function(v, k) {
                    that.set(key+'.'+k, v);
                });
            }

            function setValue() {
                var obj = getFromDict(key);
                if(obj.value !== val) {
                    obj.value = val;
                    notify(key);
                }
            }
        },
        get: function (key) {
            var obj = getFromDict(key);
            var dep = Dependency();
            dep.depend();
            obj.deps.push(dep);
            return obj.value;
        },
        dump: function() {
            return _.reduce(_.keys(dict), function(ret, key) {
                ret[key] = dict[key].value;
                return ret;
            }, {})
        },

        autorun: function (fn) {
            var ctx = _.find(contextList, {fn: fn});
            if (ctx) {
                ctx.run({});
            } else {
                ctx = Context(fn);
                ctx.run({firstRun: true});
                contextList.push(ctx);
            }
        }
    };
    return that;
};