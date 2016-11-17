# Pore (dependency injection container)

A super simple dependency injection container for applying the [Inversion of Control](https://en.wikipedia.org/wiki/Inversion_of_control) principle in JavaScript.

Key features:

* Simple API (see below)
* [100 lines of code or less](pore.js)
* [No dependencies](package.json)

## Usage

Import the library

```javascript
const Pore = require('pore')
```

Instantiate the container.

```javascript
let pore = new Pore()
```

Register constructor functions by their **logical** names.

```javascript
pore.register('Database', () => {
  return new MongoloidDatabaseAdapter()
})
```

Call constructor functions by their **logical** names;

```javascript
pore.get('Database')
// a new instance of MongoloidDatabaseAdapter
```

Chain constructors to build **object graphs**.

```javascript
pore.register('Service', (pore) => {
  return new Service(
    pore.get('Database') // <-- This is where the magic happens
  )
})
```

Throw some **scalar values** at it, too.

```javascript
pore.register('Pi', 3.14)
pore.get('Pi')
// 3.14
```

Flag constructors as _shared_ to only construct a **single instance** of your thing.

```javascript
pore.register('SharedService', () => {
  return new SharedService()
}, {
  shared: true
})
```

**Tag** constructor functions, and get logical names associated with tags.

```javascript
pore.register('one', 1, { tags: [ 'number' ])
pore.register('two', 2, { tags: [ 'number' ])
pore.register('carrot', '???', { tags: [ 'vegetable' ])

pore.getTagged('number')
// [ 'one', 'two' ]
```

**Bonus feature:** extract a subset (defined by a tag) of the registered constructors into a completely new pore. (If you are wondering *why*, try and think of this as a FactoryFactory).

```javascript
pore.register('one', 1, { tags: [ 'number' ])
pore.register('two', 2, { tags: [ 'number' ])
pore.register('carrot', '???', { tags: [ 'vegetable' ])

pore.createNewFromTag('number')
// returns a completely fresh Pore with 'one' and 'two'
```

## API

### pore.register(name, item[, options]) : undefined

| Parameter | Type | Description
| --- | --- | ---
| name | string | Logical name of the item. Use this to also get the item.
| item | * | Anything you want to store against the logical name. If the item is of type _function_ the pore instance will be passed as the first argument.
| options | object | _Optional_. See below.

Options:

| Option | Type | Description
| --- | --- | ---
| shared | boolean | _Optional_. If set, and if the item is of type _function_, the function will only be executed once and the result returned every time you get it from pore.
| tags | array of strings | _Optional_. Tags associated with the item

### pore.get(name) : *

| Parameter     | Type          | Description
| ------------- | ------------- | ---
| name          | string        | Logical name of the item to get.

### pore.getTagged(tag) : [*]

Parameters:

| Parameter     | Type          | Description
| ------------- | ------------- | ---
| tag           | string        | Get items with this tag.

### pore.createNewFromTag(tag) : pore

Paramters:

| Parameter     | Type          | Description
| ------------- | ------------- | ---
| tag           | string        | Create new pore out of items with this tag.

## Specs

It's [fully tested](poreSpec.js).

## License

Licensed under MIT license.
