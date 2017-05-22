(function () {
  'use strict';

  angular
    .module('jibbar.recipients-search')
    .directive('jibbarRecipientsSearch', recipientsSearchDirective);

  function recipientsSearchDirective() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/recipients-search/recipients-search.html',
      scope: {
        onIndividualAdd: '&',
        onGroupAdd: '&'
      },
      controller: RecipientsSearchController,
      controllerAs: '$ctrl',
      bindToController: true
    };

    return directive;
  }

  RecipientsSearchController.$inject = ['$scope', '$element'];

  function RecipientsSearchController($scope, $element) {
    var vm = this;

    vm.$onInit = $onInit;
    vm.searchValue = null;
    vm.searchResult = null;
    vm.search = search;

    ///////

    var resultElement = null;
    var inputElement = null;

    function $onInit() {
      resultElement = $element.find('.c-recipients-search__result');
      inputElement = $element.find('.c-recipients-search__input');

      closeResultsOnOutClick();
    }

    var sampleSearchResult = {
      groups: [
        {
          name: 'Zooalogical Scociety',
          count: 45
        },
        {
          name: 'Zany Clown Factories',
          count: 32
        }
      ],
      individuals: [
        {
          fullName: 'Zachary Sequoia',
          email: 'email@zacharyseqioia.com'

        },
        {
          fullName: 'Zachariah Smith',
          email: 'z.smith@gmail.com'
        }
      ]
    };

    function search() {
      // TODO: implement search API

      if (vm.searchValue) {
        vm.searchResult = sampleSearchResult;
      }
      else {
        vm.searchResult = null;
      }
    }

    function closeResultsOnOutClick() {
      $(document).click(function (e) {
        if (
          (!resultElement.is(e.target) && resultElement.has(e.target).length === 0) &&
          (!inputElement.is(e.target) && inputElement.has(e.target).length === 0)
        ) {
          $scope.$apply(function () {
            vm.searchResult = null;
          });
        }
      });
    }
  }
})();