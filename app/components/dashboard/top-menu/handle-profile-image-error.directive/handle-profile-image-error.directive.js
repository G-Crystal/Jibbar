(function() {
    "use strict";
    
    angular
        .module('jibbar.dashboard.top-menu.handleProfileImageError')
        .directive('handleProfileImageError', handleProfileImageErrorDirective);

    function handleProfileImageErrorDirective() {
        var direcative = {
            restrict: "A",
            scope: {
                onImageResponse: '&'
            },
            controller: HandleProfileImageErrorController,
            controllerAs: '$ctrl',
            bindToController: true
        };

        return direcative;
    }

    HandleProfileImageErrorController.$inject = ['$timeout', '$element', '$scope'];

    function HandleProfileImageErrorController($timeout, $element, $scope) {
        var vm = this;

        vm.$onInit = $onInit;
        
        function $onInit() {
            addErrorListenerToElement();
        }

        function addErrorListenerToElement() {
            $element.bind('error', function () {
                
                $timeout(function () {
                    vm.onImageResponse({ exists: false });
                })
                }
            );
        }
    }
}());
