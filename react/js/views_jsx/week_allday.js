/** @jsx React.DOM */
define(function(require, exports) {
  var React = require('react');
  var strftime = require('mout/date/strftime');


  var WeekAllDay = React.createClass({
    render: function() {
      var days = this.props.days.map(function(day) {
        var events = day.alldayEvents.map(function(event) {
          return (
            <li className="week-allday-event" key={event.id} data-id={event.id}>{event.title}</li>
          );
        });

        function dayName(date) {
          return strftime(date, '%a %d');
        }

        return (
          <section className="week-allday" key={day.date}>
            <h1 className="week-allday-date">{dayName(day.date)}</h1>
            <ol className="week-allday-events">
              {events}
            </ol>
          </section>
        );
      });

      return (
        <div className="week-alldays">
          {days}
        </div>
      );
    }
  });

  return WeekAllDay;
});
