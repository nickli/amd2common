# amd-parser [![NPM version](https://badge.fury.io/js/amd-parser.svg)](http://badge.fury.io/js/amd-parser) [![Build Status](https://travis-ci.org/villadora/amd-parser.svg?branch=master)](https://travis-ci.org/villadora/amd-parser) [![Dependency Status](https://gemnasium.com/villadora/amd-parser.svg)](https://gemnasium.com/villadora/amd-parser)

<!-- description -->

## Installation

```bash
$ npm install amd-parser --save
```

## Usage

```js
var parser = require('amd-parser');

var ast  = require('esprima').parse('define('module', ['util'], function(util) { return {}; })');

var modules = parse.parse(ast);
assert(modules.length == 1);
var mod = modules[0];

mod.id; // module
mod.node; // define function node
mod.simpleObject; // true if AMD is a simpleObject/dependency free module
mod.normalized; // true if AMD is just a commonjs wrapper module
mod.returns; // return statements in a standard module
mod.factoryNode; // ast node for factory function

```

## Licence

MIT
<!-- do not want to make nodeinit to complicated, you can edit this whenever you want. -->