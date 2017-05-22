(function () {
  'use strict';

  angular
    .module('jibbar.select')
    .directive('jibbarSelect', selectDirective);

  function selectDirective() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/select/select.html',
      require: {
        ngModelCtrl: '^ngModel'
      },
      scope: {
        ngModel: '=',
        selectOptions: '<',
        selectNameKey: '<',
        selectValueKey: '<',
        selectEmptyValue: '<'
      },
      controller: SelectController,
      controllerAs: '$ctrl',
      bindToController: true
    };

    return directive;
  }

  SelectController.$inject = ['$scope', '$element'];

  function SelectController($scope, $element) {
    var vm = this;

    vm.isOpened = false;
    vm.selectedOption = null;
    vm.filterValue = null;
    vm.filterActive = false;
    vm.$onInit = $onInit;
    vm.getOptionName = getOptionName;
    vm.getOptionValue = getOptionValue;
    vm.selectOption = selectOption;
    vm.openOptions = openOptions;

    ///////

    var valueElement = null;
    var optionsElement = null;
    var filterInputElement = null;

    function $onInit() {
      valueElement = $element.find('.c-select__value');
      optionsElement = $element.find('.c-select__options');
      filterInputElement = $element.find('.c-select__filter');


      initOnChangeHandler();
      setInitialOption();
      closeOptionsOnOutClick();
    }

    function initOnChangeHandler() {
      $scope.$watch('$ctrl.ngModel', function (newValue) {
        vm.ngModelCtrl.$setViewValue(newValue);
      });
    }

    function getOptionName(option) {
      if (!vm.selectNameKey || !option) return option;
      return option[vm.selectNameKey];
    }

    function getOptionValue(option) {
      if (!vm.selectValueKey || !option) return option;
      return option[vm.selectValueKey];
    }

    function selectOption(option) {
      vm.selectedOption = option;
      vm.ngModel = getOptionValue(option);
    }

    function setInitialOption() {
      Object.keys(vm.selectOptions).forEach(function (key) {
        if (getOptionValue(vm.selectOptions[key]) == vm.ngModel) {
          vm.selectedOption = vm.selectOptions[key];
        }
      });
    }

    function openOptions() {
      vm.isOpened = !vm.isOpened;

      if(vm.isOpened) {
        filterInputElement.focus();
      }
      else {
        filterInputElement.blur();
        vm.filterValue = null;
      }
    }

    function closeOptionsOnOutClick() {
      $(document).click(function (e) {
        if (!valueElement.is(e.target) && valueElement.has(e.target).length === 0) {
          $scope.$apply(function () {
            vm.isOpened = false;
            filterInputElement.blur();
            vm.filterValue = null;
          });
        }
      });
    }
  }
})();