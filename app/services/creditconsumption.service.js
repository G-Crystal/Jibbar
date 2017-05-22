(function () {
    'use strict';

    angular
        .module('jibbar')
        .factory('creditconsumptionService', creditconsumptionService);

    creditconsumptionService.$inject = ['$http', '$q', 'appSettings', 'authService'];

    function creditconsumptionService($http, $q, appSettings, authService) {
        var service = {
            getCreditConsumption: getCreditConsumption
            
        };
        return service;

        ////////////////        
        function getCreditConsumption() {
            var authToken = authService.getAuthToken();
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: appSettings.AdminBaseUri + "GetCreditConsumptions",
                data: {
                }
            }).success(function (data) {
                deferred.resolve({
                    data: data.credit_consumptions,
                    success: 'true',
                    error: ''
                });
            }).error(function (msg, code) {
                deferred.reject(msg);
            });
            return deferred.promise;
        }
    }
})();