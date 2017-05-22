(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/home/pre-registration/pre-registration.html',
    controller: HomePreRegistrationController,
    bindings: {}
  };

  angular
    .module('jibbar.home.pre-registration')
    .component('jibbarHomePreRegistration', componentConfig);

  HomePreRegistrationController.$inject = ['authService', 'toastr', '$state'];

  function HomePreRegistrationController(authService, toastr, $state) {
    var vm = this;

    vm.user = {
      tenancyName: "Default",
      name: "",
      surname: "",
      userName: "",
      emailAddress: "",
      password: null,
      country: "",
      state: "",
      timezone: "",
      isExternalLogin: false,
      isActive: false,
      sendActivationEmail: true,
      isInPreRegMode: true
    };

    vm.recaptchaKey = '6LfB5gsUAAAAAHPwApNx3PZJsD0tQdvAuBRZT_Eu';
    vm.addNewUser = addNewUser;

    function addNewUser(form) {

      if (!form.$valid) {
        return false;
      }

      vm.user.userName = vm.user.emailAddress;

      authService.getUserLocationInfo().then(

        function (result) {
          vm.user.country = result.data.country_name;
          vm.user.state = result.data.region_name;
          vm.user.timezone = result.data.time_zone_string;
          authService.createUser(vm.user).then(
            function (result) {
              if (result.success) {
                toastr.success("Got It! Jibbar launches soon. You'll now be one of the first to know when it does.");
                $state.go('home.sign-in');
              } else {
                toastr.error(result.error.details, result.error.message);
              }
            },
            function (error) {
              toastr.error(error.details, error.message);
            }
          )
        })
    }
  }
})();