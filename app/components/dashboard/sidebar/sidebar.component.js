(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/sidebar/sidebar.html',
    controller: SidebarController,
    bindings: {}
  };

  angular
    .module('jibbar.dashboard.sidebar')
    .component('jibbarDashboardSidebar', componentConfig);

  SidebarController.$inject = ['$element', '$state', 'jibbarDashboardSidebar',  'toastr', '$timeout'];

  function SidebarController($element, $state, jibbarDashboardSidebar, toastr, $timeout) {
    var vm = this;

    vm.$onInit = $onInit;
    vm.getSidebarMenu = getSidebarMenu;
    vm.isItemActive = isItemActive;
    vm.isSubLinkActive = isSubLinkActive;
    vm.deactivateSidebar = deactivateSidebar;
    //vm.loadSideBarGroups = loadSideBarGroups;
    vm.groupsInMenu = [];

    vm.groupMenuItem = {
      title: '',
      sref: ''
    };

    ///////

    var menuElement = $element.find('.c-dashboard-sidebar__menu');

    function $onInit() {
      //vm.loadSideBarGroups();
      updateScrollbarAndWatchForHeightChange();
    }

    var sidebarMenu = [{
      title: 'Email Templates',
      iconSlug: 'templates',
      sref: 'dashboard.templates.list',
      subLinks: [{
        title: 'All',
        sref: "dashboard.templates.list"
        
      }]
    }]


    function getSidebarMenu() {
      return sidebarMenu;
    }

    function isItemActive(item) {

      if ($state.is(item.sref)) return true;
      if (!item.subLinks) return false;

      // check sub links
      for (var i = 1; i < item.subLinks.length; i++) {
        if (vm.isSubLinkActive(item.subLinks[i])) return true;
      }
    }

    function isSubLinkActive(subLink) {
      if ($state.is(subLink.sref)) return true;
      // check sub link's children
      if (subLink.children) {
        for (var i = 0; i < subLink.children.length; i++) {
          if ($state.is(subLink.children[i])) return true;
        }
      }
    }

    
    function updateScrollbarAndWatchForHeightChange() {
      menuElement.perfectScrollbar('update');

      new ResizeSensor(menuElement, function () {
        menuElement.perfectScrollbar('update');
      });
    }
    
    function deactivateSidebar() {
      jibbarDashboardSidebar.deactivate();
    }
  }
})();
