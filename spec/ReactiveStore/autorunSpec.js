describe('ReactiveStore.autorun()', function() {
    var rs1;

    beforeEach(function() {
        rs1 = ReactiveStore();
    });

    it('will react to a change in value', function(done) {
        rs1.autorun(function() {
            var value = rs1.get('something');
            if(value) {
                expect(value).toBe('a value');
                done();
            }
        });
        rs1.set('something', 'a value');
    });

    it('will react to a change in a deeper value', function(done) {
        rs1.autorun(function() {
            var v = rs1.get('a');
            if(v) {
                expect(v.value).toBe('something');
                done();
            }
        });
        rs1.set('a.value', 'something');
    });
});