(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/templates/favourite/favourite.html',
    controller: TemplatesFavouriteController,
    bindings: {}
  };

  angular
    .module('jibbar.dashboard.templates.favourite')
    .component('jibbarDashboardTemplatesFavourite', componentConfig);


  TemplatesFavouriteController.$inject = ['$scope','backService'];

  function TemplatesFavouriteController($scope,backService) {
    var vm = this;
    backService.setCurrentPage('dashboard.templates.favourite');
    vm.page = {page: "favourite"}  
  }
})();