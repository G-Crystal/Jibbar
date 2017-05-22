(function () {
    'use strict';

    angular
        .module('jibbar')
        .factory('groupService', groupService);

    groupService.$inject = ['$http', '$q', 'appSettings', 'authService', 'localStorageService'];

    function groupService($http, $q, appSettings, authService, localStorageService) {
        //var serviceUrl = "services/app/contact/";

        var service = {
            addNewGroup: addNewGroup,
            getAllGroups: getAllGroups,
            getGroupContactsByGroupId: getGroupContactsByGroupId,
            clearGroups: clearGroups,
            isLoaded: isLoaded,
            getGroupById: getGroupById,
            reloadGroup: reloadGroup,
            getGroups: getGroups,
            editGroup: editGroup,
            deleteGroup: deleteGroup,
            getGroupsByIdList: getGroupsByIdList,
            removeContactFromGroup: removeContactFromGroup,
            addSelectedContactsToGroup: addSelectedContactsToGroup,
            getAllGroupsWithRecipients: getAllGroupsWithRecipients
        };

        return service;

        ////////////////        

        function addNewGroup(group) {
            var authToken = authService.getAuthToken();
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: appSettings.BaseUri + appSettings.ServiceApiUri + "group/CreateGroup",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
                data: group
            }).success(function (data) {
                reloadGroup(data.result, 'add');
                //$rootScope.$emit("reloadSidebarGroups", "reloading sidebar groups …");
                deferred.resolve({
                    success: data.success,
                    error: data.error,
                    group: data.result
                });
            }).error(function (msg, code) {
                deferred.reject(msg);
            });
            return deferred.promise;
        }

        function getAllGroups(loaded) {
            var authToken = authService.getAuthToken();
            if (typeof (loaded) === undefined) loaded = false;
            var deferred = $q.defer();

            if (loaded && isLoaded()) {
                console.log('loaded group');
                deferred.resolve({
                    items: getGroups(),
                    success: true,
                    error: null
                });
            } else {
                console.log('group loading ...');
                //var filter = '';
                $http({
                    method: 'POST',
                    url: appSettings.BaseUri + appSettings.ServiceApiUri + "group/GetAllGroups",
                    headers: {
                        'Authorization': 'Bearer ' + authToken
                    },
                    data: {}
                }).success(function (data) {
                    setGroups(data.result.items);
                    deferred.resolve({
                        items: data.result.items,
                        success: data.success,
                        error: data.error
                    });
                }).error(function (msg, code) {
                    deferred.reject(msg);
                });

            }

            return deferred.promise;
        }

        function getGroupContactsByGroupId(group) {
            var authToken = authService.getAuthToken();
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: appSettings.BaseUri + appSettings.ServiceApiUri + "group/GetGroupContacts",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
                data: group
            }).success(function (data) {

                //setGroups(data.result.items);
                deferred.resolve({
                    success: data.success,
                    error: data.error,
                    contacts: data.result.items
                });
            }).error(function (msg, code) {
                deferred.reject(msg);
            });
            return deferred.promise;
        }

        function editGroup(group) {
            var authToken = authService.getAuthToken();
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: appSettings.BaseUri + appSettings.ServiceApiUri + "group/UpdateGroup",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
                data: group
            }).success(function (data) {
                reloadGroup(group, 'update');
                //$rootScope.$emit("reloadSidebarGroups", "reloading sidebar groups …");
                jibbar.event.trigger(jibbar.event.events.RESET_POPUP_GROUP_EVENT);
                //$rootScope.$emit("resetGroup", "reset group in popups …");
                deferred.resolve({
                    success: data.success,
                    error: data.error
                });
            }).error(function (msg, code) {
                deferred.reject(msg);
            });
            return deferred.promise;
        }

        function deleteGroup(group) {
            var authToken = authService.getAuthToken();
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: appSettings.BaseUri + appSettings.ServiceApiUri + "group/DeleteGroup",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
                data: group
            }).success(function (data) {
                reloadGroup(group, 'delete');
                //$rootScope.$emit("reloadSidebarGroups", "reloading sidebar groups …");
                deferred.resolve({
                    success: data.success,
                    error: data.error
                });
            }).error(function (msg, code) {
                deferred.reject(msg);
            });
            return deferred.promise;
        }

        function removeContactFromGroup(input) {
            var authToken = authService.getAuthToken();
            var deferred = $q.defer();
            $http({
                method: 'POST',
                //url: appSettings.BaseUri + appSettings.ServiceApiUri + "group/RemoveContactFromGroup",
                url: appSettings.BaseUri + appSettings.ServiceApiUri + "group/RemoveContactFromGroupByPublicId",
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

        //////////////

        function setGroups(groups) {
            localStorageService.set("groups", groups);

        }

        function getGroups() {
            return localStorageService.get("groups");
        }

        function clearGroups() {
            return localStorageService.remove("groups");
        }

        function isLoaded() {
            return !(getGroups() === null || getGroups() === undefined);
        }

        function getGroupById(id) {
            return $.grep(localStorageService.get("groups"), function (e) {
                return e.id == id;
            })[0];
        }

        function getGroupsByIdList(idArr) {
            return $.grep(localStorageService.get("groups"), function (e) {
                return $.inArray(e.id, idArr) != -1;
            });
        }

        function reloadGroup(group, action) {
            var groups = getGroups();
            var new_groups = [];
            switch (action) {

                case 'add':
                case 'update':
                    new_groups = groups.filter(function (e) {
                        return e.id !== group.id;
                    });
                    new_groups.push(group);
                    setGroups(new_groups);

                    break;

                case 'delete':
                    new_groups = groups.filter(function (e) {
                        return e.id !== group.id;
                    });
                    setGroups(new_groups);
                    break;

                default:
                    getAllGroups();
                    break;
            }

        }

        function addSelectedContactsToGroup(contactsToGroup, selectedGroup) {
            var authToken = authService.getAuthToken();
            var deferred = $q.defer();
            $http({
                method: 'POST',
                // url: appSettings.BaseUri + appSettings.ServiceApiUri + "group/CreateBulkContactGroupInsert",
                url: appSettings.BaseUri + appSettings.ServiceApiUri + "group/CreateBulkContactWithGroupInsert",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
                data: { 
                    bulkContact: contactsToGroup,
                    bulkGroup: selectedGroup
                }
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

        function getAllGroupsWithRecipients() {
            var authToken = authService.getAuthToken();
            var deferred = $q.defer();

            $http({
                method: 'POST',
                url: appSettings.BaseUri + appSettings.ServiceApiUri + "group/GetAllGroupsWithRecipient",
                headers: {
                    'Authorization': 'Bearer ' + authToken
                },
                data: {}
            }).success(function (data) {
                deferred.resolve({
                    items: data.result.items,
                    success: data.success,
                    error: data.error
                });
            }).error(function (msg, code) {
                deferred.reject(msg);
            });



            return deferred.promise;
        }

        //////////////

    }
})();