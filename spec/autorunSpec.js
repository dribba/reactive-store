ReactiveStore = require('..');

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

    it('will notify for a change in value only once per change', function() {
        var value;
        var autorunSpy = jasmine.createSpy().and.callFake(function() {value = rs1.get('something')});
        rs1.autorun(autorunSpy);
        expect([autorunSpy.calls.count(), value]).toEqual([1, undefined]);
        rs1.set('something', 'a value');
        expect([autorunSpy.calls.count(), value]).toEqual([2, 'a value']);
        rs1.set('something', 'another');
        expect([autorunSpy.calls.count(), value]).toEqual([3, 'another']);
        rs1.set('something', 'yet another');
        expect([autorunSpy.calls.count(), value]).toEqual([4, 'yet another']);

        autorunSpy.calls.reset();
        rs1.set('something', {foo:'foo', bar: 'bar'});
        expect(autorunSpy.calls.count()).toBe(1);
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
        var valSpy = jasmine.createSpy();
        var aSpy = jasmine.createSpy();

        rs1.set('val', {a:1});
        rs1.autorun(function() {
            valSpy();
            rs1.get('val');
        });
        rs1.autorun(function() {
            aSpy();
            rs1.get('val.a');
        });
        expect(valSpy.calls.count()).toBe(1);
        expect(aSpy.calls.count()).toBe(1);
        rs1.clearChildren('val');
        expect(valSpy.calls.count()).toBe(1);
        rs1.set('val', {a:2});
        expect(valSpy.calls.count()).toBe(2);
        expect(aSpy.calls.count()).toBe(2);
    });

    it('should still notify if empty array is stored', function() {
        var spy = jasmine.createSpy();

        rs1.set('arr', [1]);
        rs1.autorun(function() {
            spy();
            rs1.get('arr');
        });
        expect(spy.calls.count()).toBe(1);
        rs1.set('arr', []);
        expect(spy.calls.count()).toBe(2);
    });

    it('should still notify if empty object is stored', function() {
        var spy = jasmine.createSpy();

        rs1.set('obj', {a:1});
        rs1.autorun(function() {
            spy();
            rs1.get('obj');
        });
        expect(spy.calls.count()).toBe(1);
        rs1.set('obj', {});
        expect(spy.calls.count()).toBe(2);
    });

    it('should pass firstRun variable to autorun', function() {
        var spy = jasmine.createSpy();
        rs1.autorun(function(firstRun) {
            spy(firstRun);
            rs1.get('foo');
        });
        rs1.set('foo', 'bar');
        rs1.set('foo', 'baz');
        expect(spy.calls.argsFor(0)).toEqual([true]);
        expect(spy.calls.argsFor(1)).toEqual([false]);
        expect(spy.calls.argsFor(2)).toEqual([false]);
    });
});