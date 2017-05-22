(function () {
  'use strict';

  angular
    .module('jibbar.select')
    .filter('jibbarSelectFilter', function () {
      return function (input, search, nameKey) {
        if (!input) return input;
        if (!search) return input;

        var expected = ('' + search).toLowerCase();
        var result = {};

        angular.forEach(input, function (value, key) {
          var actual = '';

          if(nameKey) {
            actual += value[nameKey];
          }
          else {
            actual += value;
          }

          if(actual.toLowerCase().indexOf(expected) !== -1) {
            result[key] = value;
          }
        });

        return result;
      }
    });
})();