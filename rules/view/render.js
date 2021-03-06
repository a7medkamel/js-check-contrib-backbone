var _         = require('underscore')
  , chai      = require('chai')
  , should    = require('chai').should()
  ;

function find(root, walk) {
  var ret = [];

  walk.ancestor(root, {
    Expression : function(node, state){
      if (node.type === 'CallExpression') {
        if (
              node.callee.property
          &&  node.callee.property.name === 'extend' 
          &&  node.callee.object
          &&  node.callee.object.property
          &&  node.callee.object.property.name === 'View'
          &&  node.callee.object.object
          &&  node.callee.object.object.name.toLowerCase() === 'backbone'
        ) {
          ret.push(node);
        }
      }
    }
  });

  return ret;
}

function check(node) {
  should.exist(node.arguments, 'view definition is empty', { at : node.loc });

  var def         = node.arguments[0]
    , render      = _.find(def.properties, function(i){ return i.type === 'Property' && i.key.name === 'render'; })
    ;

  should.exist(render, 'render method should be defined for each view', { at : def.loc });
}

module.exports = {
  type      : 'js',
  area      : 'Backbone',
  name      : 'View/render',
  fix       : 'add render method to backbone view',
  qualifier : '?',
  find      : find,
  check     : check
};