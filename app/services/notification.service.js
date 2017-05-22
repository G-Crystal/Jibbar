(function() {
'use strict';

    angular
        .module('jibbar')
        .factory('notificationService', notificationService);

    notificationService.$inject = ['$http', '$q', 'appSettings', 'authService', 'localStorageService'];
    
    function notificationService($http, $q, appSettings, authService, localStorageService) {
        var authToken = authService.getAuthToken();  
        var httpHeaders = { 'Authorization': 'Bearer ' + authToken };
        var service = { 
            getUserNotifications:getUserNotifications
        };
        
        return service;

        function getUserNotifications(args) {
			var deferred = $q.defer();		
			$http({
                method: 'POST',
                url: appSettings.BaseUri + appSettings.ServiceApiUri + "notification/GetUserNotifications",
				data: args,
                headers:httpHeaders
				})
				.success(function (data) {
				deferred.resolve(data);
			}).error(function (msg, code) {
				deferred.reject(msg);
			});
			
            return deferred.promise;
        }
    }
})();