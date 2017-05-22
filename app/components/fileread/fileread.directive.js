/* 
Directive For Excel Data read
*/
(function () {
  'use strict';

  angular
    .module('jibbar.fileread')
    .directive('jibbarFileread', filereadDirective);

  function filereadDirective() {
    var directive = {
      restrict: 'EA',
      require: {
        ngModelCtrl: '^ngModel'
      },
      scope: {
        ngModel: "="
      },
      controller: FilereadController,
      controllerAs: '$ctrl',
      bindToController: true
    };

    return directive;
  }

  FilereadController.$inject = ['$scope', '$element'];

  function FilereadController($scope, $element) {
    var vm = this;

    vm.isOpened = false;
    vm.selectedOption = null;
    vm.$onInit = $onInit;

    ///////

    var valueElement = null;
    var optionsElement = null;

    function $onInit() {
      initOnChangeHandler($scope, $element);
    }

    function initOnChangeHandler($scope, $element) {
      $element.on('change', function (changeEvent) {
        var reader = new FileReader();

        reader.onload = function (evt) {
          $scope.$apply(function () {
            var data = evt.target.result;

            var workbook = XLSX.read(data, {
              type: 'binary'
            });

            var headerNames = XLSX.utils.sheet_to_json(
              workbook.Sheets[workbook.SheetNames[0]], {
                header: 1
              }
            )[0];
            
            var data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            var str = JSON.stringify(data);
            str = str.replace(/firstname/ig, 'firstName');
            str = str.replace(/lastname/ig, 'lastName');
            str = str.replace(/email/ig, 'emailAddress');
            data = JSON.parse(str);
            //$scope.opts.columnDefs = [];
            // headerNames.forEach(function (h) {
            //     $scope.opts.columnDefs.push({ field: h });
            // });
            //$scope.opts.columnDefs.push({ field: 'Del', cellTemplate: '<button class="btn btn-link btn-icon-only" ng-click="grid.appScope.deleteRow(row)"><i class="icon-trash" style="font-weight:bold;color:red;"></i></button>' });

            //$scope.opts.data = data;
            //$scope.addedContacts = data;

            //$scope.ngModel = data;
            vm.ngModelCtrl.$setViewValue(data);
            $element.val(null);



          });



        };

        reader.readAsBinaryString(changeEvent.target.files[0]);
      });
    }

  }
})();