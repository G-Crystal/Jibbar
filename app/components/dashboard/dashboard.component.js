(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/dashboard.html',
    controller: DashboardController,
    bindings: {}
  };

  angular
    .module('jibbar.dashboard')
    .component('jibbarDashboard', componentConfig);

  DashboardController.$inject = ['jibbarDashboardSidebar'];

  function DashboardController(jibbarDashboardSidebar) {
    var vm = this;

    vm.isSidebarActive = function () {
      return jibbarDashboardSidebar.getIsActive()
    };
    vm.isSidebarHidden = function () {
      return jibbarDashboardSidebar.getIsHidden();
    };
  }
})();
