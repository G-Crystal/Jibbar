(function () {
  'use strict';

  angular
    .module('jibbar.templates-grid')
    .directive('jibbarTemplatesGrid', templatesGridDirective);

  function templatesGridDirective() {
    var directive = {
      restrict: 'A',
      scope: {},
      controller: TemplatesGridController,
      controllerAs: '$ctrl',
      bindToController: true
    };

    return directive;
  }

  TemplatesGridController.$inject = ['$element', '$scope'];

  function TemplatesGridController($element, $scope) {
    var vm = this;

    vm.gridWidth = null;
    vm.templatesInRowCount = null;
    vm.templatePercentWidth = null;
    vm.$postLink = $postLink;

    ///////

    var $window = angular.element(window);

    function $postLink() {
      setGridWidthAndWatchForChanges();
      setTemplatesInRowCountAndWatchForChanges();
    }

    function setGridWidthAndWatchForChanges() {
      vm.gridWidth = $element.width();

      $window.resize(function () {
        $scope.$apply(function () {
          vm.gridWidth = $element.width();
        });
      });
    }

    function setTemplatesInRowCountAndWatchForChanges() {
      function setCount() {
        var divider = 350;
        if (vm.gridWidth <= 1100) {
          divider = 310;
        }

        vm.templatesInRowCount = Math.floor(vm.gridWidth / divider);
        vm.templatePercentWidth = (100 - ((vm.templatesInRowCount - 1) * 2)) / vm.templatesInRowCount;
      }

      $window.resize(function () {
        $scope.$apply(function () {
          setCount();
        });
      });

      setCount();
    }
  }
})();