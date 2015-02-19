describe('ReactiveStore.load()', function(){
    var rs;
    var dump;

    beforeEach(function() {
        rs = ReactiveStore();
        rs.set('a',1);
        rs.set('b',{foo:2});
        dump = rs.dump();
        rs = ReactiveStore();
        rs.load(dump);
    });

    it('should restore the state from a dump', function() {
        expect(rs.get('a')).toBe(1);
        expect(rs.get('b.foo')).toBe(2);
    });

    it('should should not trigger any reactivity', function() {
        var spy = jasmine.createSpy().and.callFake(function() {
            rs.get('a');
        });
        rs.autorun(spy);
        expect(spy.calls.count()).toBe(1);
        rs.set('a',2);
        expect(spy.calls.count()).toBe(2);
        rs.load(dump);
        expect(rs.get('a')).toBe(1);
        expect(spy.calls.count()).toBe(2);
    });
});