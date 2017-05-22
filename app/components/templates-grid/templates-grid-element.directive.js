(function () {
  'use strict';

  angular
    .module('jibbar.templates-grid')
    .directive('jibbarTemplatesGridElement', templatesGridElementDirective);

  function templatesGridElementDirective() {
    var directive = {
      restrict: 'A',
      scope: {},
      require: {
        parent: '^jibbarTemplatesGrid'
      },
      controller: TemplatesGridElementController,
      controllerAs: '$ctrl',
      bindToController: true
    };

    return directive;
  }

  TemplatesGridElementController.$inject = ['$element', '$scope', '$timeout'];

  function TemplatesGridElementController($element, $scope, $timeout) {
    var vm = this;

    vm.$postLink = $postLink;

    ///////

    var $window = angular.element(window);

    function $postLink() {
      $timeout(function () {
        setElementStyleAndWatchForChanges();
      }, 50);
    }

    function setElementStyleAndWatchForChanges() {
      function setWidth() {
        var isLast = ($scope.$parent.$index + 1) % vm.parent.templatesInRowCount == 0;

        $element.css({
          'width': vm.parent.templatePercentWidth + '%',
          'margin-right': isLast ? '0' : '2%'
        });
      }

      $window.resize(function () {
        $scope.$apply(function () {
          setWidth();
        });
      });

      setWidth();
    }
  }
})();