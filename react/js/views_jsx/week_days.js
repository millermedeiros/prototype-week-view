/** @jsx React.DOM */
define(function(require) {
  var React = require('react');

  var WeekDays = React.createClass({
    render: function() {
      var days = this.props.days.map(function(day) {
        var hours = day.hours.map(function(hour, i) {
          var events = hour.events.map(function(event) {
            var style = {
              height: (event.duration * 3) + 'rem'
            };
            return (
              <li className="week-event" key={event.id} data-id={event.id} style={style}>{event.title}</li>
            );
          });

          return (
            <ol className="week-hour" data-hour={i} key={i}>
              {events}
            </ol>
          );
        });

        return (
          <section className="week-day" data-date={day.date} key={day.date}>
            <section className="week-day-hours">
              {hours}
            </section>
          </section>
        );
      });

      return (
        <section className="week-days">
          {days}
        </section>
      )
    }
  });

  return WeekDays;
});
