const chai = require('chai')
const Pore = require('./pore')
const expect = chai.expect

describe('Pore dependency injection container', () => {
  var pore;

  beforeEach(() => {
    pore = new Pore()
  });

  it('returns scalar values', () => {
    pore.register('Pi', 3.14);

    expect(pore.get('Pi')).to.equal(3.14);
  });

  it('throws an error for non-existing names', function () {
    expect(() => pore.get('foo')).to.throw('Undefined key: "foo"');
  });

  it('executes constructor functions', () => {
    function Bar() { }

    pore.register('Foo', () => {
      return new Bar();
    });

    expect(pore.get('Foo') instanceof Bar).to.equal(true);
  });

  it('passes itself as a parameter to constructor functions', () => {
    pore.register('first', 1);
    pore.register('second', function(pore) {
      return pore.get('first');
    });

    expect(pore.get('second')).to.equal(1);
  });

  it('executes shared constructor functions only once', () => {
    function Bar() { }

    pore.register('Foo', () => {
      return new Bar();
    }, {
      shared: true
    });

    expect(pore.get('Foo')).to.equal(pore.get('Foo'));
  });

  it('returns logical names by tags', () => {
    pore.register('two',   2, { tags: [ 'prime', 'even' ] });
    pore.register('three', 3, { tags: [ 'prime', 'odd' ] });
    pore.register('four',  4, { tags: [ 'even' ] });

    var tagged = pore.getTagged('prime');

    expect(tagged).to.contain('two');
    expect(tagged).to.contain('three');
    expect(tagged.length).to.equal(2);
  });

  it('returns an empty array for non-existing tag', () => {
    expect(pore.getTagged('foobar').length).to.equal(0);
  })

  it('creates a new pore based on tagged subset of itself', () => {
    pore.register('one',   1, { tags: [ 'leave-me' ] });
    pore.register('two',   2, { tags: [ 'pick-me' ] });
    pore.register('three', 3, { tags: [ 'pick-me' ] });
    pore.register('four',  4, { tags: [ 'leave-me' ] });

    var anotherPore = pore.createNewFromTag('pick-me');

    expect(anotherPore.get('two')).to.equal(2);
    expect(anotherPore.get('three')).to.equal(3);
  });
});
