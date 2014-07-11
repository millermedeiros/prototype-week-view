//jshint node:true
var rjs = require('requirejs');

rjs.optimize({
  logLevel: 1,
  baseUrl: 'js',
  name: 'almond',
  out: 'js/built.js',
  include: ['app'],
  insertRequire: ['app'],
  paths: {
    // toggle react version here (min is faster) fake-react doesn't do anything
    // was used just to test how much react slows down the startup
    // react: 'fake-react'
    react: 'react-min'
  }
});

