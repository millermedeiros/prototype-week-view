/** @jsx React.DOM */
define(function(require) {

  var React = require('react');

  var WeekSidebarHours = React.createClass({displayName: 'WeekSidebarHours',
    render: function() {
      var hours = [];
      var i = -1;
      while(++i < 24) {
        hours.push(React.DOM.li( {'data-hour':i, key:i}, i));
      }

      return (
        React.DOM.ol( {className:"week-sidebar-hours"}, 
          hours
        )
      );
    }
  });

  return WeekSidebarHours;

});
