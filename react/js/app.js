define(function(require) {

  // seeded random to always get same events so we make sure we are testing
  // performance always under the same conditions
  var random = require('mout/random/random');
  var SeedRandom = require('seedrandom');
  var seeded = new SeedRandom('gaia-calendar');
  random.get = seeded;

  // ----

  var React = require('react');
  var WeekView = require('./views/week');

  var outlet = document.getElementById('outlet');
  // renderComponentToString speeds up the initial render (even tho we don't
  // all the data we need at this point it's a good approximation of the
  // actual experience)
  // on the hamachi it is 20x faster than renderComponent
  outlet.innerHTML = React.renderComponentToString(WeekView());

  React.renderComponent(WeekView(), outlet);

});
