(function () {
    'use strict';

    angular
        .module('jibbar')
        .factory('emailService', emailService);

    emailService.$inject = ['$http', '$q', 'appSettings', 'localStorageService', 'authService', 'jibbarBuilder', 'toastr', 'creditconsumptionService'];

    function emailService($http, $q, appSettings, localStorageService, authService, jibbarBuilder, toastr, creditconsumptionService) {
        var vm = this;
        
        var selectedRecipients = [];
        vm.eventData = {};
        var service = {
            setCurrentEmailTemplate: setCurrentEmailTemplate,
            getCurrentEmailTemplate: getCurrentEmailTemplate,
            sendMail: sendMail,
            reschedule: reschedule,
            setCurrentEmailInfo: setCurrentEmailInfo,
            getCurrentEmailInfo: getCurrentEmailInfo,
            createOrUpdateEmailDraft: createOrUpdateEmailDraft,
            getCurrentEmailSubject: getCurrentEmailSubject,
            setCurrentEmailSubject: setCurrentEmailSubject,
            getCurrentEmailBody: getCurrentEmailBody,
            setCurrentEmailBody: setCurrentEmailBody,
            setCurrentEmailPublicId: setCurrentEmailPublicId,
            getCurrentEmailPublicId: getCurrentEmailPublicId,
            //updateEmailDraft: updateEmailDraft,
            getAllEmails: getAllEmails,
            getAllSentEmails: getAllSentEmails,
            // getAllEmailsScheduled: getAllEmailsScheduled,
           
            deleteEmailDraft: deleteEmailDraft,
            getEmailByPublicId: getEmailByPublicId,
            getCurrentEmailFromAddress: getCurrentEmailFromAddress,
            getCurrentEmailFromName: getCurrentEmailFromName,
            getCurrentEmailSenderPublicId: getCurrentEmailSenderPublicId,
            setCurrentEmailFromAddress: setCurrentEmailFromAddress,
            getCurrentEmailReplyAddress: getCurrentEmailReplyAddress,
            setCurrentEmailReplyAddress: setCurrentEmailReplyAddress,
            setSelectedRecipients: setSelectedRecipients,
            getSelectedRecipients: getSelectedRecipients,
            saveEmail: saveEmail,
            isAllowedToSend: isAllowedToSend,
            postSendAction: postSendAction,
            updateDraftEmailToSend: updateDraftEmailToSend,
            createNewBroadcast: createNewBroadcast,
            getAllEmailsBroadcast: getAllEmailsBroadcast,
            reuseEmail: reuseEmail,
            resetEmail: resetEmail,
            getNumberOfReceipents:getNumberOfReceipents,
            setLastStateOfEmailBody: setLastStateOfEmailBody,
            isSetLastStateOfEmailBody: isSetLastStateOfEmailBody,
            getLastStateOfEmailBody: getLastStateOfEmailBody,

            getCurrentBroadcastCostInfo:getCurrentBroadcastCostInfo,
            setCurrentBroadcastCostInfo:setCurrentBroadcastCostInfo,
            discardEmail: discardEmail,
            IsEditingInProgress: IsEditingInProgress
        };

        return service;

        ////////////////
        function IsEditingInProgress(val){
            if(typeof(val)!='undefined') localStorageService.set("IsEditingInProgress", val);
            else return localStorageService.get("IsEditingInProgress");
        }
        function setCurrentEmailTemplate(templateId) {
            //localStorageService.set("currentTemplate", templateId);
            localStorageService.set("email.templateId", templateId);
        }

        function getCurrentEmailTemplate() {
            //return localStorageService.get("currentTemplate");
            return localStorageService.get("email.templateId");
        }

        function sendMail(mailInfo) {
            var mailbody = unescape(mailInfo.body);
            mailbody = mailbody.replace(/<!-- RECOVER START/g, ' ');
            mailbody = mailbody.replace(/RECOVER END -->/g, ' ');
            mailbody = mailbody.split("</html>")[0]+"</html>";
            mailInfo.body = escape(mailbody); 
            var authToken = authService.getAuthToken();
            var deferred = $q.defer(); 
            $http({
                method: 'POST',
                url: appSettings.JibbarEmailsUri + "Send",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
                data: mailInfo
            }).success(function (data) {
                IsEditingInProgress(false);
                postSendAction();
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

        function reschedule(email, when){
            var authToken = authService.getAuthToken();
            var deferred = $q.defer();
            //$http.post(appSettings.JibberMailer + mailerUri, mailInfo).success(function (data) {
            //$http.post(appSettings.JibbarEmailsUri + mailerUri, mailInfo)
            $http({
                method: 'POST',
                url: appSettings.JibbarEmailsUri + "Reschedule",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
                data: {publicId: email, when: when}
            }).success(function (data) {
                
                //postSendAction(mailInfo);
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

        function reuseEmail(emailId){

            var authToken = authService.getAuthToken();
            var deferred = $q.defer();
            //$http.post(appSettings.JibberMailer + mailerUri, mailInfo).success(function (data) {
            //$http.post(appSettings.JibbarEmailsUri + mailerUri, mailInfo)
            $http({
                method: 'POST',
                url: appSettings.JibbarEmailsUri + "CloneEmail",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
                data: {publicId: emailId}
            }).success(function (data) {
                
                //postSendAction(mailInfo);
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
        
        function discardEmail(){
            localStorageService.remove("email.subject");
            localStorageService.remove("email.body");
            localStorageService.remove("addedContacts");
            localStorageService.remove("loadedGroups");
            localStorageService.remove("loadedContacts");
            localStorageService.remove("email.publicId");
            localStorageService.remove("email.templateId");
            IsEditingInProgress(false);
        }
        function setCurrentEmailInfo(emailInfo) {
            //localStorageService.set("currentEmailInfo", JSON.stringify(emailInfo));
            setCurrentEmailSubject(emailInfo.subject);
            setCurrentEmailBody(emailInfo.body);
            setCurrentEmailPublicId(emailInfo.publicId);
            setCurrentEmailTemplate(emailInfo.templateId);
            setCurrentEmailFromAddress();
            setCurrentEmailReplyAddress();

        }


        function getCurrentBroadcastCostInfo(){
               return {
                   "creditPerRecipient":localStorageService.get("boradcast.creditPerRecipient"),
                   "totalRecipients"   :localStorageService.get("boradcast.totalRecipients"),
                   "broadcastFee"      :localStorageService.get("boradcast.broadcastFee"),
                   "isScheduled"       :localStorageService.get("boradcast.isScheduled")
               }
           }


      function setCurrentBroadcastCostInfo(costInfo)
               {
                localStorageService.set("boradcast.creditPerRecipient", costInfo.creditPerRecipient),
                localStorageService.set("boradcast.totalRecipients", costInfo.totalRecipients),
                localStorageService.set("boradcast.broadcastFee", costInfo.broadcastFee)
                localStorageService.set("boradcast.isScheduled", costInfo.isScheduled)
                
               }
           
        function getCurrentEmailInfo() {
            return {
                "subject": getCurrentEmailSubject(),
                "body": getCurrentEmailBody(),
                "from": getCurrentEmailFromAddress(),
                "reply_address": getCurrentEmailReplyAddress(),
                "publicId": getCurrentEmailPublicId(),
                "templateId": getCurrentEmailTemplate(),
                "fromName": getCurrentEmailFromName()
            };
            //return JSON.parse(localStorageService.get("currentEmailInfo"));
        }

        function getCurrentEmailFromAddress() {
            return localStorageService.get("email.from");
        }

        function getCurrentEmailFromName() {
            return localStorageService.get("email.fromName");
        }

        function getCurrentEmailSenderPublicId() {
            return localStorageService.get("email.sender_public_id");
        }

        function setCurrentEmailFromAddress() {
            var currentUser = authService.getCurrentUser(); 
            localStorageService.set("email.from", currentUser.email);
            localStorageService.set("email.fromName", currentUser.firstName + " " + currentUser.lastName);
            localStorageService.set("email.sender_public_id", currentUser.publicId);
        }

        function getCurrentEmailReplyAddress() {
            return localStorageService.get("email.reply");
        }

        function setCurrentEmailReplyAddress(reply) {
            if (typeof (reply) == 'undefined') {
                var reply = authService.getCurrentUser().email;
            }
            localStorageService.set("email.reply", reply);
        }

        function getCurrentEmailSubject() {
            return localStorageService.get("email.subject");
        }

        function setCurrentEmailSubject(subject) {
            localStorageService.set("email.subject", subject); 
        }

        function getCurrentEmailBody() {
            return localStorageService.get("email.body");
        }

        function setCurrentEmailBody(body) {
            setLastStateOfEmailBody(getCurrentEmailBody());
            localStorageService.set("email.body", body); 
        }

        function setCurrentEmailPublicId(pubEmailId) {
            localStorageService.set("email.publicId", pubEmailId);
        }

        function getCurrentEmailPublicId() {
            return localStorageService.get("email.publicId");
        }

        function createOrUpdateEmailDraft() {
            var input = {
                templateId: getCurrentEmailTemplate(),
                subject: getCurrentEmailSubject(),
                body: escape(getCurrentEmailBody()),
                publicId: getCurrentEmailPublicId()
            };
            var authToken = authService.getAuthToken();
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: appSettings.JibbarEmailsUri + "SaveEmail",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
                data: input
            }).success(function (data) { 
                setCurrentEmailPublicId(data.result.publicId);
                deferred.resolve({
                    success: data.success,
                    error: data.error
                });
            }).error(function (msg, code) {
                deferred.reject(msg);
            });
            return deferred.promise;

        }
        function getAllEmails(state) {
            var authToken = authService.getAuthToken();
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: appSettings.JibbarEmailsUri + "GetAllEmails",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
                data: { state: state}
            }).success(function (data) {
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

        function getEmailByPublicId(publicId) {
            var authToken = authService.getAuthToken();
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: appSettings.JibbarEmailsUri + "GetEmail",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
                data: {
                    publicId: publicId
                }
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (msg, code) {
                deferred.reject(msg);
            });

            return deferred.promise;
        }


        function getAllSentEmails(params) {
            var authToken = authService.getAuthToken();
            //var curUser = authService.getCurrentUser();
            var deferred = $q.defer();

            var url = '';
            if (params && params.templateId)
                url = appSettings.JibbarEmailsUri + "GetAllEmailsByTemplate";
            else
                url = appSettings.JibbarEmailsUri + "GetAllEmails";

            $http({
                method: 'POST',
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
                data: params
            }).success(function (data) {
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

        

        function deleteEmailDraft(emailId) {
            var input = {
                publicId: emailId
            };

            var authToken = authService.getAuthToken();
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: appSettings.JibbarEmailsUri + "DeleteEmail",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
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

        
        function saveEmail() {

            var deferred = $q.defer();

            if (getCurrentEmailSubject() != null) {
                // if (getCurrentEmailPublicId() == null) {
                    createOrUpdateEmailDraft().then(
                        function (result) {
                            if (result.success) {
                                deferred.resolve({
                                    data: result,
                                    success: result.success,
                                    error: result.error
                                });
                                IsEditingInProgress(false);
                                toastr.success("Draft successfully saved!");
                            }
                        },
                        function (error) {
                            deferred.reject(error.error.message);
                            toastr.error(error.error.message);
                        }
                    )
                }
            else{
                toastr.warning("Email subject can't be blank");
                //return false;
            }
            return deferred.promise;
        }
        function setSelectedRecipients(contacts) {
            selectedRecipients = [];
            selectedRecipients.push(contacts);
        }

        function getSelectedRecipients() {
            return selectedRecipients;
        }
        
        
        function getNumberOfReceipents(){
            return (getSelectedRecipients().length == 0) ? 0 : getSelectedRecipients()[0].length;
        }

        function isAllowedToSend() {
            var deferred = $q.defer();
            var creditPerRecipient = 0;
            var handlingFee = 0;
            var totalCreditsNeeded = 0;
            var flag = false;
            var creditBalance = authService.getCurrentUserCreditBalance();
            var broadcastBalance = authService.getCurrentUserBroadcastBalance();
            var subscriptionExpireOn = authService.getCurrentUserSubscriptionExpiry();

            creditconsumptionService.getCreditConsumption().then(
                function (result) {
                    if (result.success) {
                        for (var i = 0; i < result.data.length; i++) {
                            if (result.data[i].code == 'CC001') {
                                creditPerRecipient = result.data[i].credit_consumed;
                            } else if (result.data[i].code == 'CC002') {
                                handlingFee = result.data[i].credit_consumed;
                            }
                        } 

                        var totalRecipients = (getSelectedRecipients().length == 0) ? 0 : getSelectedRecipients()[0].length;
                        totalCreditsNeeded = (creditPerRecipient * totalRecipients);// + handlingFee;
                        var balance = creditBalance - totalCreditsNeeded;
                        var showPurchaseCreditOption = (balance < 0) ? true : false;
                        var currentDateTime = new Date().toISOString();
                        var isAllowSendEmail = (broadcastBalance <= 0 || balance < 0 || currentDateTime > subscriptionExpireOn) ? false : true;
                        var eventData = {
                            "creditPerRecipient": creditPerRecipient,
                            "handlingFee": handlingFee,
                            "totalCreditsNeeded": totalCreditsNeeded,
                            "creditBalance": creditBalance,
                            "broadcastBalance": broadcastBalance,
                            "subscriptionExpireOn": subscriptionExpireOn,
                            "totalRecipients": totalRecipients,
                            "balance": balance,
                            "showPurchaseCreditOption": showPurchaseCreditOption,
                            "isAllowSendEmail": isAllowSendEmail
                        };
                        deferred.resolve({
                            data: eventData,
                            success: true,
                            error: null
                        });

                    }
                },
                function (error) {
                    deferred.reject("something went wrong while retrieving credit consumptions!!!");
                    // toastr.error("something went wrong!!!");
                }
            );
            return deferred.promise;
        }

        function postSendAction(mailInfo) {
            // updateDraftEmailToSend(mailInfo);
            // createNewBroadcast(mailInfo);
            resetEmail();
        }
        function resetEmail(){
            
        }

        function updateDraftEmailToSend(mailInfo) {
            var emailPublicId = mailInfo.publicId;
            var input = {
                publicId: emailPublicId
            };

            var authToken = authService.getAuthToken();
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: appSettings.BaseUri + appSettings.ServiceApiUri + "email/UpdateEmailDraft",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
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

        function createNewBroadcast(mailInfo) {

            isAllowedToSend().then(
                function (result) {
                    if (result.success) {
                        vm.eventData = result.data;

                        var input = {
                            //id:'',
                            user_id: mailInfo.creatorPublicId,
                            email_id: mailInfo.publicId,
                            email_subject: mailInfo.subject,
                            number_of_recipient: vm.eventData.totalRecipients,
                            total_credit_consumed: vm.eventData.totalCreditsNeeded,
                            meta_data: null
                        };

                        var authToken = authService.getAuthToken();
                        var deferred = $q.defer();
                        $http({
                            method: 'POST',
                            url: appSettings.AdminBaseUri + "CreateBroadcast",
                            headers: {
                                'Authorization': 'Bearer ' + authToken
                            },
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
                },
                function (error) {
                    toastr.error("something went wrong!!");
                }
            );
        }
        function getAllEmailsBroadcast() {
            var authToken = authService.getAuthToken();
            var curUser = authService.getCurrentUser();
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: appSettings.JibbarEmailsUri + "GetBroadcasts",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
            }).success(function (data) {
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

        function setLastStateOfEmailBody(body){
            localStorageService.set("lastStateOfEmailBody", body);
        }
        function isSetLastStateOfEmailBody() {
            return !(getLastStateOfEmailBody() === null || getLastStateOfEmailBody() === undefined);
        };
        function getLastStateOfEmailBody(){
            return localStorageService.get("lastStateOfEmailBody");
        }

    }
})();