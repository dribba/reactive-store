var DictStore = require('DictStore');

describe('DictStore', () => {
    var store;

    beforeEach(() => {
        store = DictStore();
    });

    describe('setValue()', () => {
        it('should set a value in the base of the tree', () => {
            store.setValue('aKey', 'a value');
            expect(store.getValue('aKey')).toBe('a value');
        });

        it('should set a value deeper in the tree', () => {
            store.setValue('some.deeper.key', 'a value');
            expect(store.getValue('some.deeper.key')).toBe('a value');
        });

        it('should get a sub object', () => {
            store.setValue('some.deeper.key', 'a value');
            expect(store.getValue('some.deeper')).toEqual({key: 'a value'});
        })

        it('should store an object', () => {
            store.setValue('some.key', {foo:1, bar:2});
            expect(store.getValue('some.key.foo')).toBe(1);
        });

        it('should store an array', () => {
            store.setValue('some.deep.array', [1,2,3]);
            expect(store.getValue('some.deep.array')).toEqual([1,2,3]);
        });

        it('should store an object', () => {
            store.setValue('some', {deep: {array: [1,2,3]}});
            expect(store.getValue('some')).toEqual({
                deep: {array: [1,2,3]}
            })
            expect(store.getValue('some.deep.array')).toEqual([1,2,3]);
            expect(store.getValue('some.deep.array.1')).toEqual(2);
        });
    });
});