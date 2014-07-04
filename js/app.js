define(function(require, exports) {
  'use strict';

  // ---

  // seeded random to always get same events so we make sure we are testing
  // performance always under the same conditions
  var random = require('mout/random/random');
  var SeedRandom = require('seedrandom');
  var seeded = new SeedRandom('gaia-calendar');
  random.get = seeded;


  // ----


  var Vue = require('vue');

  var clamp = require('mout/math/clamp');
  var isSame = require('mout/date/isSame');
  var round = require('mout/math/round');
  var strftime = require('mout/date/strftime');
  var times = require('mout/function/times');

  var eventModel = require('./event');
  var GestureDetector = require('gesture_detector');

  var CELL_WIDTH = 58;
  var MIN_X = CELL_WIDTH * -10;
  var START_X = CELL_WIDTH * -5;

  var view, header;


  // ----


  exports.init = function() {

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    view = new Vue({
      el: '#week-view',
      data: {
        // vue can't handle date objects! :/
        baseDate: Number(today),
        wid: CELL_WIDTH / 10,
        scrollOffsetX: START_X,
        range: {
          startDate: null,
          endDate: null,
        },
        allday: 'All Day',
        hours: buildHours(),
        days: []
      },

      computed: {
        diff: function() {
          return Math.round((START_X - this.scrollOffsetX) / CELL_WIDTH);
        },

        weekHeader: function() {
          function monthYear(date) {
            // vue can't handle Date objects! :/
            return strftime(new Date(date), '%b %Y');
          }

          var str = monthYear(this.visibleRange.startDate);
          if (!isSameMonth(this.visibleRange.startDate, this.visibleRange.endDate)) {
            str += ' ' + monthYear(this.visibleRange.endDate);
          }
          return str;
        },

        visibleRange: function() {
          var startDate = new Date(this.range.startDate);
          startDate.setDate(startDate.getDate() + 5 + this.diff);
          var endDate = new Date(this.range.startDate);
          endDate.setDate(endDate.getDate() + 9 + this.diff);
          return {
            startDate: Number(startDate),
            endDate: Number(endDate)
          };
        }
      },

      filters: {
        weekDayName: function(value) {
          // vue can't handle date objects! :/
          return strftime(new Date(value), '%a %d');
        }
      },

      created: setupPan
    });

    header = new Vue({
      el: '#time-header',
      parent: view,

      methods: {
        showToday: function() {
          var today = new Date();
          today.setHours(0, 0, 0, 0);
          view.baseDate = Number(today);
        }
      }
    });

    updateDays();
    view.$watch('baseDate', updateDays);
  };


  function setupPan() {
    var element = document.querySelector('#week-view');
    var gd = new GestureDetector(element);

    gd.startDetecting();

    element.addEventListener('pan', function(evt) {
      var detail = evt.detail;
      var absX = Math.abs(detail.absolute.dx);
      var absY = Math.abs(detail.absolute.dy);

      if (absY > 30 || absX < absY) return;

      if (absX > 10) {
        evt.preventDefault();
        evt.stopPropagation();
      }

      view.scrollOffsetX = clamp(view.scrollOffsetX + detail.relative.dx, MIN_X, 0);
    });

    element.addEventListener('swipe', function() {
      view.scrollOffsetX = round(view.scrollOffsetX, CELL_WIDTH);
      updateBaseDate();
    });
  }


  function updateBaseDate() {
    // not a computed property since we only want to add/remove elements from
    // the DOM after user stops dragging
    var baseDate = new Date(view.baseDate);
    baseDate.setDate(baseDate.getDate() + view.diff);
    view.baseDate = Number(baseDate);
  }


  function buildHours() {
    var hours = [];
    times(24, function(i) {
      hours.push(i);
    });
    return hours;
  }


  function updateDays() {
    updateRange();

    var range = view.range;
    var rangeBase = range.startDate;
    var offset = 0;

    if (view.days.length) {
      // keep only days inside the range
      var day,
        n = view.days.length;
      while ((day = view.days[--n])) {
        if (!insideRange(range, day.date)) {
          view.days.$remove(day);
        }
      }

      if (view.days.length) {
        if (isSameDay(rangeBase, view.days[0].date)) {
          rangeBase = range.endDate;
          offset = view.days.length - 14;
        }
      }
    }

    var diff = 15 - view.days.length;

    if (!diff) return;

    times(diff, function(i) {
      var date = new Date(rangeBase);
      date.setDate(date.getDate() + offset + i);
      date.setHours(0, 0, 0, 0);
      var day = eventModel.getDay(date);
      if (rangeBase === range.endDate) {
        view.days.push(day);
      } else {
        view.days.splice(i, 0, day);
      }
    });

    // we need to sync the position to match the new amount of columns
    view.scrollOffsetX = START_X;
  }


  function isSameDay(d1, d2) {
    return Math.abs(d1 - d2) < 86400000;
  }


  function isSameMonth(d1, d2) {
    return isSame(new Date(d1), new Date(d2), 'month');
  }


  function updateRange() {
    var baseDate = new Date(view.baseDate);

    var endDate = new Date(baseDate);
    endDate.setDate(baseDate.getDate() + 9);
    endDate.setHours(0, 0, 0, 0);
    var startDate = new Date(baseDate);
    startDate.setDate(baseDate.getDate() - 5);
    startDate.setHours(0, 0, 0, 0);

    // vue can't handle date objects! :/
    startDate = Number(startDate);
    endDate = Number(endDate);

    view.range.startDate = startDate;
    view.range.endDate = endDate;
  }


  function insideRange(range, date) {
    return range.startDate <= date && range.endDate >= date;
  }


  // ---

  // I usually avoid to auto execute code, but since this is just a prototype
  // let's do it!
  exports.init();

});
