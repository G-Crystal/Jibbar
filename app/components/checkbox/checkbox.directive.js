(function () {
  'use strict';

  angular
    .module('jibbar.checkbox')
    .directive('jibbarCheckbox', checkboxDirective);

  function checkboxDirective() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/checkbox/checkbox.html',
      scope: {
        ngModel: '='
      },
      controller: CheckboxController,
      controllerAs: '$ctrl',
      bindToController: true
    };

    return directive;
  }

  CheckboxController.$inject = ['$scope', '$element'];

  function CheckboxController($scope, $element) {
    var vm = this;

    vm.$onInit = $onInit;

    ///////

    function $onInit() {
      addClickListenerToElement();
    }

    function addClickListenerToElement() {
      $element.click(function () {
        $scope.$apply(function () {
          vm.ngModel = !vm.ngModel;
        });
      });
    }
  }
})();