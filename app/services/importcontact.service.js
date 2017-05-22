(function () {
    'use strict';

    angular
        .module('jibbar')
        .factory('importcontactService', importcontactService);

    importcontactService.$inject = ['$http', '$q', 'appSettings', 'authService', 'contactService'];

    function importcontactService($http, $q, appSettings, authService, contactService) {
        //var serviceUrl = "services/app/contact/";

        //var authToken = authService.getAuthToken();
        var service = {
            importContactListByProvider: importContactListByProvider
        };


        return service;

        function importContactListByProvider(provider) {
            vm.service = provider;
            vm.contactImportInfo = '';
            vm.socialInviterLicense = '';
            vm.consumerKey = '';
            vm.consumerSecret = '';
            vm.loading = true;
            abp.ui.setBusy(
                null,
                contactService.getContactImportInfo().success(function (importInfo) {
                    vm.contactImportInfo = importInfo;
                    vm.socialInviterLicense = vm.contactImportInfo.socialInviterLicense;
                    if (provider == 'gmail') {
                        //vm.service = 'gmail';
                        vm.consumerKey = vm.contactImportInfo.consumerKeyGmail;
                        vm.consumerSecret = vm.contactImportInfo.consumerSecretGmail;

                    } else if (provider == 'outlook') {
                        //vm.service = 'outlook';
                        vm.consumerKey = vm.contactImportInfo.consumerKeyOutlook;
                        vm.consumerSecret = vm.contactImportInfo.consumerSecretOutlook;
                    } else if (provider == 'yahoo') {
                        //vm.service = 'yahoo';
                        vm.consumerKey = vm.contactImportInfo.consumerKeyYahoo;
                        vm.consumerSecret = vm.contactImportInfo.consumerSecretYahoo;
                    }

                    /** Importing contacts by social inviter - start **/
                    // vm.getContactList()
                    //    .then(function (contracts) {
                    //        vm.importContactGridOptions.data = [];
                    //        vm.importContactGridOptions.data = contracts;
                    //        vm.loading = false;
                    //    },
                    //     function (contracts) {
                    //         console.log('Contacts Retrieval Failed.')
                    //     });
                    /** Importing contacts by social inviter - end **/
                })
            );
        };

        ////////////////








    }
})();