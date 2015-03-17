describe('ReactiveStore.autorun()', function() {
    var rs1;

    beforeEach(function() {
        rs1 = ReactiveStore();
    });

    it('will only trigger autorun on the key being changed', function() {
        var a, b, aCount=0, bCount=0;
        rs1.autorun(function() {
            a = rs1.get('a');
            aCount++;
        });
        rs1.autorun(function() {
            b = rs1.get('b');
            bCount++;
        });

        expect([aCount, bCount]).toEqual([1,1]);
        rs1.set('a', 1);
        expect([aCount, bCount]).toEqual([2,1]);
        rs1.set('b', 1);
        expect([aCount, bCount]).toEqual([2,2]);
    });

    it('will react to a change in value only once per change', function() {
        var count = 0;
        var value;
        rs1.autorun(function() {
            value = rs1.get('something');
            count++;
        });
        expect([count, value]).toEqual([1, undefined]);
        rs1.set('something', 'a value');
        expect([count, value]).toEqual([2, 'a value']);
        rs1.set('something', 'another');
        expect([count, value]).toEqual([3, 'another']);
        rs1.set('something', 'yet another');
        expect([count, value]).toEqual([4, 'yet another']);
    });

    it('will react to a change in a deeper value', function() {
        var count = 0;
        var a;

        rs1.autorun(function() {
            a = rs1.get('a');
            count++;
        });

        expect(count).toBe(1);
        rs1.set('a.value', 'something');
        expect([count, a.value]).toEqual([2, 'something']);
        rs1.set('a.value', 'something else');
        expect([count, a.value]).toEqual([3, 'something else']);
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

    it('should still notify after a clearChildren() call', function() {
        var spy = jasmine.createSpy();
        rs1.set('val', {a:1,b:2});
        rs1.autorun(function() {
            spy();
            rs1.get('val');
        });
        expect(spy.calls.count()).toBe(1);
        rs1.clearChildren('val');
        expect(spy.calls.count()).toBe(1);
        rs1.set('val', {c:3});
        expect(spy.calls.count()).toBe(2);
    });
});