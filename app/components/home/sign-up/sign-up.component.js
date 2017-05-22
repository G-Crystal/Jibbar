(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/home/sign-up/sign-up.html',
    controller: HomeSignUpController,
    bindings: {}
  };

  angular
    .module('jibbar.home.sign-up')
    .component('jibbarHomeSignUp', componentConfig);

  HomeSignUpController.$inject = ['authService', 'toastr', '$state'];

  function HomeSignUpController(authService, toastr, $state) {
    var vm = this;

    vm.user = {
      tenancyName: "Default",
      name: "",
      surname: "",
      userName: "",
      emailAddress: "",
      password: "",
      country: "",
      state: "",
      timezone: "",
      isExternalLogin: false,
      isActive: false,
      sendActivationEmail: true,
      isInPreRegMode: false
    };

    vm.recaptchaKey = '6LfB5gsUAAAAAHPwApNx3PZJsD0tQdvAuBRZT_Eu';
    vm.addNewUser = addNewUser;

    function addNewUser(form) {

      if (!form.$valid) {
        return false;
      }
      vm.user.userName = vm.user.emailAddress;
      //Email activation uri
      vm.user.apiEndPoint = $state.href('home.email-activation', {}, {
        absolute: true
      });
      authService.getUserLocationInfo().then(

        function (result) {
          vm.user.country = result.data.country_name;
          vm.user.state = result.data.region_name;
          vm.user.timezone = result.data.time_zone_string;

          authService.createUser(vm.user).then(
            function (result) {
              if (result.success) {
                $state.go('home.sign-up-success', {
                  registerUser: vm.user
                });
              } else {
                toastr.error(result.error.details, result.error.message);
              }
            },
            function (error) {
              toastr.error(error.details, error.message);
            }
          )

        }
      );

    }
  }
})();