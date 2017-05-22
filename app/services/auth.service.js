(function () {
    'use strict';

    angular
        .module('jibbar')
        .factory('authService', authService);

    authService.$inject = ['$http', '$q', 'appSettings', 'localStorageService', '$state'];

    function authService($http, $q, appSettings, localStorageService, $state) {
        var accountUri = "api/Account";
        var userRegisterUri = "userRegister/RegisterUser";
        var resetPasswordLink = "userNonAuth/SendPasswordResetLink";
        var resetPasswordUri = "userNonAuth/ResetPassword";
        var emailActivationUri = "userNonAuth/sendEmailActivationLink";
        var chgPasswordUrl = "profile/ChangePassword";
        var getUserNameUrl = "profile/GetCurrentUserProfileForEdit";
        var chgPictureUrl = "profile/UpdateProfilePicture";
        var confirmEmailUrl = "userNonAuth/emailConfirmation";
        var userImage = "profile/GetCurrentUserProfilePictureInfo";

        var service = {
            authenticate: authenticate,
            setAuthToken: setAuthToken,
            getAuthToken: getAuthToken,
            clearAuthToken: clearAuthToken,
            setUserProfilePicture: setUserProfilePicture,
            getUserProfilePicture: getUserProfilePicture,
            clearUserProfilePicture: clearUserProfilePicture,
            isAuthenticated: isAuthenticated,
            createUser: createUser,
            getUserLocationInfo: getUserLocationInfo,
            sendResetPasswordLink: sendResetPasswordLink,
            activateEmail: activateEmail,
            changePass: changePass,
            getUserInfo: getUserInfo,
            changePicture: changePicture,
            confirmEmail: confirmEmail,
            getUserImage: getUserImage,
            setCurrentUser: setCurrentUser,
            getCurrentUser: getCurrentUser,
            getCurrentUserSubscriptionRole: getCurrentUserSubscriptionRole,
            setCurrentUserCreditBalance: setCurrentUserCreditBalance,
            getCurrentUserCreditBalance: getCurrentUserCreditBalance,
            setCurrentUserBroadcastBalance: setCurrentUserBroadcastBalance,
            getCurrentUserBroadcastBalance: getCurrentUserBroadcastBalance,
            setCurrentUserSubscriptionExpiry: setCurrentUserSubscriptionExpiry,
            getCurrentUserSubscriptionExpiry: getCurrentUserSubscriptionExpiry,
            getCurrentUserPublicId: getCurrentUserPublicId,
            resetPassword: resetPassword

        };

        return service;

        ////////////////

        function getUserImage() {
            var authToken = getAuthToken();
            var headers = {
                'Authorization': "Bearer " + authToken
            };
            var deferred = $q.defer();
            $http.post(appSettings.BaseUri + appSettings.ServiceApiUri + userImage, {}, {
                headers: headers
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (data, code) {
                deferred.reject(data.error);
            });
            return deferred.promise;
        }

        function changePicture(picture) {

            var authToken = getAuthToken();
            var headers = {
                'Authorization': "Bearer " + authToken
            };
            var deferred = $q.defer();
            $http.post(appSettings.BaseUri + appSettings.ServiceApiUri + chgPictureUrl, picture, {
                headers: headers
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (data, code) {
                deferred.reject(data.error);
            });
            return deferred.promise;
        }

        function getUserInfo() {

            var authToken = getAuthToken();
            var headers = {
                'Authorization': "Bearer " + authToken
            };
            var deferred = $q.defer();
            $http.post(appSettings.BaseUri + appSettings.ServiceApiUri + getUserNameUrl, {}, {
                headers: headers
            }).success(function (data) {

                var userInfo = {
                    firstName: data.result.name,
                    lastName: data.result.surname,
                    email: data.result.emailAddress,
                    publicId: data.result.publicId,
                    country: data.result.country,
                    state: data.result.state,
                    timezone: data.result.timezone
                };

                setCurrentUser(userInfo);


                deferred.resolve({
                    data: data.result,
                    success: data.success,
                    error: data.error
                });
            }).error(function (data, code) {
                clearAuthToken();
                $state.go('home.sign-in');
                deferred.reject(data.error);
            });
            return deferred.promise;
        }

        function changePass(password) {

            var authToken = getAuthToken();
            var headers = {
                'Authorization': "Bearer " + authToken
            };
            var deferred = $q.defer();
            $http.post(appSettings.BaseUri + appSettings.ServiceApiUri + chgPasswordUrl, password, {
                headers: headers
            }).success(function (data) {
                deferred.resolve({
                    token: data.result,
                    success: data.success,
                    error: data.error
                });
            }).error(function (data, code) {
                deferred.reject(data.error);
            });
            return deferred.promise;
        }

        function authenticate(user) {

            var deferred = $q.defer();
            $http.post(appSettings.AuthenticationApiUri + "GetToken", user).success(function (data) {
                deferred.resolve(data);

                if (data && data.userinfo && data.userinfo.profile_picture_thumb && data.userinfo.profile_picture_thumb.length)
                    setUserProfilePicture(data.userinfo.profile_picture_thumb);
            }).error(function (data, code) {
                deferred.reject(data.error);
            });
            return deferred.promise;
        }

        function setAuthToken(token) {
            localStorageService.set("authToken", token);
        }

        function getAuthToken() {
            return localStorageService.get("authToken");
        }

        function clearAuthToken() {
            return localStorageService.remove("authToken");
        }

        function setUserProfilePicture(url) {
            localStorageService.set("profilePicture", url);
        }

        function clearUserProfilePicture() {
            return localStorageService.remove("profilePicture");
        }

        function getUserProfilePicture() {
            return localStorageService.get("profilePicture");
        }

        function isAuthenticated() {
            return !(getAuthToken() === null || getAuthToken() === undefined);
        };

        function getUserLocationInfo() {
            var deferred = $q.defer();
            var defaultData = {
                "country_code": "AU",
                "country_name": "Australia",
                "region_name": "New South Wales",
                "time_zone_string": "Australia/Sydney" 
            };
            $http.get(appSettings.LocationServiceUri).success(function (data) {
                deferred.resolve({
                    data: data
                });
            }).error(function (data, code) {

                deferred.resolve({
                    data: defaultData
                });
            });
            return deferred.promise;
        }

        function createUser(user) {
            var deferred = $q.defer();
            $http.post(appSettings.BaseUri + appSettings.ServiceApiUri + userRegisterUri, user).success(function (data) {

                deferred.resolve({
                    data: data.result,
                    success: data.success,
                    error: data.error
                });
            }).error(function (data, code) {
                deferred.reject(data.error);
            });
            return deferred.promise;
        }

        function subscribeTestPlan(publicId) {
            var input = {
                "public_id": publicId
            };

            $http.post(appSettings.AdminBaseUri + "SubscribeTestPlan", input).success(function (data) {
                deferred.resolve({
                    success: data.success,
                    error: data.error
                });
            }).error(function (msg, code) {
                deferred.reject(msg);
            });
        }

        function sendResetPasswordLink(user) {

            var deferred = $q.defer();
            //$http.post(appSettings.BaseUri + appSettings.ServiceApiUri + resetPasswordLink, user).success(function (data) {
            $http.post(appSettings.BaseUri + appSettings.ServiceApiUri + resetPasswordLink, user).success(function (data) {
                deferred.resolve({
                    data: data.result,
                    success: data.success,
                    error: data.error
                });
            }).error(function (data, code) {
                deferred.reject(data.error);
            });
            return deferred.promise;
        }

        function resetPassword(input) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: appSettings.BaseUri + appSettings.ServiceApiUri + resetPasswordUri,
                data: input
            }).success(function (data) {
                deferred.resolve({
                    success: data.success,
                    error: data.error
                });
            }).error(function (msg, code) {
                deferred.reject(msg);
            });
            return deferred.promise;
        }

        function activateEmail(user) {
            var deferred = $q.defer();
            $http.post(appSettings.BaseUri + appSettings.ServiceApiUri + emailActivationUri, user).success(function (data) {
                deferred.resolve({
                    data: data.result,
                    success: data.success,
                    error: data.error
                });
            }).error(function (data, code) {
                deferred.reject(data.error);
            });
            return deferred.promise;
        }

        function confirmEmail(input) {
            var deferred = $q.defer();
            $http.post(appSettings.BaseUri + appSettings.ServiceApiUri + confirmEmailUrl, input).success(function (data) {
                deferred.resolve({
                    data: data.result,
                    success: data.success,
                    error: data.error
                });
            }).error(function (data, code) {
                deferred.reject(data.error);
            });
            return deferred.promise;
        }

        function setCurrentUser(user) {
            localStorageService.set("currentUserInfo", JSON.stringify(user));
        }

        function getCurrentUser() {
            return JSON.parse(localStorageService.get("currentUserInfo"));
        }

        function getCurrentUserPublicId() {
            return JSON.parse(localStorageService.get("currentUserInfo")).publicId;
        }

        function getCurrentUserSubscriptionRole() {

            var authToken = getAuthToken();
            var deferred = $q.defer();
            var input = {
                publicID: getCurrentUserPublicId()
            };
            $http({
                method: 'POST',
                url: appSettings.BaseUri + appSettings.ServiceApiUri + "userSubscriptionRole/GetUserSubscriptionRolesByPublicId",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
                data: input
            }).success(function (data) {
                //console.log("setting userSubscriptionRole");
                //console.log(data);
                setCurrentUserCreditBalance(data.result.creditBalance);
                setCurrentUserBroadcastBalance(data.result.broadcastBalance);
                setCurrentUserSubscriptionExpiry(data.result.subscriptionExpireOn);
                deferred.resolve({
                    data: data.result,
                    success: data.success,
                    error: data.error
                });
            }).error(function (msg, code) {
                deferred.reject(msg);
            });

            return deferred.promise;
        }

        function setCurrentUserCreditBalance(creditBalance) {
            localStorageService.set("currentUser.creditBalance", creditBalance);
        }

        function getCurrentUserCreditBalance() {
            return localStorageService.get("currentUser.creditBalance");
        }

        function setCurrentUserBroadcastBalance(broadcastBalance) {
            localStorageService.set("currentUser.broadcastBalance", broadcastBalance);
        }

        function getCurrentUserBroadcastBalance() {
            return localStorageService.get("currentUser.broadcastBalance");
        }

        function setCurrentUserSubscriptionExpiry(expiry) {
            localStorageService.set("currentUser.subscriptionExpiry", expiry);
        }

        function getCurrentUserSubscriptionExpiry() {
            return localStorageService.get("currentUser.subscriptionExpiry");
        }


    }
})();