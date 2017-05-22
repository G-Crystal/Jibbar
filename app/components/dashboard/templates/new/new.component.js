(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/templates/new/new.html',
    controller: TemplatesNewController,
    bindings: {}
  };

  angular
    .module('jibbar.dashboard.templates.new')
    .component('jibbarDashboardTemplatesNew', componentConfig);


  TemplatesNewController.$inject = ['$scope','backService'];

  function TemplatesNewController($scope,backService) {
    var vm = this;
    vm.page = {page: "new"}  
    backService.setCurrentPage('dashboard.templates.new');
  }
})();