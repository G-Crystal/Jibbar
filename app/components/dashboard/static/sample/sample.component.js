(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/static/sample/sample.html',
    controller: StaticSampleController,
    bindings: {}
  };

  angular
    .module('jibbar.dashboard.static.sample')
    .component('jibbarDashboardStaticSample', componentConfig);

  StaticSampleController.$inject = [];

  function StaticSampleController() {
  }
})();
