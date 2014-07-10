/** @jsx React.DOM */
define(function(require) {
  var React = require('react');

  var WeekDays = React.createClass({displayName: 'WeekDays',
    render: function() {
      var days = this.props.days.map(function(day) {
        var hours = day.hours.map(function(hour, i) {
          var events = hour.events.map(function(event) {
            var style = {
              height: (event.duration * 3) + 'rem'
            };
            return (
              React.DOM.li( {className:"week-event", key:event.id, 'data-id':event.id, style:style}, event.title)
            );
          });

          return (
            React.DOM.ol( {className:"week-hour", 'data-hour':i, key:i}, 
              events
            )
          );
        });

        return (
          React.DOM.section( {className:"week-day", 'data-date':day.date, key:day.date}, 
            React.DOM.section( {className:"week-day-hours"}, 
              hours
            )
          )
        );
      });

      return (
        React.DOM.section( {className:"week-days"}, 
          days
        )
      )
    }
  });

  return WeekDays;
});
