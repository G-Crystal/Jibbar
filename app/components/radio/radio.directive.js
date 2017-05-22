(function () {
  'use strict';

  angular
    .module('jibbar.radio')
    .directive('jibbarRadio', radioDirective);

  function radioDirective() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/radio/radio.html',
      require: {
        ngModelCtrl: '^ngModel'
      },
      scope: {
        ngModel: '=',
        radioName: '<',
        radioValue: '<'
      },
      controller: RadioController,
      controllerAs: '$ctrl',
      bindToController: true
    };

    return directive;
  }

  RadioController.$inject = ['$scope', '$element', 'jibbarRadio'];

  function RadioController($scope, $element, jibbarRadio) {
    var vm = this;

    vm.$onInit = $onInit;
    vm.$onDestroy = $onDestroy;
    vm.isSelected = isSelected;

    ///////

    function $onInit() {
      initOnChangeHandler();
      addValueToGroup();
      addClickListenerToElement();
    }

    function $onDestroy() {
      jibbarRadio.removeFromGroup(vm.radioName, vm.radioValue);
    }

    function initOnChangeHandler() {
      $scope.$watch('$ctrl.ngModel', function (newValue) {
        vm.ngModelCtrl.$setViewValue(newValue);
      });
    }

    function isSelected() {
      return vm.ngModel == vm.radioValue;
    }

    function addValueToGroup() {
      vm.ngModel = jibbarRadio.addToGroupAndGetValue(vm.radioName, vm.radioValue);
    }

    function addClickListenerToElement() {
      $element.click(function () {
        $scope.$apply(function () {
          vm.ngModel = vm.radioValue;
        });
      });
    }
  }
})();