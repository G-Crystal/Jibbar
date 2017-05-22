(function () {
  'use strict';

  angular
    .module('jibbar.timepicker')
    .config(timepickerConfig);

  timepickerConfig.$inject = ['$provide'];

  function timepickerConfig($provide) {
    // set local timepicker template as default for ui timepicker directives

    $provide.decorator('uibTimepickerDirective', timepickerDecorator);
    timepickerDecorator.$inject = ['$delegate'];
    function timepickerDecorator($delegate) {
      $delegate[0].templateUrl = 'components/timepicker/timepicker.html';
      return $delegate;
    }
  }
})();
