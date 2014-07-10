define(function(require) {

  // seeded random to always get same events so we make sure we are testing
  // performance always under the same conditions
  var random = require('mout/random/random');
  var SeedRandom = require('seedrandom');
  var seeded = new SeedRandom('gaia-calendar');
  random.get = seeded;

  // ----

  var weekView = require('./views/week');
  weekView.init();

});
