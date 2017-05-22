(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/templates/sent/sent.html',
    controller: TemplatesSentController,
    bindings: {}
  };

  angular
    .module('jibbar.dashboard.templates.sent')
    .component('jibbarDashboardTemplatesSent', componentConfig);

  TemplatesSentController.$inject = ['$stateParams'];

  function TemplatesSentController($stateParams) {
    var vm = this;

    vm.templateName = null;
    vm.$onInit = $onInit;
    vm.getSentTemplates = getSentTemplates;

    ///////

    var sentTemplates = [
      {
        date: '14 August 2016',
        recipients: 516,
        openRate: 87,
        header: 'Promotional offer with 25% off all orders before January',
        preview: 'images/sample-template-1.png'
      },
      {
        date: '12 August 2016',
        recipients: 5160,
        openRate: 87,
        header: 'Promotional offer with 25% off all orders before January',
        preview: 'images/sample-template-2.png'
      },
      {
        date: '1 August 2016',
        recipients: 516,
        openRate: 87,
        header: 'Promotional offer with 25% off all orders before January',
        preview: 'images/sample-template-3.jpg'
      },
      {
        date: '14 August 2016',
        recipients: 516,
        openRate: 87,
        header: 'Promotional offer with 25% off all orders before January',
        preview: 'images/sample-template-4.jpg'
      },
      {
        date: '14 August 2016',
        recipients: 516,
        openRate: 87,
        header: 'Promotional offer with 25% off all orders before January',
        preview: 'images/sample-template-5.png'
      },
      {
        date: '14 August 2016',
        recipients: 516,
        openRate: 87,
        header: 'Promotional offer with 25% off all orders before January',
        preview: 'images/sample-template-6.jpg'
      }
    ];

    function $onInit() {
      getTemplateName();
    }

    function getTemplateName() {
      //TODO
      var templateID = $stateParams.templateId;
      vm.templateName = 'Lorem ipsum ' + templateID;
    }

    function getSentTemplates() {
      return sentTemplates;
    }
  }
})();
