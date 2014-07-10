define(function(require, exports) {
  'use strict';

  var Signal = require('signals');

  var times = require('mout/function/times');
  var strftime = require('mout/date/strftime');
  var randInt = require('mout/random/randInt');
  var choice = require('mout/random/choice');
  var guid = require('mout/random/guid');

  var _eventsCache = {};

  var names = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean non metus urna. Etiam vitae turpis vel sem pulvinar accumsan in in leo. Praesent libero mauris, ultricies sit amet felis feugiat, dignissim condimentum felis. Mauris varius lectus et accumsan tristique. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut in lorem sed augue feugiat tempor nec eu libero. Vivamus tempor lacinia aliquam. Sed eget porttitor leo. Interdum et malesuada fames ac ante ipsum primis in faucibus.'.split(' ');


  function getDayId(date) {
    return strftime(date, '%Y-%m-%d');
  }

  exports.onEventExpansion = new Signal();

  exports.getDay = function(date) {
    var day = {
      date: date,
      hours: getDayHours(),
      alldayEvents: []
    };

    var id = getDayId(date);
    if (_eventsCache[id]) {
      // we add a delay just so it's async (avoid blocking thread)
      setTimeout(function() {
        addEventsToDay(day, _eventsCache[id]);
      }, 10);
    } else {
      // simulate async event expansion
      setTimeout(function() {
        var events = getEvents(date);
        addEventsToDay(day, events);
      }, randInt(100, 1000));
    }

    return day;
  };


  function addEventsToDay(day, events) {
    events.forEach(function(event) {
      if (event.isAllDay) {
        day.alldayEvents.push(event);
      } else {
        var hour = (new Date(event.startDate)).getHours();
        day.hours[hour].events.push(event);
      }
    });
    exports.onEventExpansion.dispatch();
  }


  function getDayHours() {
    var hours = [];
    times(24, function(i) {
      hours.push({
        hour: i,
        events: []
      });
    });
    return hours;
  }


  function getEvents(date) {
    var id = getDayId(date);
    if (_eventsCache[id]) {
      return _eventsCache[id];
    }

    var events = _eventsCache[id] = [];
    times(randInt(0, 5), function() {
      var startDate = new Date(date);
      date.setHours(randInt(0, 23));
      var endDate = new Date(startDate);
      var duration = randInt(1, 4);
      endDate.setHours(endDate.getHours() + duration);

      var event = {
        isAllDay: randInt(0, 5) > 4,
        startDate: startDate,
        endDate: endDate,
        duration: duration,
        id: guid()
      };

      event.title = choice(names);
      event.title += randInt(0, 1) ? ' ' + choice(names) : '';

      events.push(event);
    });

    return events;
  }

});
