(function() {
'use strict';

    angular
        .module('jibbar')
        .factory('templateService', templateService);

    templateService.$inject = ['$http', '$q', 'appSettings', 'authService', 'localStorageService'];
    
    function templateService($http, $q, appSettings, authService, localStorageService) {
        var token = '';  
        var authToken = authService.getAuthToken(token);  
        var config = { headers: { 'Authorization': 'Token token=' + authToken } };
        var service = { 
            addNewTemplate:addNewTemplate,
            getEmailTemplates:getEmailTemplates,
            getEmailTemplateTypes:getEmailTemplateTypes,
            makeItDefault:makeItDefault,
            updateTemplate:updateTemplate,
            getEmailTemplateCategory:getEmailTemplateCategory,
            getEmailTemplate: getEmailTemplate,
            getTemplates: getTemplates,
            clearTemplates: clearTemplates,
            getTemplateById: getTemplateById,
            getTemplatesByIdList: getTemplatesByIdList,
            getTemplateTypes: getTemplateTypes,
            clearTemplateTypes: clearTemplateTypes,
			getEmailTemplateStatistics: getEmailTemplateStatistics,
            saveAsFavourite: saveAsFavourite,
            loadMyFavouriteTemplates: loadMyFavouriteTemplates,
            setMyFavouriteTemplates: setMyFavouriteTemplates,
            getMyFavouriteTemplates: getMyFavouriteTemplates,
            clearMyFavouriteTemplates: clearMyFavouriteTemplates,
            isLoadedFavourites: isLoadedFavourites,
            addToMyFavourite: addToMyFavourite,
            removeFromFavourite: removeFromFavourite,
            removeFromMyFavourite: removeFromMyFavourite
        };
        
        return service;

        
        
        function addNewTemplate(emailTemplate){
            var deferred = $q.defer();

            ///////////////////////
            $http.post(appSettings.BaseUri+'CreateEmailTemplate',emailTemplate, config)
            .success(function (data)
                                { deferred.resolve(data); })
            .error(function (msg, code) 
                               { deferred.reject(msg); });
            return deferred.promise;
            ////////////////////// 
        }

         function updateTemplate(emailTemplate){
            var data = {
                        public_id:emailTemplate.id,
                        name:emailTemplate.name, 
                        template_html:emailTemplate.template_html,
                        original_html:emailTemplate.original_html,
                        emailTemplateTypeTemplates:emailTemplate.emailTemplateTypeTemplates
                    }

            var deferred = $q.defer();
            ///////////////////////
            $http.post(appSettings.BaseUri  + "UpdateEmailTemplate", data, config)
            .success(function (data) {
                    deferred.resolve({
                        success: data.success,
                        error: data.errors
                    });})
            .error(function (msg, code) {
                deferred.reject(msg);
                });


            return deferred.promise;
            ////////////////////// 
        }

         function makeItDefault(emailTemplateID, emailTemplateTypeID){
             
            var deferred = $q.defer();

            var data = {"emailTemplateId": emailTemplateID, "emailTemplateTypeId":emailTemplateTypeID, isDefault:true};

            
            ///////////////////////
            $http.post(appSettings.BaseUri  + "MakeDefaultTemplate", data, config)
            .success(function (data) {
                    deferred.resolve({
                        success: data.success,
                        error: data.errors
                    });})
            .error(function (message) {
                deferred.reject(message);
                });


            return deferred.promise;
            ////////////////////// 
        }
        
        function getEmailTemplate(emailTemplateID){
            var deferred = $q.defer();

            var data = {"emailTemplateId": emailTemplateID};

            
            ///////////////////////
            $http.post(appSettings.AdminBaseUri + "GetEmailTemplate", data, config)
            .success(function (response) {
                
                deferred.resolve(response);
            })
            .error(function (msg, code) {
                deferred.reject(msg);
                });


            return deferred.promise;
        }

        function getEmailTemplates(loaded) {
            var authToken = authService.getAuthToken();
            if (typeof (loaded) === undefined) loaded = false;
            var deferred = $q.defer();

            if (loaded && isLoaded()) {
                deferred.resolve({
                    items: getTemplates(),
                    success: true,
                    error: null
                });
            } else {
                $http.get(appSettings.AdminBaseUri + "GetEmailTemplates")
                    .success(function (data) {

                    setTemplates(data.email_templates);
                    deferred.resolve({
                        items: data.email_templates,
                        success: data.success,
                        error: data.error
                    });
                }).error(function (msg, code) {
                    deferred.reject(msg);
                });

            }

            return deferred.promise;
        }


        function getEmailTemplateTypes(loadedType) {
            if (typeof (loadedType) === undefined) loadedType = false;
            var deferred = $q.defer();
            
            if (loadedType && isLoadedType()) {
                deferred.resolve({
                    items: getTemplateTypes(),
                    success: true,
                    error: null
                });
            } else {
                $http.get(appSettings.AdminBaseUri + "GetEmailTemplateTypes")
                    .success(function (data) {
                    setTemplateTypes(data.email_template_types);
                    deferred.resolve({
                        items: data.email_template_types,
                        success: data.success,
                        error: data.error
                    });
                }).error(function (msg, code) {
                    deferred.reject(msg);
                });

            }

            return deferred.promise;
        }
       

         
        function getEmailTemplateCategory(){
            
            var deferred = $q.defer();
            ///////////////////////
            $http({
                method: 'GET',
                url: appSettings.BaseUri  + "GetEmailTemplateCategory",
                headers: {
                    'Authorization': 'Token token=' + authToken
                }
                }).success(function (response) {
                    
                    deferred.resolve({
                        results : response.template_categories,
                        success: response.success,
                        error: response.errors
                    });
                }).error(function (msg, code) {
                deferred.reject(msg);
                });
            return deferred.promise;
            ////////////////////// 
        }

        function saveAsFavourite(template){
            
            var authToken = authService.getAuthToken();
            var deferred = $q.defer();
            //$http.post(appSettings.JibberMailer + mailerUri, mailInfo).success(function (data) {
            //$http.post(appSettings.JibbarEmailsUri + mailerUri, mailInfo)
            $http({
                method: 'POST',
                url: appSettings.AdminBaseUri + "IncFavouriteCounterEmailTemplate",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
                data: template
            }).success(function (data) {
                addToMyFavourite(data);
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

        function removeFromFavourite(template){
            
            var authToken = authService.getAuthToken();
            var deferred = $q.defer();
            //$http.post(appSettings.JibberMailer + mailerUri, mailInfo).success(function (data) {
            //$http.post(appSettings.JibbarEmailsUri + mailerUri, mailInfo)
            $http({
                method: 'POST',
                url: appSettings.AdminBaseUri + "DecFavouriteCounterEmailTemplate",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
                data: template
            }).success(function (data) {
                removeFromMyFavourite(data);
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

        function loadMyFavouriteTemplates(){
            var authToken = authService.getAuthToken();
            var deferred = $q.defer();
            //$http.post(appSettings.JibberMailer + mailerUri, mailInfo).success(function (data) {
            //$http.post(appSettings.JibbarEmailsUri + mailerUri, mailInfo)
            $http({
                method: 'POST',
                url: appSettings.AdminBaseUri + "MyFavouriteTemplates",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
                data: null
            }).success(function (data) {
                setMyFavouriteTemplates(data.result);
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

        // Local storage methods
        function setPreviewImagesAndType(templates, templateType) {
            templates.forEach(function (template) {
                template.preview = appSettings.aws.previewImgUrl + template.id;
				template.categoryName = templateType.name;
            });
        }

        function setTemplates(templates) {
            localStorageService.set("templates", templates);
        }

        function getTemplates() {
            var arrayOfTemplates = getTemplateTypes().map(function (cat) { return cat.email_templates });
            return [].concat.apply([], arrayOfTemplates);
        }

        function clearTemplates() {
            return localStorageService.remove("templates");
        }

        function isLoaded() {
            return !(getTemplates() === null || getTemplates() === undefined);
        }

        function getTemplateById(id) {

            return $.grep(getTemplates(), function (e) {
                return e.id == id;
            })[0];
        }

        function getTemplatesByIdList(idArr) {
            return $.grep(localStorageService.get("templates"), function (e) { return $.inArray(e.id, idArr) != -1; });
        }

        function setTemplateTypes(templateTypes) {
            templateTypes.forEach(function (templateType) {
                templateType.slug = templateType.name.split(" ")[0].toLowerCase();
                setPreviewImagesAndType(templateType.email_templates, templateType);
            });

            localStorageService.set("templateTypes", templateTypes);
        }

        function getTemplateTypes() {
            return localStorageService.get("templateTypes");
        }

        function clearTemplateTypes() {
            return localStorageService.remove("templateTypes");
        }

        function isLoadedType() {
            return !(getTemplateTypes() === null || getTemplateTypes() === undefined);
        }

        function setMyFavouriteTemplates(favourites) {
            //console.log(favourites);
            localStorageService.set("myFavouriteTemplates", favourites);
        }

        function addToMyFavourite(template){
             var my_favorites = getMyFavouriteTemplates();
             my_favorites.push(template.result);
             setMyFavouriteTemplates(my_favorites);
        }
        function removeFromMyFavourite(template){
            var my_favorites = [];
            my_favorites = $.grep(getMyFavouriteTemplates(), function (e){ return e.template_id != template.result.template_id});
            setMyFavouriteTemplates(my_favorites);
         }
        function getMyFavouriteTemplates() {
            return localStorageService.get("myFavouriteTemplates");
        }
		function clearMyFavouriteTemplates() {
            return localStorageService.remove("myFavouriteTemplates");
        }
        function isLoadedFavourites() {
            return !(getMyFavouriteTemplates() === null || getMyFavouriteTemplates() === undefined);
        }
		function getEmailTemplateStatistics() {
            var authToken = authService.getAuthToken();

            var deferred = $q.defer();

			$http({
                method: 'POST',
                url: appSettings.JibbarEmailsUri   + "GetAllUsedTemplatesByUser",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                }
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