(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/templates/templates.html',
    controller: TemplatesController,
    bindings: {}
  };

  angular
    .module('jibbar.dashboard.templates')
    .component('jibbarDashboardTemplates', componentConfig);

  TemplatesController.$inject = [];

  function TemplatesController() {
    var vm = this;

    vm.sketch = null;
    vm.schedule = null;
  }
})();
