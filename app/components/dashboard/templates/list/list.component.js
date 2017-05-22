(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/templates/list/list.html',
    controller: TemplatesListController,
    bindings: {}
  };

  angular
    .module('jibbar.dashboard.templates.list')
    .component('jibbarDashboardTemplatesList', componentConfig);


  TemplatesListController.$inject = ['$scope','localStorageService','backService'];

  function TemplatesListController($scope,localStorageService,backService) {
    var vm = this;
    vm.page = {page: "list"}  
    vm.$onInit = $onInit;
    function $onInit() {
      backService.setCurrentPage('dashboard.templates.list');
      cleanLocalStorage();
    }

    function cleanLocalStorage(){
      localStorageService.remove("email.subject");
      localStorageService.remove("email.body");
      localStorageService.remove("addedContacts");
      localStorageService.remove("loadedGroups");
      localStorageService.remove("loadedContacts");
      localStorageService.remove("email.publicId");
    }
    
  }
})();