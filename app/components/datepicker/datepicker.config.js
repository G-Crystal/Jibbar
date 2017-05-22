(function () {
  'use strict';

  angular
    .module('jibbar.datepicker')
    .config(datepickerConfig);

  datepickerConfig.$inject = ['$provide'];

  function datepickerConfig($provide) {
    // set local datepicker template as default for ui datepicker directives

    // datepicker
    $provide.decorator('uibDatepickerDirective', datepickerDecorator);
    datepickerDecorator.$inject = ['$delegate'];
    function datepickerDecorator($delegate) {
      $delegate[0].templateUrl = 'components/datepicker/datepicker.html';
      return $delegate;
    }

    // day
    $provide.decorator('uibDaypickerDirective', daypickerDecorator);
    daypickerDecorator.$inject = ['$delegate'];
    function daypickerDecorator($delegate) {
      $delegate[0].templateUrl = 'components/datepicker/day.html';
      return $delegate;
    }

    // month
    $provide.decorator('uibMonthpickerDirective', monthpickerDecorator);
    monthpickerDecorator.$inject = ['$delegate'];
    function monthpickerDecorator($delegate) {
      $delegate[0].templateUrl = 'components/datepicker/month.html';
      return $delegate;
    }

    // year
    $provide.decorator('uibYearpickerDirective', yearpickerDecorator);
    yearpickerDecorator.$inject = ['$delegate'];
    function yearpickerDecorator($delegate) {
      $delegate[0].templateUrl = 'components/datepicker/year.html';
      return $delegate;
    }
  }
})();
