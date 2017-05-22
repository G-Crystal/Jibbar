(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/account/changepicture/changepicture.html',
    controller: ChangePictureController,
    bindings: {}
  };

  angular
    .module('jibbar.dashboard.account.changepicture')
    .component('jibbarDashboardAccountChangepicture', componentConfig);

  ChangePictureController.$inject = ['$scope', 'authService', 'Cropper', '$timeout', 'appSettings', '$q', '$rootScope', '$http', 'userImageService','backService']

  function ChangePictureController($scope, authService, Cropper, $timeout, appSettings, $q, $rootScope, $http, userImageService,backService) {

        var vm = this;
        vm.showEvent = 'show';
        vm.hideEvent = 'hide';
        vm.dataUrl = null;        
        vm.cropData = null;
		vm.profilePictureId = null;
		vm.uploadedFile = null;
        vm.$onInit = $onInit;
        vm.uploadFile = uploadFile;
        vm.saveProfilePicture = saveProfilePicture;
        vm.cancel = cancel;
		vm.cropOptions = {
						aspectRatio: 2 / 2,
						data: appSettings.profile.pictureDefaultCropData,
						rotatable: true,
						crop: function (dataNew) {
							vm.cropData = dataNew;
							preview();
						}
					};
					
        var originalFile;

        function $onInit() {
            backService.setCurrentPage('dashboard.account.changepicture');
			userImageService.getUserProfilePicture()
				.then(function(result) {

					vm.dataUrl = result.profile_picture.url;
					vm.profilePictureId = result.profile_picture.profile_picture_id;
					vm.cropOptions.data = JSON.parse(result.profile_picture_thumb.cropped);

					 $http.get(vm.dataUrl, { responseType: "blob" }).success(function(data) {
						originalFile = new File([data], 'profile');
						$timeout(showCropper);
					});
				})
        }

        function uploadFile(files) {
            if (!files || files.length == 0)
                return;

            vm.dataUrl = null;
            Cropper.encode((originalFile = files[0])).then(function (dataUrl) {            
                vm.dataUrl = dataUrl;
                $timeout(showCropper);
            });

        }

        function showCropper() { $scope.$broadcast(vm.showEvent); }
        function hideCropper() { $scope.$broadcast(vm.hideEvent); }

    
        function preview() {
            if (!originalFile || !vm.cropData) return;
            Cropper.crop(originalFile, vm.cropData).then(Cropper.encode).then(function(dataUrl) {
                (vm.previewImage || (vm.previewImage = {})).dataUrl = dataUrl;
            });
        };

        
        function saveProfilePicture() {
            var promises = [];
			
			if(vm.uploadedFile) {
				promises.push(userImageService.uploadProfilePicture(vm.uploadedFile));
			}
			promises.push(userImageService.uploadProfilePicture(vm.previewImage.dataUrl, angular.toJson(vm.cropData), vm.profilePictureId));
			
			$q.all(promises)
			.then(function (results) {
				var newUrl = results[promises.length-1].url;
				authService.setUserProfilePicture(newUrl);
				jibbar.event.trigger(jibbar.event.events.PROFILE_PICTURE_CHANGED, {url: newUrl});
					
				});
        }      

        function cancel() {
            //$uibModalInstance.dismiss();
        };

    }
    
})();
