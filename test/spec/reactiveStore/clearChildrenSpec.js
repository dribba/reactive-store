var ReactiveStore = require('src/ReactiveStore');


describe('ReactiveStore.clearChildren()', function() {
    var rs1;

    beforeEach(function() {
        rs1 = ReactiveStore();
    });

    it('should clear child keys from the store', function() {
        rs1.set('obj', {a:1,b:2,c:3});
        rs1.clearChildren('obj');
        expect(rs1.get('obj')).not.toBeDefined();
    });

    it('should clear an array from the store', function() {
        rs1.set('arr', [1,2,3]);
        rs1.clearChildren('arr');
        expect(rs1.get('arr')).not.toBeDefined();
    });

    it('should set a key with a dependency to undefined', function() {
        var spy = jasmine.createSpy().and.callFake(rs1.get.bind(rs1, 'obj.a'));
        rs1.set('obj', {a:1});
        rs1.autorun(spy);

        rs1.clearChildren('obj');
        expect(rs1.get('obj.a')).toBe(undefined);
        rs1.set('obj.a', 2);
        expect(spy.calls.count()).toBe(2);
    });
});