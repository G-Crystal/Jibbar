(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/top-menu/top-menu.html',
    controller: TopMenuController,
    bindings: {}
  };

  angular
    .module('jibbar.dashboard.top-menu')
    .component('jibbarDashboardTopMenu', componentConfig);

  TopMenuController.$inject = ['$element', '$scope', 'jibbarDashboardSidebar', 'authService', 'toastr', '$state', 'groupService', 'templateService', '$timeout', 'appSettings', 'jibbarHubService', 'notificationService', 'userImageService'];

  function TopMenuController($element, $scope, jibbarDashboardSidebar, authService, toastr, $state, groupService, templateService, $timeout, appSettings, jibbarHubService, notificationService, userImageService) {
    var vm = this;

    vm.isMenuVisible = false;
    vm.isNotificationsVisible = false;
	vm.unreadNotificationCount = 0;
    vm.$onInit = $onInit;
    vm.getMenuItems = getMenuItems;
    vm.isSidebarHidden = isSidebarHidden;
    vm.toggleSidebar = toggleSidebar;
    vm.toggleNotifications = toggleNotifications;
    vm.goToHelp = goToHelp;
    vm.logout = logout;
    vm.toggleMenu = toggleMenu;
    vm.image = null;
    vm.profileImageFound = false;
	vm.notifications = [];
    ///////



    var nameElement = null;
    var avatarElement = null;
    var notificationLinkElement = null;
    var notificationsElement = null;



    // var firstPart='images/dashboard-avatar-';
    // var secondPart='sample.png';
    // vm.urlImage =firstPart+secondPart;
    var menuItems = [
      
    ];   

    function $onInit() {
      nameElement = $element.find('.c-dashboard-top__name');
      avatarElement = $element.find('.c-dashboard-top__avatar-wrapper img');
      notificationLinkElement = $element.find('.c-dashboard-top__notification-link');
      notificationsElement = $element.find('.c-dashboard-top__notifications');

      closeMenuOnOutClick();
      closeNotificationsOnOutClick();
      setNotificationsDropdownPosition();

      getUserName();
      subscribeChangeProfilePicture();	 
      //GetProfilePicture();
	  
	  var existingProfilePicture = authService.getUserProfilePicture()
	 if(existingProfilePicture) {
		vm.profileImageFound = true;
		vm.profilePicturePath = existingProfilePicture;
	 }
	  
	  // if user is already authenticated (page refresh case)
	  if(authService.isAuthenticated()) {
			jibbarHubService.connect();  
			loadNotifications();
	  }
	  else {
		// if user is not authenticated, then subscribe to event and wait for user to authenticate properly (sign-in case)
		  jibbar.event.on(jibbar.event.events.SIGNEDIN_EVENT, function(data) {	
			loadNotifications();
			jibbarHubService.connect();
			
		  });
	  }
	  
	  
	  jibbarHubService.on('getNotification', function(data) { 
		loadNotifications();
	  })
    }

    function subscribeChangeProfilePicture() {
      jibbar.event.on(jibbar.event.events.PROFILE_PICTURE_CHANGED, function (data) {
        vm.profileImageFound = true;
		vm.profilePicturePath = data.url;
      });
    }   

    function getUserName() {
      authService.getUserInfo().then(
        function (result) {
          if (result.success) {
            vm.user = result.data.name + " " + result.data.surname;
            vm.profilePictureId = result.data.profilePictureId;
            
          } else {
            toastr.error(result.error.details, result.error.message);
          }
        },
        function (error) {
          toastr.error(error.details, error.message);
        }
      )
    }

    function getMenuItems() {
      return menuItems;
    }    
	
	function loadNotifications() {
		notificationService.getUserNotifications({
			maxResultCount: 3
		}).then(function (data) {
		
		
			vm.unreadNotificationCount = data.result.unreadCount;
			vm.notifications = [];
			$.each(data.result.items, function (index, item) {
				vm.notifications.push(item.notification.data.message);
			});
		});
	}

    function isSidebarHidden() {
      return jibbarDashboardSidebar.getIsHidden();
    }

    function toggleSidebar() {
      jibbarDashboardSidebar.toggleActiveState();
    }

    function toggleMenu() {
      vm.isMenuVisible = !vm.isMenuVisible;
    }

    function toggleNotifications() {
      vm.isNotificationsVisible = !vm.isNotificationsVisible;
    }

    function goToHelp(){
      $state.go('dashboard.help.index');
    }

    function closeMenuOnOutClick() {
      $(document).click(function (e) {
        avatarElement = $element.find('.c-dashboard-top__avatar-wrapper img');
        if (
          (!nameElement.is(e.target) && nameElement.has(e.target).length === 0) &&
          (!avatarElement.is(e.target) && avatarElement.has(e.target).length === 0)
        ) {
          $scope.$apply(function () {
            vm.isMenuVisible = false;
          });
        }
      });
    }

    function closeNotificationsOnOutClick() {
      $(document).click(function (e) {
        if (!notificationLinkElement.is(e.target) && notificationLinkElement.has(e.target).length === 0) {
          $scope.$apply(function () {
            vm.isNotificationsVisible = false;
          });
        }
      });
    }

    function setNotificationsDropdownPosition() {
      var linkRightOffset = angular.element(window).width() - notificationLinkElement.offset().left;
      var linkCenterOffset = linkRightOffset - (notificationLinkElement.width() / 2);
      notificationsElement.css('right', linkCenterOffset);
    }


    function logout() {

      authService.clearAuthToken();
      authService.clearUserProfilePicture();
      groupService.clearGroups();
      templateService.clearTemplateTypes();
      $state.go("home");
    }

  }
})();