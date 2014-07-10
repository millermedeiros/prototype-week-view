//jshint node:true
var rjs = require('requirejs');

rjs.optimize({
  logLevel: 1,
  baseUrl: 'js',
  name: 'almond',
  out: 'js/built.js',
  include: ['app'],
  insertRequire: ['app']
});

