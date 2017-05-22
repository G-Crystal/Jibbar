(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/builder/images-popup/images-popup.html',
    controller: ImagesPopupController,
    bindings: {}
  };

  angular
    .module('jibbar.builder.images-popup')
    .component('jibbarBuilderImagesPopup', componentConfig);

  ImagesPopupController.$inject = ['jibbarPopup', 'userImageService', 'appSettings', '$rootScope', '$scope', 'authService', 'Cropper', '$http', '$timeout', '$q', 'Upload'];

  function ImagesPopupController(jibbarPopup, userImageService, appSettings, $rootScope, $scope, authService, Cropper, $http, $timeout, $q, Upload) {
    var vm = this;

    vm.$onInit = $onInit;
    vm.imagesGallery = null;
	vm.jibbarGallery = null;
    vm.activeImage = null;
    vm.selectedImage = null;
    vm.element = null;
    vm.openImagesPopup = openImagesPopup;
    vm.closeImagesPopup = closeImagesPopup;
    vm.activateImage = activateImage;
    vm.selectActiveImage = selectActiveImage;
    vm.onImagesPopupLink = onImagesPopupLink;
    vm.onImagesPopupOpen = onImagesPopupOpen;
    vm.deleteImage = deleteImage;
    vm.uploadAndSaveFiles = uploadAndSaveFiles;
	vm.resizeCondition = resizeCondition;
	vm.changeArea = changeArea;
	vm.toggleAlbum = toggleAlbum;
    vm.imagePrefix = appSettings.aws.userImageGalleryUrl + authService.getCurrentUserPublicId() + "/";
	vm.showEvent = 'show';
	vm.hideEvent = 'hide';
	vm.getResizedUrl = getResizedUrl;
	vm.prevActiveImageUrl = null;
	vm.area = 'user';
	vm.emailImageDim = {};
	vm.cropOptions = {
		data: appSettings.profile.pictureDefaultCropData,
		autoCrop: true,
		dragCrop: false,
		autoCropArea: 1,
		zoomable: true,
		rotatable: false,
		cropBoxResizable: true,
		setDragMode: 'move',
		viewMode: 0,
		zoomSlider: true,
		toggleDragModeOnDblclick: false,
		crop: function (dataNew) {
			vm.cropData = dataNew;
			preview();
		}
	};
    ///////

    var imagesContainerElement = null;
	var originalFile;
	
	
	
    function $onInit() {
        fetchImagesGallery();

        $scope.$on('image-edit', function (event, arg) {
			vm.activeImage = null;
            vm.element = arg.element;
			vm.prevActiveImageUrl = arg.link;
			var matchedItem = $.grep(vm.imagesGallery, function(item) {return item.url == vm.prevActiveImageUrl});
			
			vm.activeImage = matchedItem && matchedItem.length >0 ? matchedItem[0] : null;

			if(arg.width && arg.height) {
				vm.emailImageDim = {width: parseInt(arg.width), height: parseInt(arg.height)};				
				vm.cropOptions.aspectRatio = arg.width / arg.height;
			}
			
			activateCropper(null);
        }); 
    }
	
	function setCropArea() {
		if(vm.cropOptions.data.width/vm.activeImage.width >vm.cropOptions.data.height/vm.activeImage.height) {
			vm.cropOptions.data.width = vm.activeImage.width;
			vm.cropOptions.data.height = vm.cropOptions.data.width/vm.cropOptions.aspectRatio;			
		}
		else {
			vm.cropOptions.data.height = vm.activeImage.height;
			vm.cropOptions.data.width = vm.cropOptions.data.height*vm.cropOptions.aspectRatio;			
			
		}
		
		
	}
	
	function adjustPreviewDimension() {
		var prevImg = $(".preview-container img");
		var cropArea = $(".crop-area");
		
		
		if(vm.emailImageDim.height > vm.emailImageDim.width)			
			prevImg.height(vm.emailImageDim.height)
		else
			prevImg.width(vm.emailImageDim.width);
		
		if(cropArea.height() < prevImg.height())
			cropArea.height(prevImg.height() * 1.2);
	}
	
	function activateCropper(blob) {
	
		hideCropper;
		
		// if template default image, no need to crop
		if(!vm.activeImage) {
			$timeout(function() {
				vm.cropSourceImageDataUrl = vm.prevActiveImageUrl;
			});
			
			return;
		}
		
		setCropArea();
		
		vm.cropOptions.strict = false; //vm.activeImage.width >= vm.cropOptions.data.width && vm.activeImage.height >= vm.cropOptions.data.height;
		
		if(blob == null) {
			vm.activeImage.url = vm.activeImage.url.replace("https://", "http://");
			$http.get(vm.activeImage.url, { responseType: "blob" }).success(function(blob) {
				cropFromFileBlob(blob);			
			});
		}
		else {
			cropFromFileBlob(blob);
			
		}
	}
	
	function cropFromFileBlob(blob) {
		originalFile = new File([blob], 'template');

		vm.cropSourceImageDataUrl = null;
		 Cropper.encode((originalFile)).then(function (dataUrl) {            
			vm.cropSourceImageDataUrl = dataUrl;
			$timeout(showCropper);
		});
		
	}

    function fetchImagesGallery() {
        userImageService.getUserGalleryImages().then(function(data) { 
			vm.imagesGallery = data;
			
			$.each(vm.imagesGallery, function(key, item) {
				setThumbUrl(item, appSettings.aws.userImageGalleryPath);
			});
		});
		
		userImageService.getJibbarGalleryAlbums().then(function(data) {
			vm.jibbarGallery = data;
		});
    }
	
	function toggleAlbum(album) {
		album.visible = !album.visible;
		
		
		
		if(album.visible) {
			$.each(vm.jibbarGallery, function(key, album) {
				album.recent = false;
			});
			album.recent = true;
			
			getAlbumImages(album);
		}
	}
	
	function getAlbumImages(album) {
		if(album.pictures && album.pictures.length >0)
			return;
	
		userImageService.getJibbarAlbumImages(album.public_id).then(function(data) {
			album.pictures = data;
			$.each(album.pictures, function(key, image) {
				setThumbUrl(image, appSettings.aws.jibbarImageGalleryPath);
			});
		});
	}
	
	function setThumbUrl (image, toReplace) {
		var width = 100, height = 100;
		image.width = parseInt(image.width);
		image.height = parseInt(image.height);
		
		if(image.width && image.height) {				
			if(image.width > image.height) {
				height = image.height/image.width * width;
			}
			else {
				width = image.width/image.height * height;
			}
			width = Math.round(width);
			height = Math.round(height);
		}
		image.thumbUrl = getResizedUrl(image.url,  width, height, toReplace);
	}

    function openImagesPopup() {
      jibbarPopup.open('builder-images');
    }

    function closeImagesPopup(newImageUrl) {
		if(newImageUrl) {
			$rootScope.$broadcast('image-update', {
											'link': newImageUrl, 
											'element': vm.element
											});
		}
		vm.activeImage = null;
		jibbarPopup.close('builder-images');
    }

    function activateImage(image) {
        vm.activeImage = image;
		activateCropper(null);
    }
	
	function getResizedUrl(awsUrl, width, height, toReplace) {
		return awsUrl.replace(toReplace, "/" + width + "x" + height + toReplace);	// resize wxh/u/
	}
	
	function isCroppingRequired() {
		if(!vm.activeImage)
			return false;

		return Math.abs(vm.activeImage.width - vm.cropOptions.data.width)>2
			|| Math.abs(vm.activeImage.height - vm.cropOptions.data.height)>2
	}
	
	function isResizingRequired() {
		if(!vm.cropData)
			return false;
		
		return Math.abs(vm.cropOptions.data.width - Math.round(vm.cropData.width))>3.5
			|| Math.abs(vm.cropOptions.data.height - Math.round(vm.cropData.height))>3.5
	}

    function selectActiveImage() {	
		var cropRequired = isCroppingRequired();
		var resizingRequired = isResizingRequired();
		
		// case: when image is template default OR image is not changed
		if((!vm.activeImage || vm.prevActiveImageUrl == vm.activeImage.url) && !cropRequired && !resizingRequired) {
			closeImagesPopup();
			return;
		}
	
		// case 2: if image is changed but no cropping, just fire update
		if(!cropRequired && !resizingRequired) {
			closeImagesPopup(vm.activeImage.url);
			return;
		}	
	
		// case: a new cropped image -- need to save the image to server		
		var deferred = $q.defer();
		
		// Need to resize the preview before saving?
		if(resizingRequired)
		{
			Upload.resize(userImageService.getBlobFromDataURL(vm.previewImage.dataUrl), {width: vm.cropOptions.data.width, height: vm.cropOptions.data.height, quality: 1})
						.then(function(resizedFile){
							deferred.resolve(resizedFile);
						});
		}
		else {
			deferred.resolve(vm.previewImage.dataUrl)
		}
		
		deferred.promise.then(function(imageData) {
			
			userImageService.uploadUserGalleryImage(imageData, vm.activeImage.pid)
			.then(function(newImage) {
				setThumbUrl(newImage, appSettings.aws.userImageGalleryPath);
				closeImagesPopup(newImage.url);
			});
		});
		
		
    }
	
    function onImagesPopupLink() {
      imagesContainerElement = angular.element('.c-builder-images-popup__container');
    }

    function onImagesPopupOpen() {
		imagesContainerElement.scrollTop(0);
		imagesContainerElement.perfectScrollbar('update');
		vm.area = 'user';
		vm.cropSourceImageDataUrl = null;
		vm.previewImage = null;
    }
	
	function changeArea(area) {
		vm.area = area;
		imagesContainerElement.scrollTop(0);
	}

    function removeImage(image) {
      var index = vm.imagesGallery.indexOf(image);
      if (index > -1) {
        vm.imagesGallery.splice(index, 1);
      }
      if (image == vm.selectedImage) {
        vm.selectedImage = null;
      }
    }

    function uploadAndSaveFiles(files) {
		
		if(files == null || files.length == 0)
			return;
		
		var file = files[0];
		var blob = null;
		var deferred = $q.defer();
		
		if(file.size > appSettings.aws.maximumImageSizeAllowed) {			// size exceeded, need to resize
			Upload.imageDimensions(file)
				.then(function(dim) {
					var ratio = file.size/appSettings.aws.maximumImageSizeAllowed;
		
					Upload.resize(file, {width: dim.width/ratio, height: dim.height/ratio, quality: 1})
						.then(function(resizedFile){ 
							deferred.resolve(resizedFile);
							blob = resizedFile;
						});
		
				}	
			)
		}
		else {
			deferred.resolve(file);
		}
		
		
		deferred.promise.then(function(fileData) {
			 userImageService.uploadUserGalleryImage(fileData)
            .then(function (newImage) {
				setThumbUrl(newImage, appSettings.aws.userImageGalleryPath);
                vm.imagesGallery.push(newImage);
				vm.area = 'user';
				vm.activeImage = newImage;
				activateCropper(blob);
            })
		}
		);
		
       
    }
	
	function resizeCondition(file, width, height) {
		return false;
	}

    function deleteImage(id) {
        userImageService.deleteUserGalleryImage(id)
            .then(function () {
                vm.imagesGallery = $.grep(vm.imagesGallery, function(item) {return item.pid != id});				
            });
    }
	
	function showCropper() { $scope.$broadcast(vm.showEvent); }
	function hideCropper() { $scope.$broadcast(vm.hideEvent); }
	
	function preview() {	
		if (!originalFile || !vm.cropData) return;
		

		Cropper.crop(originalFile, vm.cropData).then(Cropper.encode).then(function(dataUrl) {
			(vm.previewImage || (vm.previewImage = {})).dataUrl = dataUrl;
			$timeout(function(){adjustPreviewDimension();} );
			
			});

	}	
  }
})();
