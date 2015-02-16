describe('ReactiveStore.dump()', function() {
    var rs;

    beforeEach(function() {
        rs = ReactiveStore();
        rs.set('value1', 'a value');
        rs.set('some.deep.value', 'another');
    });

    it('should dump an object with the values', function() {
        var o = rs.dump();
        expect(o.value1).toBe('a value');
        expect(o['some.deep.value']).toBe('another');
    });
});