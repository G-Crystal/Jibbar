(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/home/sign-in/sign-in.html',
    controller: HomeSignInController,
    bindings: {}
  };

  angular
    .module('jibbar.home.sign-in')
    .component('jibbarHomeSignIn', componentConfig);

  HomeSignInController.$inject = ['authService', 'appSettings', 'toastr', '$state', '$q', 'groupService', 'jibbarHubService', '$cookies', 'templateService', 'signatureService','backService'];

  function HomeSignInController(authService, appSettings, toastr, $state, $q, groupService, jibbarHubService, $cookies, templateService, signatureService, backService) {
    var vm = this;

    vm.user = {
      tenancyName: "",
      usernameOrEmailAddress: "",
      password: ""
    }

    vm.signIn = signIn;
    vm.navigateToSignUp = navigateToSignUp;

    function signIn(form) {
      if (!form.$valid) {
        return false;
      }
      if (vm.user.tenancyName === '') {
        vm.user.tenancyName = "default";
      }
      authService.authenticate(vm.user).then(
        function (data) {
          if (data.success) {
            authService.setAuthToken(data.result);
            $cookies.put("BearerToken", data.result, {
              path: '/'
            });

            jibbar.event.trigger(jibbar.event.events.SIGNEDIN_EVENT, {
              profile_picture_thumb: data.userinfo.profile_picture_thumb
            });


            var promises = [];

            promises.push(groupService.getAllGroups());
            promises.push(templateService.loadMyFavouriteTemplates());
            promises.push(signatureService.getMyDefaultSignature());
            $q.all(promises).then(
              function (response) {
                backService.initializePage();
                $state.go('dashboard.templates.list');
              },
              function (error) {
                toastr.error(error.error.message);
              }
            );

          } else {
            toastr.error(data.error.details, data.error.message);
          }
        },
        function (error) {
          toastr.error(error.details, error.message);
        }
      )

    }

    function navigateToSignUp() {
      if (appSettings.isInPreRegMode) {
        $state.go('home.pre-registration');
      } else {
        $state.go('home.sign-up');
      }
    }
  }
})();