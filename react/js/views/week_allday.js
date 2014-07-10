/** @jsx React.DOM */
define(function(require, exports) {
  var React = require('react');
  var strftime = require('mout/date/strftime');


  var WeekAllDay = React.createClass({displayName: 'WeekAllDay',
    render: function() {
      var days = this.props.days.map(function(day) {
        var events = day.alldayEvents.map(function(event) {
          return (
            React.DOM.li( {className:"week-allday-event", key:event.id, 'data-id':event.id}, event.title)
          );
        });

        function dayName(date) {
          return strftime(date, '%a %d');
        }

        return (
          React.DOM.section( {className:"week-allday", key:day.date}, 
            React.DOM.h1( {className:"week-allday-date"}, dayName(day.date)),
            React.DOM.ol( {className:"week-allday-events"}, 
              events
            )
          )
        );
      });

      return (
        React.DOM.div( {className:"week-alldays"}, 
          days
        )
      );
    }
  });

  return WeekAllDay;
});
