(function () {
  'use strict';

  angular
    .module('jibbar.letter-filter')
    .directive('jibbarLetterFilter', letterFilterDirective);

  function letterFilterDirective() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/letter-filter/letter-filter.html',
      scope: {
        ngModel: '='
      },
      controller: SelectController,
      controllerAs: '$ctrl',
      bindToController: true
    };

    return directive;
  }

  SelectController.$inject = [];

  function SelectController() {
    var vm = this;

    vm.options = [
      'All', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
      'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
    vm.selectOption = selectOption;
    vm.isSelected = isSelected;

    ///////

    function selectOption(option) {
      if (option == 'All') {
        vm.ngModel = null;
      }
      else {
        vm.ngModel = option;
      }
    }

    function isSelected(option) {
      return option == 'All' && vm.ngModel == null || option == vm.ngModel;
    }
  }
})();

