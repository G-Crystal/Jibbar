(function() {
'use strict';

    angular
        .module('jibbar')
        .factory('jibbarHubService', jibbarHubService);

    jibbarHubService.$inject = ['appSettings', '$rootScope', '$timeout'];
    
    function jibbarHubService(appSettings, $rootScope, $timeout) {
		
		var proxy, connection;
		
		var service = {
			connect: connect,
			on: on,
			invoke: invoke
		}
		
		return service;
		
		function connect() {			
		
			connection = $.hubConnection(appSettings.BaseUri);
			proxy = connection.createHubProxy(appSettings.HubName);
			proxy.on('getNotification', function() {
				console.log('Something received through signalR');
			} );
			
			
			connection.start({jsonp: true}).done(function () { 
			proxy.invoke("register");
			console.warn("Signalr Connected!!"); });
			
			//reconnect if hub disconnects
			connection.disconnected(function () {
				$timeout(function () {
					if (connection.state === $.signalR.connectionState.disconnected) {
						connection.start();
					}
				}, 5000);
			});
		}
		
		function on(eventName, callback) {
			proxy.on(eventName, function (result) {
				$rootScope.$apply(function () {
					if (callback) {
						callback(result);
					}
				});
			});
		}
		
		function invoke(methodName, callback) {
			proxy.invoke(methodName)
				.done(function (result) {
					$rootScope.$apply(function () {
						if (callback) {
							callback(result);
						}
					});
				});
		}
	}
})();