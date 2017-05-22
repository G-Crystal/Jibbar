(function () {
    'use strict';

    angular
        .module('jibbar')
        .factory('signatureService', signatureService);

    signatureService.$inject = ['$http', '$q', 'appSettings', 'authService','localStorageService'];

    function signatureService($http, $q, appSettings, authService, localStorageService) {
        var serviceUrl = "signature/CreateSignature";
        var getIndustriesUrl = "GetIndustries"
        var getSignatureUrl = "signature/GetSignatures";
        var makeSignatureDefault="signature/MakeItDefault";
        var deleteSignatue="signature/DeleteSignature";
        var updateSignatur="signature/UpdateSignature";
        var defaultSignature="signature/GetDefaultSignature";
        var service = {
            createSignature: createSignature,
            getIndustries: getIndustries,
            getSignatures: getSignatures,
            makeItDefaultSignatures: makeItDefaultSignatures,
            deleteSignature:deleteSignature,
            updateSignature: updateSignature,
            getMyDefaultSignature: getMyDefaultSignature,
            setMyDefaultSignatureToLocalStorage: setMyDefaultSignatureToLocalStorage,
            getMyDefaultSignatureFromLocalStorage: getMyDefaultSignatureFromLocalStorage,
            isDefaultSignatureLoaded:  isDefaultSignatureLoaded
            //getResigns:getResigns
        };

        return service;

        ////////////////
        function createSignature(getDetails) {

            
            var authToken = authService.getAuthToken();
            var headers = { 'Authorization': "Bearer " + authToken };

            var deferred = $q.defer();
            $http.post(appSettings.BaseUri + appSettings.ServiceApiUri + serviceUrl, getDetails, { headers: headers }).success(function (data) {
                deferred.resolve({
                    token: data.result,
                    success: data.success,
                    error: data.error
                });
            }).error(function (msg, code) {
                deferred.reject(msg);
            });
            return deferred.promise;

        }

        function updateSignature(getDetails) {

            
            var authToken = authService.getAuthToken();
            var headers = { 'Authorization': "Bearer " + authToken };

            var deferred = $q.defer();
            $http.post(appSettings.BaseUri + appSettings.ServiceApiUri + updateSignatur, getDetails, { headers: headers }).success(function (data) {
                deferred.resolve({
                    token: data.result,
                    success: data.success,
                    error: data.error
                });
            }).error(function (msg, code) {
                deferred.reject(msg);
            });
            return deferred.promise;

        }

        function getSignatures(getAll) {

            
            var authToken = authService.getAuthToken();
            var headers = { 'Authorization': "Bearer " + authToken };

            var deferred = $q.defer();
            $http.post(appSettings.BaseUri + appSettings.ServiceApiUri + getSignatureUrl, getAll, { headers: headers }).success(function (data) {
                deferred.resolve({
                    items: data.result,
                    success: data.success,
                    error: data.error
                });
            }).error(function (msg, code) {
                deferred.reject(msg);
            });
            return deferred.promise;

        }

        function makeItDefaultSignatures(makeDefault) {

            var signatureId=makeDefault.id;
          
            var authToken = authService.getAuthToken();
            var headers = { 'Authorization': "Bearer " + authToken };
            

            var deferred = $q.defer();
          
           // $http.post(appSettings.BaseUri + appSettings.ServiceApiUri + makeSignatureDefault+ "?signatureId="+ parseInt(makeDefault.id) ,{}, { headers: headers }).success(function (data) {
               $http.post(appSettings.BaseUri + appSettings.ServiceApiUri + makeSignatureDefault,makeDefault, { headers: headers }).success(function (data) {
                deferred.resolve({
                    items: data.result,
                    success: data.success,
                    error: data.error
                });
            }).error(function (msg, code) {
                deferred.reject(msg);
            });
            return deferred.promise;

        }

        function deleteSignature(signature) {

            
          
            var authToken = authService.getAuthToken();
            var headers = { 'Authorization': "Bearer " + authToken };
           

            var deferred = $q.defer();
            $http.post(appSettings.BaseUri + appSettings.ServiceApiUri + deleteSignatue,signature, { headers: headers }).success(function (data) {
                deferred.resolve({
                    
                    items: data.result,
                    success: data.success,
                    error: data.error
                });
            }).error(function (msg, code) {
                deferred.reject(msg);
            });
            return deferred.promise;

        }




        function getIndustries() {
            

            var deferred = $q.defer();
            $http.get(appSettings.AdminBaseUri + getIndustriesUrl).success(function (data) {
                deferred.resolve({
                    industries: data.industries,
                    success: data.success,
                    error: data.error
                });
            }).error(function (msg, code) {
                deferred.reject(msg);
            });
            return deferred.promise;

        }

        function getMyDefaultSignature(){
            
            var authToken = authService.getAuthToken();

            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: appSettings.BaseUri + appSettings.ServiceApiUri + defaultSignature,
                headers: {
                    'Authorization': 'Bearer ' + authToken
                }
                })          
                .success(function (data) {  
                setMyDefaultSignatureToLocalStorage(data.result);            
                deferred.resolve(data);
            }).error(function (msg, code) {
                deferred.reject(msg);
            });

            return deferred.promise;
         }

         function setMyDefaultSignatureToLocalStorage(signature){
            //console.log(signature);
            localStorageService.set("myDefaultSignature", signature);
         }

         function getMyDefaultSignatureFromLocalStorage(){
            return localStorageService.get("myDefaultSignature");
         }

         function isDefaultSignatureLoaded() {
            return !(getMyDefaultSignatureFromLocalStorage() === null || getMyDefaultSignatureFromLocalStorage() === undefined);
        }

         


    }
})();