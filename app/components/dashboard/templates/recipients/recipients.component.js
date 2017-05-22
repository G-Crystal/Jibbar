(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/templates/recipients/recipients.html',
    controller: TemplatesRecipientsController,
    bindings: {
      sketch: '<'
    }
  };

  angular
    .module('jibbar.dashboard.templates.recipients')
    .component('jibbarDashboardTemplatesRecipients', componentConfig);

  TemplatesRecipientsController.$inject = ['groupService', 'contactService', 'toastr', 'localStorageService','emailService','backService','statemoveService','$scope'];

  function TemplatesRecipientsController(groupService, contactService, toastr, localStorageService, emailService, backService,statemoveService,$scope) {
    var vm = this;

    vm.$onInit = $onInit;
    vm.isViewingAdded = false;
    vm.filterGroupsLetter = null;
    vm.filterIndividualsLetter = null;
    vm.sortIndividualsBy = null;
    vm.sortAddedBy = null;
    vm.getGroups = getGroups;
    vm.getIndividuals = getIndividuals;
    vm.getAdded = getAdded;
    vm.addOrRemoveGroup = addOrRemoveGroup;
    vm.addOrRemoveContact = addOrRemoveContact;

    vm.getAllGroups = getAllGroups;
    vm.loadContacts = loadContacts;

    ///////

    // var iframeElement = angular.element('.c-templates-recipients__preview-iframe');
    // var iframeDocument = iframeElement[0].contentDocument || iframeElement[0].contentWindow.document;
    // var iframeBodyElement = angular.element('body', iframeDocument);

    vm.groups = [];
    vm.group = {
      id: '',
      groupName: '',
      itemsCount: '',
      isSelected: ''
    };

    vm.individuals = [];
    vm.contact = {
      id: '',
      firstName: '',
      lastName: '',
      emailAddress: '',
      publicID: '',
      isSelected: ''
    };

    vm.addedContacts = [];

    vm.selectedGroups = [];
    
    jibbar.event.on(jibbar.event.events.SWITCH_VIEW_RECIPIENT_EVENT, function(data) {        
            vm.isViewingAdded = !vm.isViewingAdded;
    });

    ////////////////Notification on leaving editor start/////////////////////////////////////////
    $scope.$on("$stateChangeStart", function(event, next, current){
      statemoveService.checkMove(event,'dashboard.templates.recipients',next,current.proceed);
    });
    ////////////////Notification on leaving editor end/////////////////////////////////////////

    function $onInit() {
      // initTemplatePreview();      
      backService.setCurrentPage('dashboard.templates.recipients');
      var addedContactsLocalStorage = JSON.parse(localStorageService.get("addedContacts"));
      var loadedGroupsLocalStorage = JSON.parse(localStorageService.get("loadedGroups"));
      var loadedContactsLocalStorage = JSON.parse(localStorageService.get("loadedContacts"));
      if (addedContactsLocalStorage != null) {
        vm.addedContacts = addedContactsLocalStorage;
      }
      if (loadedGroupsLocalStorage != null) {
        vm.groups = loadedGroupsLocalStorage;
      } else {
        vm.getAllGroups();
      }

      if (loadedContactsLocalStorage != null) {
        vm.individuals = loadedContactsLocalStorage;
      } else {
        vm.loadContacts();
      }

    }

    function initTemplatePreview() {
      iframeBodyElement.css({
        margin: 0
      });

      // iframeBodyElement.html(vm.sketch);

      // add covering element to body to prevent clicking links
      var coveringElement = angular.element('<div>').css({
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'width': '100%',
        'height': '100%',
        'z-index': 1000
      });
      iframeBodyElement.append(coveringElement);
    }

    function getGroups() {
      return vm.groups;
    }

    function getIndividuals() {
     
      return vm.individuals;
    }

    function getAdded() {
      return vm.addedContacts;
    }

    function addOrRemoveGroup(group) {
      var input = {
        id: group.id
      };

      groupService.getGroupContactsByGroupId(input).then(
        function (result) {
          if (result.success) {
            vm.groupContactsData = result.contacts;
            for (var i = 0; i < vm.groupContactsData.length; i++) {
              var toAdd = true;

              for (var j = 0; j < vm.addedContacts.length; j++) {
                if (vm.addedContacts[j].emailAddress == vm.groupContactsData[i].emailAddress) {
                  toAdd = false;
                  if (group.isSelected == 0) {
                    if (vm.addedContacts[j].totalSelected > 1) {
                      vm.addedContacts[j].totalSelected = vm.addedContacts[j].totalSelected - 1;
                    } else {
                      //Remove the contact from addedContactList
                      vm.addedContacts.splice(j, 1);
                    }
                  } else {
                    vm.addedContacts[j].totalSelected = vm.addedContacts[j].totalSelected + 1;
                  }

                  break;
                }
              }

              if (toAdd == true && group.isSelected == 1) {
                vm.selectedGroupContact = {
                  id: '',
                  firstName: '',
                  lastName: '',
                  emailAddress: '',
                  publicID: '',
                  totalSelected: 0
                };
                vm.selectedGroupContact.id = vm.groupContactsData[i].id;
                vm.selectedGroupContact.firstName = vm.groupContactsData[i].firstName;
                vm.selectedGroupContact.lastName = vm.groupContactsData[i].lastName;
                vm.selectedGroupContact.emailAddress = vm.groupContactsData[i].emailAddress;
                vm.selectedGroupContact.publicID = vm.groupContactsData[i].publicID;
                vm.selectedGroupContact.totalSelected = 1;

                vm.addedContacts.push(angular.copy(vm.selectedGroupContact));
              }
            }
            localStorageService.set("addedContacts", JSON.stringify(vm.addedContacts));
            localStorageService.set("loadedGroups", JSON.stringify(vm.groups));
            localStorageService.set("loadedContacts", JSON.stringify(vm.individuals));
            emailService.setSelectedRecipients(vm.addedContacts);
          }
        },
        function (error) {
          toastr.error(error.error.message);
        }
      )
    }

    function addOrRemoveContact(contact) {
      var toAdd = true;

      for (var j = 0; j < vm.addedContacts.length; j++) {
        if (vm.addedContacts[j].emailAddress == contact.emailAddress) {
          toAdd = false;
          if (contact.isSelected == 0) {
            if (vm.addedContacts[j].totalSelected > 1) {
              vm.addedContacts[j].totalSelected = vm.addedContacts[j].totalSelected - 1;
            } else {
              // Remove the contact from addedContactList
              vm.addedContacts.splice(j, 1);
            }
          } else {
            vm.addedContacts[j].totalSelected = vm.addedContacts[j].totalSelected + 1;
          }

          break;
        }
      }

      if (toAdd == true && contact.isSelected == 1) {
        vm.selectedContact = {
          id: '',
          firstName: '',
          lastName: '',
          emailAddress: '',
          publicID: '',
          totalSelected: 0
        };
        vm.selectedContact.id = contact.id;
        vm.selectedContact.firstName = contact.firstName;
        vm.selectedContact.lastName = contact.lastName;
        vm.selectedContact.emailAddress = contact.emailAddress;
        vm.selectedContact.publicID = contact.publicID;
        vm.selectedContact.totalSelected = 1;

        vm.addedContacts.push(angular.copy(vm.selectedContact));
      }

      localStorageService.set("addedContacts", JSON.stringify(vm.addedContacts));
      localStorageService.set("loadedContacts", JSON.stringify(vm.individuals));

      emailService.setSelectedRecipients(vm.addedContacts);
    }

    ////////

    function getAllGroups() {
      vm.groups = [];
      groupService.getAllGroupsWithRecipients().then(
        function (result) {
          if (result.success) {
            for (var i = 0; i < result.items.length; i++) {
              vm.group.id = result.items[i].id;
              vm.group.groupName = result.items[i].groupName;
              vm.group.itemsCount = result.items[i].memberCount;
              vm.group.isSelected = false;
              vm.groups.push(angular.copy(vm.group));
              vm.group = {
                id: '',
                groupName: '',
                itemsCount: '',
                isSelected: ''
              };
            }
          }
        },
        function (error) {
          toastr.error(error.error.message);
        }
      )
    }

    function loadContacts() {
      var filter = "";
      contactService.getAllContacts(filter).then(
        function (result) {
          if (result.success) {
            //vm.contacts = result.items;
            for (var i = 0; i < result.items.length; i++) {
              vm.contact.id = result.items[i].id;
              vm.contact.firstName = result.items[i].firstName;
              vm.contact.lastName = result.items[i].lastName;
              vm.contact.emailAddress = result.items[i].emailAddress;
              vm.contact.publicID = result.items[i].publicID;
              vm.contact.isSelected = false;
              vm.individuals.push(angular.copy(vm.contact));
              vm.contact = {
                id: '',
                firstName: '',
                lastName: '',
                emailAddress: '',
                publicID: '',
                isSelected: ''
              };
            }
          }
        },
        function (error) {
          toastr.error(error.message);
        }
      )
    }

  }
})();