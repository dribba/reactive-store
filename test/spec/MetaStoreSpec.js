var MetaStore = require('MetaStore');

describe('MetaStore', () => {
    var store;

    beforeEach(() => {
        store = MetaStore();
    });

    describe('setValue()', () => {
        it('should returned undefined for a non-existent key', () => {
            expect(store.getValue('fake')).not.toBeDefined();
            expect(store.getValue('a.fake')).not.toBeDefined();
        });

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

    describe('getMeta()', () => {
        it('should return undefined for an unknown key', () => {
            expect(store.getMeta('some.unknown.key', 'fake')).toBe(undefined);
        });

        it('should return the metadata for some given key', () => {
            store.setMeta('some.key', {foo: 'bar', baz:'foo'});
            expect(store.getMeta('some.key', 'foo')).toBe('bar');
            expect(store.getMeta('some.key', 'baz')).toBe('foo');
        });

        it('should return the full metadata object if no name given', () => {
            store.setMeta('some.key', {foo:'bar', baz: 'foo'});
            expect(store.getMeta('some.key')).toEqual({foo: 'bar', baz: 'foo'});
        });
    });

    describe('delet()', () => {
        it('should delete a key', () => {
            store.setMeta('some.deep.key', {foo: 'bar'});
            store.setMeta('some.deep', {foo: 'baz'});
            store.setValue('some.deep.key', 10);
            expect(store.getValue('some.deep.key')).toBe(10);
            store.delete('some.deep.key');
            expect(store.getMeta('some.deep.key')).toBeUndefined();
            expect(store.getMeta('some.deep')).toEqual({foo: 'baz'});
            expect(store.getValue('some.deep.key')).toBeUndefined();
        });
    });
});