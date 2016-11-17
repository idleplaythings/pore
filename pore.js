
class Pore {
  constructor() {
    this._registry = {}
    this._shared = {}
    this._tags = {}
  }

  register(name, item, options) {
    this._register(name, item)
    this._parseOptions(name, item, options)
  }

  get(name) {
    if (this.isMarkedShared(name)) {
      this._instantiateShared(name);
      return this._shared[name];
    }

    return this._create(name);
  }

  getTagged(tag) {
    if (this._tags[tag] instanceof Array) {
      return this._tags[tag]
    }

    return []
  }

  createNewFromTag(tag) {
    const _pore = new Pore();

    this.getTagged(tag).forEach(function(name) {
      _pore.register(name, this.get(name));
    }.bind(this))

    return _pore
  }

  _register(name, item) {
    this._registry[name] = item;
  };

  _parseOptions(name, item, options) {
    options = options === undefined ? {} : options;

    if (this._sharedOptionEnabled(options)) {
      this._markAsShared(name);
    }

    this._getTagsFromOptions(options).forEach((tag) => this._tag(name, tag))
  }

  isMarkedShared(name)
  {
    return Object.keys(this._shared).indexOf(name) !== -1;
  }

  _instantiateShared(name)
  {
    this._shared[name] = this._shared[name] || this._create(name);
  }

  _create(name) {
    if (!this._registry[name]) {
      throw new Error('Undefined key: "' + name + '"');
    }

    if (typeof this._registry[name] === 'function') {
      return this._registry[name].call(undefined, this);
    }

    return this._registry[name];
  };

  _sharedOptionEnabled(options)
  {
    return Boolean(options.shared)
  };

  _markAsShared(name)
  {
    this._shared[name] = null;
  };

  _getTagsFromOptions(options)
  {
    if (options.tags instanceof Array) {
      return options.tags;
    }

    return [];
  };

  _tag(name, tag)
  {
    if (typeof this._tags[tag] === 'undefined') {
      this._tags[tag] = [];
    }

    this._tags[tag].push(name);
  };
}

module.exports = Pore
