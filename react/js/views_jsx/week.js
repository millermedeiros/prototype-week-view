/** @jsx React.DOM */
define(function(require) {
  var React = require('react');

  // ---

  var WeekAllDay = require('./week_allday');
  var WeekSidebarHours = require('./week_sidebar');
  var WeekDays = require('./week_days');

  // ----

  var remove = require('mout/array/remove');
  var unique = require('mout/array/unique');
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
        baseDate: today,
        range: this.getRange(today),
      };
    },


    getInitialState: function() {
      return {
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
            <WeekAllDay days={this.state.days} ref="weekAllDay" />
          </div>

          <div className="week-main" ref="weekMain">
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
      var range = this.props.range;
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

      var self = this;
      var isVertical;
      var isHorizontal;

      element.addEventListener('pan', function(evt) {
        if (isVertical) return;
        var detail = evt.detail;

        // this complex logic is to make sure this block is only executed once
        if (!isVertical && !isHorizontal) {
          isVertical = Math.abs(detail.absolute.dx) < Math.abs(detail.absolute.dy);
          isHorizontal = !isVertical;

          if (isVertical) return;

          // XXX: I believe there is an issue with APZ and
          // toggling the overflowY while the scrollbar is disappearing, so for
          // now we can't really avoid the vertical scroll..
          // self.refs.weekMain.getDOMNode().style.overflowY = 'hidden';
          evt.stopPropagation();
          evt.preventDefault();
        }

        self.setScrollOffsetX(self.props.scrollOffsetX + detail.relative.dx);
      });

      element.addEventListener('swipe', function() {
        self.setScrollOffsetX(round(self.props.scrollOffsetX, CELL_WIDTH));
        self.updateBaseDateAfterScroll();

        // XXX: I believe there is an issue with APZ and
        // toggling the overflowY while the scrollbar is disappearing, so for
        // now we can't really avoid the vertical scroll..
        // if (isHorizontal) {
          // self.refs.weekMain.getDOMNode().style.overflowY = 'scroll';
        // }

        isVertical = false;
        isHorizontal = false;
      });
    },


    setScrollOffsetX: function(value) {
      this.props.scrollOffsetX = clamp(value, MIN_X, 0);
      var transform = 'translateX(' + this.props.scrollOffsetX +'px)';
      this.refs.weekAllDay.getDOMNode().style.transform = transform;
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
        days.push(day);
      });

      // FIXME: the logic of this method is wrong (probably the way I create
      // the dates is wrong) so we need to remove duplicates and sort the dates
      days = unique(days, function(a, b) {
        return Number(a.date) === Number(b.date);
      }).sort(function(a, b) {
        // using sort since it's simpler than splice (even tho it's slower)
        return Number(a.date) - Number(b.date);
      });

      this.setState({
        days: days
      });

      // we need to sync the position to match the new amount of columns
      this.setScrollOffsetX(START_X);
    },

    getRange: function(baseDate) {
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
      var range = this.getRange(this.props.baseDate);
      this.props.range = range;
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


  return WeekView;

});

