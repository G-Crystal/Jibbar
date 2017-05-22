(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/templates/trend/trend.html',
    controller: TemplatesTrendController,
    bindings: {}
  };

  angular
    .module('jibbar.dashboard.templates.trend')
    .component('jibbarDashboardTemplatesTrend', componentConfig);


  TemplatesTrendController.$inject = ['$scope','backService'];

  function TemplatesTrendController($scope, backService) {
    var vm = this;
    vm.page = {page: "trend"}  
    backService.setCurrentPage('dashboard.templates.trend');
  }
})();