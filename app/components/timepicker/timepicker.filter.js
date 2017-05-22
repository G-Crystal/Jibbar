(function () {
  'use strict';

  angular
    .module('jibbar.timepicker')
    .filter('previousHour', previousHourFilter)
    .filter('nextHour', nextHourFilter)
    .filter('previousMinute', previousMinuteFilter)
    .filter('nextMinute', nextMinuteFilter);

  function previousHourFilter() {
    return function (input) {
      if (input == 1) input = 13;
      return pad(parseInt(input) - 1);
    };
  }

  function nextHourFilter() {
    return function (input) {
      if (input == 12) input = 0;
      return pad(parseInt(input) + 1);
    };
  }

  function previousMinuteFilter() {
    return function (input) {
      if (input == 0) input = 60;
      return pad(parseInt(input) - 1);
    };
  }

  function nextMinuteFilter() {
    return function (input) {
      if (input == 59) input = -1;
      return pad(parseInt(input) + 1);
    };
  }

  function pad(value) {
    if (value < 10) {
      return '0' + value;
    }
    else {
      return value;
    }
  }
})();
