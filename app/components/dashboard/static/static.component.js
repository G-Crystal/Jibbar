(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/static/static.html',
    controller: StaticController,
    bindings: {}
  };

  angular
    .module('jibbar.dashboard.static')
    .component('jibbarDashboardStatic', componentConfig);

  StaticController.$inject = ['jibbarDashboardSidebar'];

  function StaticController(jibbarDashboardSidebar) {
    var vm = this;

    vm.$onInit = $onInit;
    vm.$onDestroy = $onDestroy;

    ///////

    function $onInit() {
      jibbarDashboardSidebar.hide();
      jibbarDashboardSidebar.activate();
    }

    function $onDestroy() {
      jibbarDashboardSidebar.deactivate();
      jibbarDashboardSidebar.show();
    }
  }
})();
