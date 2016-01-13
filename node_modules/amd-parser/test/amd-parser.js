'use strict';

var assert = require('assert');
var esprima = require('esprima');
var path = require('path');
var fs = require('fs');
var parser = require('../');


describe('amd-parser', function() {
  it('depfree', function() {
    var content = fs.readFileSync(path.join(__dirname, './fixtures/depfree.js'), 'utf8');
    var ast = esprima.parse(content);

    var modules = parser.parse(ast);
    assert.equal(modules.length, 1);

    var mod = modules[0];
    assert(!mod.id);
    assert(mod.simpleObject);
  });

  it('normalized', function() {
    var content = fs.readFileSync(path.join(__dirname, './fixtures/normalized.js'), 'utf8');
    var ast = esprima.parse(content);

    var modules = parser.parse(ast);
    assert.equal(modules.length, 1);
    var mod = modules[0];
    assert.equal(mod.id, 'normalized');
    assert(mod.normalized);
  });

  it('standard', function() {
    var content = fs.readFileSync(path.join(__dirname, './fixtures/standard.js'), 'utf8');
    var ast = esprima.parse(content);

    var modules = parser.parse(ast);
    assert.equal(modules.length, 1);
    var mod = modules[0];
    assert.equal(mod.id, 'app');

    assert.equal(Object.keys(mod.dependencies).length, 4);
    assert.equal(mod.returns.length, 2);
  });

});