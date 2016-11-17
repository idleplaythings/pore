# Pore (dependency injection container)

A super simple dependency injection container for applying the [Inversion of Control](https://en.wikipedia.org/wiki/Inversion_of_control) principle in JavaScript.

Key features:

* Simple API (see below)
* 100 lines of code or less
* No dependencies

## Usage

Instantiate the container.

    let pore = new Pore()

Register constructor functions by their **logical** names.

    pore.register('Database', () => {
      return new MongoloidDatabaseAdapter()
    });

Call constructor functions by their **logical** names;

    pore.get('Database')
    // a new instance of MongoloidDatabaseAdapter

Chain constructors to build **object graphs**.

    pore.register('Service', (pore) => {
      return new Service(
        pore.get('Database') // <-- This is where the magic happens
      );
    });

Throw some **scalar values** at it, too.

    pore.register('Pi', 3.14);
    pore.get('Pi')
    // 3.14

Flag constructors as _shared_ to only construct a **single instance** of your thing.

    pore.register('SharedService', () => {
      return new SharedService();
    }, {
      shared: true
    });

**Tag** constructor functions, and get logical names associated with tags.

    pore.register('one', 1, { tags: [ 'number' ]);
    pore.register('two', 2, { tags: [ 'number' ]);
    pore.register('carrot', '???', { tags: [ 'vegetable' ]);

    pore.getTagged('number');
    // [ 'one', 'two' ]

**Bonus feature:** extract a subset (defined by a tag) of the registered constructors into a completely new pore. (If you are wondering *why*, try and think of this as a FactoryFactory).

    pore.register('one', 1, { tags: [ 'number' ]);
    pore.register('two', 2, { tags: [ 'number' ]);
    pore.register('carrot', '???', { tags: [ 'vegetable' ]);

    pore.createNewFromTag('number');
    // returns a completely fresh Pore with 'one' and 'two'

## Specs

It's [fully tested](poreSpec.js).

## License

Licensed under MIT license.
