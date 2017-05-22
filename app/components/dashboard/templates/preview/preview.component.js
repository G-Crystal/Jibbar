(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/templates/preview/preview.html',
    controller: TemplatesPreviewController,
    bindings: {
      sketch: '<',
      details: '<'
    }
  };

  angular
    .module('jibbar.dashboard.templates.preview')
    .component('jibbarDashboardTemplatesPreview', componentConfig);

  TemplatesPreviewController.$inject = ['$scope', '$element', '$stateParams', 'jibbarPopup', 'emailService','backService','statemoveService'];

  function TemplatesPreviewController($scope, $element, $stateParams, jibbarPopup, emailService, backService, statemoveService) {
    var vm = this;

    vm.emailData = null;
    vm.subject = null;
    vm.fromName = null;
    vm.reply = null;
    vm.$onInit = $onInit;
    vm.getDevicesList = getDevicesList;
    vm.saveEmailInfo = saveEmailInfo;
    vm.getLoaderIdSpaceRemoved = getLoaderIdSpaceRemoved;

    ///////

    var iframeElement = $element.find('.c-templates-preview__iframe');
    var iframeDocument;
    var iframeBodyElement;

    var devicesList = [
      'iPhone',
      'iOS tablet',
      'Google smartphone',
      'Google tablet',
      'Microsoft smartphone',
      'Microsoft tablet',
      'Lenovo smartphone',
      'Lenovo tablet',
      'Samsung smartphone',
      'Samsung tablet',
      'HTC smartphone',
      'Sony smartphone',
      'Sony tablet',
      'Huawei smartphone',
      'ZTE smartphone'
    ];

    ////////////////Notification on leaving editor start/////////////////////////////////////////
    $scope.$on("$stateChangeStart", function(event, next, current){
      statemoveService.checkMove(event,'dashboard.templates.preview',next,current.proceed);
    });
    ////////////////Notification on leaving editor end/////////////////////////////////////////

    function $onInit() {
      backService.setCurrentPage('dashboard.templates.preview');
      iframeElement.on('load', function () {
        $scope.$apply(function () {
          iframeDocument = iframeElement[0].contentDocument || iframeElement[0].contentWindow.document;
          iframeBodyElement = angular.element('body', iframeDocument);

          initTemplatePreview();
          adjustIframeHeightToItsContentHeight();
          getEmailData();
        });
      });
    }

    function getDevicesList() {
      return devicesList;
    }

    function initTemplatePreview() {
      iframeBodyElement.css({
        'margin': 0,
        'background-color': '#fff'
      });

      iframeBodyElement.html(vm.sketch);
    }

    function adjustIframeHeightToItsContentHeight() {
      iframeElement.height(iframeDocument.body.scrollHeight);
    }

    function getEmailData() {
      vm.emailData = emailService.getCurrentEmailInfo();
      
      vm.subject = vm.emailData.subject;
      vm.from = vm.emailData.from;
      vm.fromName = vm.emailData.fromName;
      vm.reply = vm.emailData.reply_address;
      
    }

    function saveEmailInfo(form) {
      if (!form.$valid) {
        return false;
      }
      vm.emailData.subject = vm.subject;
      //emailService.setCurrentEmailInfo(vm.emailData);
    }

    function getLoaderIdSpaceRemoved(device) {
     return device.replace(/[\s]/g, '');
    }
  }
})();
