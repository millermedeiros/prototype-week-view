/** @jsx React.DOM */
define(function(require) {

  var React = require('react');

  var WeekSidebarHours = React.createClass({
    render: function() {
      var hours = [];
      var i = -1;
      while(++i < 24) {
        hours.push(<li data-hour={i} key={i}>{i}</li>);
      }

      return (
        <ol className="week-sidebar-hours">
          {hours}
        </ol>
      );
    }
  });

  return WeekSidebarHours;

});
