(function () {
  'use strict';

  angular
    .module('jibbar.radio')
    .service('jibbarRadio', radioService);

  radioService.$inject = [];

  function radioService() {
    var groups = {};

    var service = {
      addToGroupAndGetValue: addToGroupAndGetValue,
      removeFromGroup: removeFromGroup
    };

    return service;

    ///////

    function addToGroupAndGetValue(name, option) {
      if (!groups[name]) createGroup(name, option);
      groups[name].options.push(option);
      return groups[name].value;
    }

    function removeFromGroup(name, option) {
      if (!groups[name]) return;

      var index = groups[name].options.indexOf(option);
      if (index > -1) groups[name].options.splice(index, 1);

      // remove group if no items exists
      if(!groups[name].options.length) {
        delete groups[name];
        return;
      }

      // change to first available if deleted item was selected
      if(groups[name].value == option) {
        groups[name].value = groups[name].options[0];
      }
    }

    function createGroup(name, option) {
      groups[name] = {
        value: option,
        options: []
      };
    }
  }
})();