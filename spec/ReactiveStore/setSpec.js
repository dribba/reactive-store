describe('ReactiveStore.set', function() {
    var rs1, rs2;

    beforeEach(function() {
        rs1 = ReactiveStore();
        rs2 = ReactiveStore();
    });


    it('should set a value in the store', function() {
        rs1.set('testing', 'my value');
        expect(rs1.get('testing')).toBe('my value');
    });

    it('should be able to set different values on different stores', function() {
        rs1.set('testing', 'a value');
        rs2.set('testing', 'different');
        expect(rs1.get('testing')).toBe('a value');
        expect(rs2.get('testing')).toBe('different');
    });

    it('should be able to store values with "." in their names', function() {
        rs1.set('some.value', 'a value');
        expect(rs1.get('some.value')).toBe('a value');
    });

    it('should be able to handle deep values with already existing values', function() {
        rs1.set('a.value', 'a value');
        rs1.set('a.another', 'another');
        rs1.set('a.something', 'something');
        expect(rs1.get('a.value')).toBe('a value');
        expect(rs1.get('a.another')).toBe('another');
        expect(rs1.get('a.something')).toBe('something');
        expect(rs1.get('a')).toEqual({value: 'a value', another: 'another', something: 'something'});
    });


});