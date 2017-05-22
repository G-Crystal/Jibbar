/**
 * In transcluded content you can use $jt to access table directive methods.
 * Use $jt.getItems() to get filtered and sorted items.
 *
 * You have to provide tableItems or tableItemsPerPage to make directive valid.
 */

(function () {
  'use strict';

  angular
    .module('jibbar.table')
    .directive('jibbarTable', tableDirective);

  function tableDirective() {
    var directive = {
      restrict: 'EA',
      templateUrl: 'components/table/table.html',
      scope: {
        tableItems: '=?',
        tableCurrentPage: '=?',
        tableItemsPerPage: '=?',
        tableItemsCount: '=?',
        tableSortBy: '=?',
        tableFilterBy: '=?',
        tableItemName: '<?',
        onTableItemsFilter: '&',
        tableExportColumns: '<',
        tableExportHeader: '<',
        tableCsvExport: '<',
        tablePdfExport: '<',
        tableShowAll: '<'
      },
      transclude: true,
      controller: TableController,
      controllerAs: '$ctrl',
      bindToController: true
    };

    return directive;
  }

  TableController.$inject = ['$element', '$transclude', '$scope', '$filter'];

  function TableController($element, $transclude, $scope, $filter) {
    var vm = this;

    vm.$onInit = $onInit;
    vm.getFirstDisplayingItemIndex = getFirstDisplayingItemIndex;
    vm.getLastDisplayingItemIndex = getLastDisplayingItemIndex;
    vm.goToFirstPage = goToFirstPage;
    vm.goToPreviousPage = goToPreviousPage;
    vm.goToNextPage = goToNextPage;
    vm.goToLastPage = goToLastPage;
    vm.onItemsPerPageInputBlur = onItemsPerPageInputBlur;
    vm.getItems = getItems;
    vm.getItemsCount = getItemsCount;
    vm.checkUncheckAll = checkUncheckAll;
    vm.getCSVContent = getCSVContent;
    vm.generatePDF = generatePDF;
    vm.setItemsPerPage = setItemsPerPage;

    ///////

    var MIN_ITEMS_PER_PAGE = 5;

    var pdfTemplate = {
      content: [
        {
          style: 'table',
          table: {
            headerRows: 1,
            widths: [],
            body: []
          },
          layout: {
            hLineWidth: function (i, node) {
              return 1;
            },
            vLineWidth: function (i, node) {
              return 1;
            },
            hLineColor: function (i, node) {
              return '#bbb';
            },
            vLineColor: function (i, node) {
              return '#bbb';
            }
          }
        }
      ],
      styles: {
        table: {
          fontSize: 12,
          color: '#333'
        },
        header: {
          bold: true,
          fontSize: 13
        }
      }
    };

    function $onInit() {
      validate();
      setDefaultScopeValues();
      transclude();
      watchForItemsPerPageChangeAndCalculateCurrentPage();
    }

    function validate() {
      if (!vm.tableItems && !vm.tableItemsCount) {
        throw 'You have to pass tableItems or tableItemsCount value to directive';
      }
    }

    function setDefaultScopeValues() {
      vm.tableCurrentPage = vm.tableCurrentPage || 1;
      vm.tableItemsPerPage = vm.tableItemsPerPage || 20;
      vm.tableFilterBy = vm.tableFilterBy || '';
      vm.tableItemName = vm.tableItemName || 'items';
    }

    function transclude() {
      var transcludeScope = $scope.$parent.$new();
      transcludeScope.$jt = vm;

      $transclude(transcludeScope, function (clone, scope) {
        $element.find('.c-table__table').html(clone);
      });
    }

    function watchForItemsPerPageChangeAndCalculateCurrentPage() {
      $scope.$watch('$ctrl.tableItemsPerPage', function () {
        if (vm.tableCurrentPage > getTotalPagesCount()) {
          vm.tableCurrentPage = getTotalPagesCount();
        }
      });
    }

    function getFirstDisplayingItemIndex() { 
      if(vm.tableCurrentPage==0){goToNextPage();};
      return vm.tableCurrentPage == 1 ? 1 : (vm.tableCurrentPage - 1) * getItemsPerPageCount() + 1;
    }

    function getLastDisplayingItemIndex() {
   	  
	  var lastIndex = getItemsPerPageCount() * vm.tableCurrentPage;
      return getItemsCount() < lastIndex ? getItemsCount() : lastIndex;
    }

    function goToFirstPage() {
      vm.tableCurrentPage = 1;
    }

    function goToPreviousPage() {
      if (vm.tableCurrentPage == 1) return;
      vm.tableCurrentPage -= 1;
    }

    function goToNextPage() {
      if (vm.tableCurrentPage == getTotalPagesCount()) return;
      vm.tableCurrentPage += 1;
    }

    function goToLastPage() {
      vm.tableCurrentPage = getTotalPagesCount();
    }

    function getItemsCount() {
      return vm.tableItemsCount || getFilteredItems().length;
    }

    function getTotalPagesCount() {
      return Math.ceil(getItemsCount() / getItemsPerPageCount());
    }

    function getItemsPerPageCount() {  
      return vm.tableItemsPerPage > MIN_ITEMS_PER_PAGE ? vm.tableItemsPerPage : MIN_ITEMS_PER_PAGE;
    }

    function onItemsPerPageInputBlur() {
      if (vm.tableItemsPerPage < MIN_ITEMS_PER_PAGE) {
        vm.tableItemsPerPage = MIN_ITEMS_PER_PAGE;
      }
    }

    function getItems() {
      var filteredItems = $filter('limitTo')(
        $filter('orderBy')(
          getFilteredItems(),

          vm.tableSortBy && vm.tableSortBy[0],
          vm.tableSortBy && vm.tableSortBy[1] == 'desc'
        ),

        getItemsPerPageCount(),
        getFirstDisplayingItemIndex()-1
      );

      vm.onTableItemsFilter({items: filteredItems});

      return filteredItems;
    }

    function getFilteredItems() {
      return $filter('filter')(vm.tableItems, vm.tableFilterBy);
    }

    function checkUncheckAll(flag){
      
      $.map( vm.getItems(), function( val, i ) {
         val.isSelected = flag;
      });
      
    }
    
    function getCSVContent() {
      var result = [];

      angular.forEach(vm.tableItems, function (item, itemKey) {
        angular.forEach(item, function (column, columnKey) {
          if(vm.tableExportColumns.indexOf(columnKey) !== -1) {
            result[itemKey] = result[itemKey] || {};
            result[itemKey][columnKey] = column;
          }
        });
      });

      return result;
    }

    function generatePDF() {
      var template = angular.copy(pdfTemplate);

      // Add header
      template.content[0].table.body[0] = [];
      angular.forEach(vm.tableExportHeader, function (value) {
        template.content[0].table.body[0].push({
          style: 'header',
          text: value
        });
      });

      // Add widths
      angular.forEach(vm.tableExportColumns, function () {
        template.content[0].table.widths.push('*');
      });

      // Add content
      angular.forEach(vm.tableItems, function (item, itemKey) {
        var tableItem = [];

        angular.forEach(item, function (column, columnKey) {
          if(vm.tableExportColumns.indexOf(columnKey) !== -1) {
            tableItem.push(vm.tableItems[itemKey][columnKey]);
          }
        });

        if(tableItem.length) {
          template.content[0].table.body.push(tableItem);
        }
      });

      pdfMake.createPdf(template).download('jibbar-export.pdf');
    }

    function setItemsPerPage(count) {
      vm.tableItemsPerPage = count;
    }
  }
})();