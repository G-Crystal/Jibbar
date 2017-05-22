(function () {
  'use strict';

  angular
    .module('jibbar')
    .config(AppConfig)
    .run(AppRun);

  AppConfig.$inject = ['$urlRouterProvider', '$locationProvider', '$animateProvider', 'localStorageServiceProvider', 'blockUIConfig', 'appSettings'];

  function AppConfig($urlRouterProvider, $locationProvider, $animateProvider, localStorageServiceProvider, blockUIConfig, appSettings) {
    //$locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/dashboard/templates');

    blockUIConfig.message = 'Please wait..';

    // enable animations only for specific class elements
    $animateProvider.classNameFilter(/ng-animated/);

    localStorageServiceProvider
      .setPrefix('jibber')
      .setStorageType('localStorage')
      .setNotify(true, true);

    
      
  }

  AppRun.$inject = ['$rootScope', '$state', '$http', 'authService'];

  function AppRun($rootScope, $state, $http, authService) {

    $rootScope.$on('$stateChangeStart', function (evt, toState, toParams, fromState, fromParams) {
      // keep user logged in after page refresh
      $rootScope.globals = authService.getAuthToken() || {};
      //console.log("SavedToken:" + authService.getAuthToken());
      //console.log('isAuth:'+ authService.isAuthenticated())
      //$http.defaults.headers.common['Authorization'] = 'Bearer ' + $rootScope.globals;
      if (toState.data != null && toState.data.authRequired === true) {
        if (!authService.isAuthenticated()) {
          evt.preventDefault();
          $state.go('home.sign-in');
        }
      }
    });
  }

})();