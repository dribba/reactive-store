var ReactiveStore = require('src/ReactiveStore');

describe('wipe()', () => {

    beforeEach(function() {
        var rs = this.rs = ReactiveStore();
        rs.set('a', {foo:1});
        rs.set('b', 'string');
        rs.set('c', 10);
        rs.autorun(() => rs.get('d'));
        
    });
    
    it('should wipe the database clean', function() {
        this.rs.wipe();
        expect(this.rs.raw()).toEqual({});
        expect(Object.keys(this.rs.dump())).toEqual([]);
    });
});