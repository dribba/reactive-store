reactiveStore
=============

A reactive store inspired by Meteor Session/Autorun.
I designed this to work either stand-alone or with Facebook's React.js

## Usage

### Core Methods

**.set( keyName, value )** Sets a value in the store, e.g.:

```javascript
reactiveStore.set("foo", "bar"); // creates: { foo: "bar" }
```

**.get( keyName )** Gets a value from the store, e.g.:

```javascript
reactiveStore.get('foo'); // returns: "bar"
```

**.dump( )** Returns entire JSON object of values currently in the store, e.g.:

```javascript
reactiveStore.dump(); // returns: { foo: "bar" }
```

**.dump( keyName )** (Optional: keyName param) Returns one value from the store, e.g.:

```javascript
reactiveStore.dump('foo'); // returns: "bar"
```

**.load( object )** Loads JSON object into the store, e.g.:

```javascript
reactiveStore.load({foo:"bar"});
reactiveStore.dump(); // returns: {foo:"bar"}
```

**.wipe(  )** Clears all values currently in the store, e.g.:

```javascript
reactiveStore.dump(); // returns: { foo: "bar" }
reactiveStore.wipe(); // returns: {}
reactiveStore.dump(); // returns: {}
```

**.clearChildren( keyName )** Clears all children values under `keyName` , e.g.:

```javascript
reactiveStore.set('obj', { a: 1, b: 2, c: 3 }); // store: { obj: { a: 1, b: 2, c: 3 } }
reactiveStore.clearChildren('obj'); // store: { obj: {} }

// also works with arrays
reactiveStore.set('arr', [ 1, 2, 3 ]); // store: { arr: [1, 2, 3] }
reactiveStore.clearChildren('arr'); // store: { arr: [] }
```

**.raw(  )** Returns the raw data structure of the current store.

**.debug[.on() || .off()]** Turns debugging on/off, e.g:

```javascript
reactiveStore.debug.on(); // debug mode is on
reactiveStore.debug.off(); // debug mode is off
```

### Reactive Methods

**.autorun( firstRun => {} )** Accepts a function to be autorun ala Meteor, this means that the given function will be called immediately and then again on every update of the keys used within the function

```javascript
var RS = ReactiveStore();
RS.autorun(() => {
    console.log(RS.get('foo.bar'));
});
// > undefined
RS.set('foo.bar', 'Hello world');
// > 'Hello world'

// This function will be run only once and never again
// because there's no RS.get in the body
RS.autorun(firstRun => {
    console.log('Hello');
});
```

**.nonReactive( fn )** Accepts a function to be excepted from a parent instance of autorun.

```javascript
var RS = ReactiveStore();
RS.autorun(() => {
    var foo = RS.get('foo');
    var bar;
    RS.nonReactive(() => {
        bar = RS.get('bar');
    });
    console.log(foo + ', ' + bar);
});
// > undefined, undefined
RS.set('bar', 'world');
// Nothing happens since RS.get('bar') happens in a non reactive context
RS.set('foo', 'Hello');
// > 'Hello, world'
RS.set('foo', 'Hi');
// > 'Hi, world'
```