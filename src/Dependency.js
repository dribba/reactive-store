import ReactiveContext from './ReactiveContext';

export default function Dependency() {
    var that = {
        changed: function () {
            that.invalid = true;
            ReactiveContext.flushAll();
        },
        depend: function () {
            ReactiveContext.current && ReactiveContext.current.addDependency(that);
        }
    };
    return that;
};
