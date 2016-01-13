var escope = require('escope');
var estraverse = require('estraverse');
var assert = require('assert');
var Scope = escope.Scope;



module.exports.parse = function(ast, scopes) {
  scopes = scopes || escope.analyze(ast).scopes;

  var gs = scopes.filter(function(scope) {
    return scope.type == 'global';
  })[0];

  var modules = [];

  ast = estraverse.traverse(ast, {
    enter: function(current, parent) {
      if (current.type === 'CallExpression' && current.callee.type === 'Identifier' &&
        current.callee.name === 'define' &&
        ((current.arguments.length == 1 && current.arguments[0].type == 'ObjectExpression') ||
          current.arguments[current.arguments.length - 1].type == 'FunctionExpression' ||
          current.arguments[current.arguments.length - 1].type == 'FunctionDeclaration')) {

        var ref = findRef(gs, current.callee);
        if (!ref.resolved) { // global define function
          var def = {};

          var args = current.arguments;
          def.node = current;

          // dependency-free module
          if (args.length == 1 && args[0].type == 'ObjectExpression') {
            def.simpleObject = true;
            def.object = args[0];
            modules.push(def);
            return;
          }

          var idx = 0;
          if (args[idx].type == 'Literal') {
            def.id = args[idx].value;
            idx++;
          }

          var deps = null;
          if (args[idx].type == 'ArrayExpression') {
            deps = args[idx].elements.map(function(elm) {
              if (elm.type == 'Literal') {
                return elm.value;
              } else {
                console.warn('WARN: not a standard define method.');
                return null;
              }
            });
          }


          var factoryNode = args[args.length - 1];

          assert(factoryNode.type == 'FunctionExpression', "Wrong Format of define method");

          // commonjs wrapper
          if (deps === null) {
            /**
             * define('', function(require, exports, module) {
             *
             * });
             */
            def.normalized = true;
            def.block = factoryNode.body;
            modules.push(def);
            return;
          }

          var params = factoryNode.params;

          assert.equal(params.length, deps.length, "Mismatch for  the number of function's params and dependencies declerations");

          var dependencies = def.dependencies = {};
          for (var i = 0; i < deps.length; ++i) {
            var param = params[i];
            dependencies[deps[i]] = param.name;
          }

          def.factoryNode = factoryNode;
          def.block = factoryNode.body;

          // find return statement for body
          def.exports = def.returns = findReturnInScope(factoryNode.body);

          modules.push(def);
        }
      }
    }
  });

  return modules;
};


function findReturnInScope(block) {
  var rets = [];

  // find return statement scope
  estraverse.traverse(block, {
    enter: function(node, parent) {
      if (Scope.isScopeRequired(node)) {
        if (node == block) {
          // current scope, continue
          return;
        }

        // if meet function scope, do not analyze
        if (node.type == 'FunctionExpression' || node.type == 'FunctionDeclaration' || node.type == 'Program')
          return estraverse.VisitorOption.Skip;
      }

      // otherwise travel down
      // return in the same scope
      // or return in catch scope that bellow the block scope, with no intermidia function scope or global scope
      // or return in with scope, with no itermidia function scope or global scope
      if (node.type == 'ReturnStatement') {
        rets.push(node);
      }
    }
  });

  return rets;
}


function findRef(scope, ident) {
  var refs = scope.references;
  for (var i = 0; i < refs.length; ++i) {
    var ref = refs[i];
    if (ref.identifier === ident) {
      return ref;
    }
  }

  var found;
  (scope.childScopes || []).forEach(function(s, i) {
    var rs = findRef(s, ident);
    if (rs) found = rs;
  });

  return found;
}