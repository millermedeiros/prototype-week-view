/** @jsx React.DOM */
define(function(require, exports) {
  var React = require('react');
  var WeekAllDay = require('./week_allday');

  // ----

  var remove = require('mout/array/remove');
  var clamp = require('mout/math/clamp');
  var isSame = require('mout/date/isSame');
  var round = require('mout/math/round');
  var strftime = require('mout/date/strftime');
  var times = require('mout/function/times');

  var eventModel = require('models/event');
  var GestureDetector = require('gesture_detector');

  // ----

  var CELL_WIDTH = 58;
  var MIN_X = CELL_WIDTH * -10;
  var START_X = CELL_WIDTH * -5;


  var WeekView = React.createClass({

    getDefaultProps: function() {
      var today = new Date();
      today.setHours(0, 0, 0, 0);

      return {
        baseDate: today
      };
    },


    getInitialState: function() {
      return {
        range: this.getRange(),
        days: []
      };
    },

    componentDidMount: function() {
      this.updateDays();
      this.setupPan();
      eventModel.onEventExpansion.add(this.forceUpdate, this);
    },


    render: function() {
      return (
        <main>
        <header id="time-header">
          <h1>{this.weekHeader()}</h1>
          <button type="button" onClick={this.showToday}>today</button>
        </header>
        <div id="week">
          <div className="week-sidebar-allday icon-allday">All day</div>

          <div className="week-alldays-wrapper">
            <WeekAllDay days={this.state.days} ref="weekAllDays" />
          </div>

          <div className="week-main">
            <div className="week-days-wrapper">
              <WeekSidebarHours />
              <WeekDays days={this.state.days} ref="weekDays" />
            </div>
          </div>
        </div>
      </main>
      );
    },


    getScrollDiff: function() {
      return Math.round((START_X - this.props.scrollOffsetX) / CELL_WIDTH);
    },


    showToday: function() {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      this.props.baseDate = today;
      this.updateDays();
    },


    weekHeader: function() {
      function monthYear(date) {
        return strftime(date, '%b %Y');
      }

      var visibleRange = this.getVisibleRange();
      var str = monthYear(visibleRange.startDate);
      if (!isSameMonth(visibleRange.startDate, visibleRange.endDate)) {
        str += ' ' + monthYear(visibleRange.endDate);
      }
      return str;
    },


    getVisibleRange: function() {
      var range = this.state.range;
      var diff = this.getScrollDiff();
      var startDate = new Date(range.startDate);
      startDate.setDate(startDate.getDate() + 5 + diff);
      var endDate = new Date(range.startDate);
      endDate.setDate(endDate.getDate() + 9 + diff);
      var visibleRange = {
        startDate: startDate,
        endDate: endDate
      };

      return visibleRange;
    },


    setupPan: function () {
      var element = this.getDOMNode();
      var gd = new GestureDetector(element);

      gd.startDetecting();

      element.addEventListener('pan', (evt) => {
        var detail = evt.detail;
        var absX = Math.abs(detail.absolute.dx);
        var absY = Math.abs(detail.absolute.dy);

        if (absY > 30 || absX < absY) return;

        if (absX > 10) {
          evt.preventDefault();
          evt.stopPropagation();
        }

        this.setScrollOffsetX(this.props.scrollOffsetX + detail.relative.dx);
      });

      element.addEventListener('swipe', () => {
        this.setScrollOffsetX(round(this.props.scrollOffsetX, CELL_WIDTH));
        this.updateBaseDateAfterScroll();
      });
    },


    setScrollOffsetX: function(value) {
      this.props.scrollOffsetX = clamp(value, MIN_X, 0);
      var transform = 'translateX(' + this.props.scrollOffsetX +'px)';
      this.refs.weekAllDays.getDOMNode().style.transform = transform;
      this.refs.weekDays.getDOMNode().style.transform = transform;
    },


    updateBaseDateAfterScroll: function () {
      // not a computed property since we only want to add/remove elements from
      // the DOM after user stops dragging
      var baseDate = new Date(this.props.baseDate);
      baseDate.setDate(baseDate.getDate() + this.getScrollDiff());
      this.props.baseDate = baseDate;
      this.updateDays();
    },


    updateDays: function () {
      var range = this.updateRange();
      var rangeBase = range.startDate;
      var offset = 0;
      var days = this.state.days.slice();

      if (days.length) {
        // keep only days inside the range
        var day,
          n = days.length;
        while ((day = days[--n])) {
          if (!insideRange(range, day.date)) {
            remove(days, day);
          }
        }

        if (days.length) {
          if (isSameDay(rangeBase, days[0].date)) {
            rangeBase = range.endDate;
            offset = days.length - 14;
          }
        }
      }

      var diff = 15 - days.length;

      if (!diff) return;

      times(diff, function(i) {
        var date = new Date(rangeBase);
        date.setDate(date.getDate() + offset + i);
        date.setHours(0, 0, 0, 0);
        var day = eventModel.getDay(date);
        if (rangeBase === range.endDate) {
          days.push(day);
        } else {
          days.splice(i, 0, day);
        }
      });

      this.setState({
        days: days
      });

      // we need to sync the position to match the new amount of columns
      this.setScrollOffsetX(START_X);
    },

    getRange: function() {
      var baseDate = this.props.baseDate;

      var endDate = new Date(baseDate);
      endDate.setDate(baseDate.getDate() + 9);
      endDate.setHours(0, 0, 0, 0);
      var startDate = new Date(baseDate);
      startDate.setDate(baseDate.getDate() - 5);
      startDate.setHours(0, 0, 0, 0);

      var range = {
        startDate: startDate,
        endDate: endDate
      };

      return range;
    },

    updateRange: function () {
      var range = this.getRange();

      // setState might be async
      this.setState({
        range: range
      });

      return range;
    }

  });


  function isSameDay(d1, d2) {
    return Math.abs(d1 - d2) < 86400000;
  }


  function isSameMonth(d1, d2) {
    return isSame(new Date(d1), new Date(d2), 'month');
  }


  function insideRange(range, date) {
    return range.startDate <= date && range.endDate >= date;
  }


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
  })


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

  exports.init = function() {
    React.renderComponent(<WeekView />, document.body);
  };

});

