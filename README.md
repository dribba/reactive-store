reactiveStore
=============

A reactive store inspired by Meteor Session/Autorun.
I designed this to work either stand-alone or with Facebook's React.js

## Usage

### Core Methods

**.set( keyName, value )** Sets a value in the store, e.g.:

    reactiveStore.set("foo", "bar"); // creates: { foo: "bar" }

**.get( keyName )** Gets a value from the store, e.g.:

    reactiveStore.get('foo'); // returns: "bar"
    
**.dump( )** Returns entire JSON object of values currently in the store, e.g.:

    reactiveStore.dump(); // returns: { foo: "bar" }

**.dump( keyName )** (Optional: keyName param) Returns one value from the store, e.g.:

    reactiveStore.dump('foo'); // returns: "bar"
    
**.load( object )** Loads JSON object into the store, e.g.:

    reactiveStore.load({foo:"bar"});
    reactiveStore.dump(); // returns: {foo:"bar"}

**.wipe(  )** Clears all values currently in the store, e.g.:
    
    reactiveStore.dump(); // returns: { foo: "bar" }
    reactiveStore.wipe(); // returns: {}
    reactiveStore.dump(); // returns: {}
    
**.raw(  )** Returns the raw data structure of the current store.

**.debug[.on() || .off()]** Turns debugging on/off, e.g:

    reactiveStore.debug.on(); // debug mode is on
    reactiveStore.debug.off(); // debug mode is off
    
### Reactive Methods

**.autorun( fn )** Accepts a function to be autorun ala Meteor.

    /*example here*/

**.nonReactive( fn )** Accepts a function to be excepted from a parent instance of autorun.

    /*example here*/