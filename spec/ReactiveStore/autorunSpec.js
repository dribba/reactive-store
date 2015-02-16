describe('ReactiveStore.autorun()', function() {
    var rs1;

    beforeEach(function() {
        rs1 = ReactiveStore();
    });

    it('will react to a change in value only once per change', function(done) {
        var count = 0;
        rs1.autorun(function() {
            var value = rs1.get('something');
            if(value) {
                count === 0 && expect(value).toBe('a value');
                count === 1 && expect(value).toBe('another');
                count === 2 && expect(value).toBe('yet another');
                count++ === 2 && done();
            }
        });
        rs1.set('something', 'a value');
        rs1.set('something', 'another');
        rs1.set('something', 'yet another');
    });

    it('will react to a change in a deeper value', function(done) {
        var count = 0;
        rs1.autorun(function() {
            var v = rs1.get('a');
            if(v) {
                count === 0 && expect(v.value).toBe('something');
                count === 1 && expect(v.value).toBe('something else');
                count++ === 1 && done();
            }
        });
        rs1.set('a.value', 'something');
        rs1.set('a.value', 'something else');
    });

    it('will not re-notify if the same value is set', function() {
        var count = 0;
        rs1.autorun(function() {
            rs1.get('a');
            count++;
        });
        expect(count).toBe(1);
        rs1.set('a', 'value');
        expect(count).toBe(2);
        rs1.set('a', 'value');
        expect(count).toBe(2);
        rs1.set('a', 'value');
        expect(count).toBe(2);
        rs1.set('a', 'another');
        expect(count).toBe(3);
    });
});