// this was used just as a easy way to detect how much the react.js file
// impacts the app startup without having to change the whole code structure
// use set on r.js the paths: {react: 'fake-react'} so it becomes a noop
define(function() {
  return {
    createClass: function() {
      return function(){};
    },
    renderComponent: function(a, b, cb) {
      cb && cb();
    },
    renderComponentToString: function() {
      return ' |component| ';
    }
  }
});
