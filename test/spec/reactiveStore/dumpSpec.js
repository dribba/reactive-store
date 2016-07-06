var ReactiveStore = require('src/ReactiveStore');

describe('ReactiveStore.dump()', ()=>{
    var rs;
    var date = new Date();

    beforeEach(()=>{
        rs = ReactiveStore();
        rs.set('value1', 'a value');
        rs.set('some.deep.value', 'another');
        rs.set('date', date);
        rs.set('arr', [1,2,3]);
    });

    it('should dump an object with the values', ()=>{
        var o = rs.dump();
        expect(o.value1).toBe('a value');
        expect(o.some.deep.value).toBe('another');
    });

    it('should serialize dates using ISO string', ()=>{
        var o = rs.dump();
        expect(o.date).toBe(date.toISOString());
    });

    it('should dump an object with arrays', ()=>{
        var o = rs.dump();
        expect(o.arr[1]).toBe(2);
    });

    it('should dump an object with an (optional) starting point', ()=>{
        var o = rs.dump('some.deep.value');
        expect(o).toBe('another');
        o = rs.dump('some.deep');
        expect(o.value).toEqual('another');
    });
});