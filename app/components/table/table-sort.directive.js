(function () {
  'use strict';

  angular
    .module('jibbar.table')
    .directive('jibbarTableSort', tableSortDirective);

  function tableSortDirective() {
    var directive = {
      restrict: 'A',
      require: {
        table: '^^jibbarTable'
      },
      scope: {
        jibbarTableSort: '<'
      },
      controller: TableSortController,
      controllerAs: '$ctrl',
      bindToController: true
    };

    return directive;
  }

  TableSortController.$inject = ['$scope', '$element'];

  function TableSortController($scope, $element) {
    var vm = this;

    vm.$onInit = function () {
      addClickListener();
      setOrderAttributeAndWatchForChanges();
    };

    function addClickListener() {
      $element.click(function () {
        $scope.$apply(function () {
          if(!vm.table.tableSortBy || vm.table.tableSortBy[0] != vm.jibbarTableSort) {
            vm.table.tableSortBy = [vm.jibbarTableSort, 'asc'];
          }
          else if(vm.table.tableSortBy[1] == 'asc') {
            vm.table.tableSortBy = [vm.jibbarTableSort, 'desc'];
          }
          else {
            vm.table.tableSortBy = null;
          }
        });
      });
    }

    function setOrderAttributeAndWatchForChanges() {
      var isActiveSorting = vm.table.tableSortBy && vm.table.tableSortBy[0] == vm.jibbarTableSort;
      $element.attr('sort-order', isActiveSorting ? vm.table.tableSortBy[1] : '');

      $scope.$watch(function () {
        return vm.table.tableSortBy;
      }, function (newValue) {
        var isActiveSorting = newValue && newValue[0] == vm.jibbarTableSort;
        $element.attr('sort-order', isActiveSorting ? vm.table.tableSortBy[1] : '');
      });
    }
  }
})();