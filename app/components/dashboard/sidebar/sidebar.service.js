(function () {
  'use strict';

  angular
    .module('jibbar.dashboard.sidebar')
    .service('jibbarDashboardSidebar', dashboardSidebarService);

  dashboardSidebarService.$inject = [];

  function dashboardSidebarService() {
    var isHidden = false;
    var isActive = false;

    var service = {
      hide: hide,
      show: show,
      getIsHidden: getIsHidden,
      activate: activate,
      deactivate: deactivate,
      toggleActiveState: toggleActiveState,
      getIsActive: getIsActive
    };

    return service;

    ///////

    function hide() {
      isHidden = true;
    }

    function show() {
      isHidden = false;
    }

    function getIsHidden() {
      return isHidden;
    }
    
    function activate() {
      isActive = true;
    }

    function deactivate() {
      isActive = false;
    }
    
    function toggleActiveState() {
      isActive = !isActive;
    }

    function getIsActive() {
      return isActive;
    }
  }
})();
