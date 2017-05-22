(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'app.html',
    controller: AppController
  };

  angular
    .module('jibbar')
    .component('jibbar', componentConfig);

  AppController.$inject = ['$rootScope', '$anchorScroll', 'templateService', 'appSettings'];

  function AppController($rootScope, $anchorScroll, templateService, appSettings) {

      AWS.config.update({ accessKeyId: appSettings.aws.accessKey, secretAccessKey: appSettings.aws.secretKey });
      AWS.config.region = appSettings.aws.region;
     
    // add auto scroll to top after route change
    $rootScope.$on('$locationChangeSuccess', function () {
      $anchorScroll();
    });
  }
})();
