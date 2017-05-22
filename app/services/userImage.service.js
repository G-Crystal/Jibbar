(function() {
'use strict';

    angular
        .module('jibbar')
        .factory('userImageService', userImageService);

    userImageService.$inject = ['$http', '$q', 'appSettings', 'authService', 'cloudinary'];
    
    function userImageService($http, $q, appSettings, authService, cloudinary) {
        var serviceUrlPrefix = appSettings.ImageProcessingUri;
        var imageFilenamesForImageGallery = [];
        var service = { 
            uploadAndSaveFiles: uploadAndSaveFiles,
            getUserImageIds: getUserImageIds,
			getUUID: getUUID,
			copyImageFromDraft: copyImageFromDraft,
			uploadImageFromDataUrl: uploadImageFromDataUrl,
			uploadImage: uploadImage,
			
			uploadUserGalleryImage: uploadUserGalleryImage,
            getUserGalleryImages: getUserGalleryImages,
			deleteUserGalleryImage: deleteUserGalleryImage,
			uploadProfilePicture: uploadProfilePicture,
			getUserProfilePicture: getUserProfilePicture,
			getJibbarGalleryAlbums: getJibbarGalleryAlbums,
			getJibbarAlbumImages: getJibbarAlbumImages,
			getBlobFromDataURL: getBlobFromDataURL
        };
        var bucket = new AWS.S3({ params: { Bucket: appSettings.aws.bucket } });
		
        return service;

		
		
        function getHeaders() {
            return {
                headers: {
                    'Authorization': 'Bearer ' + authService.getAuthToken()
                }
            };
        }
		
		function getUUID() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
					var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
					return v.toString(16);
				});
		}
		
		function uploadEachFileToCloud(file) {
			var deferred = $q.defer();
			var filename = getUUID();
			var params = {
				Key: appSettings.aws.userImageGalleryPath + authService.getCurrentUserPublicId() + "/" + filename,
				ContentType: file.type,
				Body: file,
				ServerSideEncryption: appSettings.aws.encryption
			};
			
			var promise = bucket.putObject(params, function (err, data) {
				imageFilenamesForImageGallery.unshift(filename);
				deferred.resolve(filename);				
			});
			
			return deferred.promise;
		}

        function uploadFilesToCloud(files) {
            var promises = [];

            angular.forEach(files, function (file) {
				
                if (file && !file.$error) {
                    promises.push(uploadEachFileToCloud(file));
                }
            });

            return promises;
        }


        function uploadAndSaveFiles(files) {
            var deferred = $q.defer();

            var promises = uploadFilesToCloud(files);

            $q.all(promises).then(function (results) {
                var data = { cloudinaryIds: results };
                $http.post(serviceUrlPrefix + "CreateUserImages", data, getHeaders())
                    .success(function () {
                        deferred.resolve(imageFilenamesForImageGallery);
                    }).error(function () {
                        deferred.reject();
                    });
            });

            return deferred.promise;
        }

        function getUserImageIds() {
            var deferred = $q.defer();
			imageFilenamesForImageGallery = [];
            $http.post(serviceUrlPrefix + "GetUserImages", null, getHeaders())
            .success(function (response) {
                response.result.cloudinaryIds.forEach(function (id) {
                    imageFilenamesForImageGallery.push(id);
                });

                deferred.resolve(imageFilenamesForImageGallery);
            })
            .error(function () {
                deferred.reject();
            })

            return deferred.promise;

        }       
		
		function getBlobFromDataURL(dataurl) {
			var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new Blob([u8arr], { type: mime });
		}
		
		function uploadImage(file, fileKey) {
            var deferred = $q.defer();
            
            if (!file || file.$error) {
                deferred.reject();
                return deferred.promise;
            }            

            var params = {
                Key: fileKey,
                ContentType: file.type,
                Body: file,
                ServerSideEncryption: appSettings.aws.encryption
            };
            
            bucket.putObject(params, function (err, data) {
                deferred.resolve();
            });
            
            return deferred.promise;
        }
		
		function uploadImageFromDataUrl(dataUrl, fileKey) {
			return uploadImage(dataURLtoBlob(dataUrl), fileKey);
		}
		
		function copyImageFromDraft(draftEmailId, emailId) {
			var oldPrefix =	appSettings.aws.draftEmailImagesPath + draftEmailId;
			var newPrefix = appSettings.aws.emailImagesPath + emailId;
			
			bucket.listObjects({Prefix: oldPrefix}, function(err, data) {
				if (data.Contents.length) {
					data.Contents.forEach(function(item) {
						var params = {
							CopySource: appSettings.aws.bucket + '/' + item.Key,
							Key: item.Key.replace(oldPrefix, newPrefix)
						};
						
						bucket.copyObject(params, function(copyErr, copyData){
							if (copyErr) {
								 console.log(err);
							}
							else {
								 console.log('copy success!!' + item.Key);
								 
								var params = {Bucket: appSettings.aws.bucket, Key: item.Key};
								bucket.deleteObject(params, function(err, data) {
								  if (err) console.log(err, err.stack);  // error
								  else     console.log('DONE');                 // deleted
								});
							}
						});
					});
				  }
			});	
		}
		
		function getBlobFromFile(file) {
			var deferred = $q.defer();
			var reader = new FileReader();
			reader.onload = function() {
				deferred.resolve(reader.result);
			};
			reader.readAsDataURL(file);
			return deferred.promise;
		}
		
		function callGalleryUploadAPI(base64data, parent_image) {	
		    if(typeof(parent_image) == 'undefined') parent_image = null;	
			var data = {"gallery": {"image_url": base64data, "parent_image": parent_image},"env": appSettings.AppEnv};
			var deferred = $q.defer();
			$http.post(serviceUrlPrefix + "UploadGalleryImage", data, getHeaders())
			.success(function (response) {
				if(response.success)
					deferred.resolve(response.result);
				else
					deferred.reject();
			})
			.error(function () {
				deferred.reject();
			})
			
			return deferred.promise;
		}

        function uploadUserGalleryImage(fileData, parent_image) {
        	if(typeof(parent_image) == 'undefined') parent_image = null;
		    var deferred = $q.defer();
			
			if(fileData == null || fileData.length == 0)
				return deferred.reject();
			
			// in case of file upload
			if(typeof fileData === 'object') {
				getBlobFromFile(fileData).then(function(base64data) {
					callGalleryUploadAPI(base64data, parent_image).then(function(response) {
						deferred.resolve(response);
					});				
				});
			}
			// in case of data url
			else if(typeof fileData === 'string') { 
				callGalleryUploadAPI(fileData, parent_image).then(function(response) {
					deferred.resolve(response);
				});
			}
            return deferred.promise;
		}
        
        function getUserGalleryImages() {
            var deferred = $q.defer();

            $http.post(serviceUrlPrefix + "GetUserGallery", {"env": appSettings.AppEnv}, getHeaders())
            .success(function (response) {
                if(response.success)
					deferred.resolve(response.result);
				else
					deferred.reject();
            })
            .error(function () {
                deferred.reject();
            })

            return deferred.promise;

        }
		
		function getJibbarGalleryAlbums() {
            var deferred = $q.defer();

            $http.post(serviceUrlPrefix + "ListAllAlbums", {"env": appSettings.AppEnv}, getHeaders())
            .success(function (response) {
                if(response.success)
					deferred.resolve(response.result);
				else
					deferred.reject();
            })
            .error(function () {
                deferred.reject();
            })

            return deferred.promise;

        }

        function getJibbarAlbumImages(album_id) {
            var deferred = $q.defer();

            $http.post(serviceUrlPrefix + "ListAllAlbumImages", {public_id: album_id,"env": appSettings.AppEnv}, getHeaders())
            .success(function (response) {
                if(response.success)
					deferred.resolve(response.result);
				else
					deferred.reject();
            })
            .error(function () {
                deferred.reject();
            })

            return deferred.promise;

        }

		function deleteUserGalleryImage(pid) {
            var deferred = $q.defer();

            $http.post(serviceUrlPrefix + "DeleteImageFromGallery", { pid: pid,"env": appSettings.AppEnv }, getHeaders())
            .success(function (response) {
                if(response.success)
					deferred.resolve();
				else
					deferred.reject();
            })
            .error(function () {
                deferred.reject();
            });

            return deferred.promise;
        }	

		function callProfilePictureUploadAPI(base64data, cropData, profilePictureId) {		
			var data = {};
			var service = "";
			
			if(cropData) {
				data = {"profile_thumb": {"image_url": base64data, "cropped": cropData, "profile_picture_id": profilePictureId},"env": appSettings.AppEnv};
				service = "UploadProfilePictureThumbnail";
			}
			else {
				data = {"profile": {"image_url": base64data},"env": appSettings.AppEnv};
				service = "UploadProfilePicture";
			}
			
			var deferred = $q.defer();
			$http.post(serviceUrlPrefix + service, data, getHeaders())
			.success(function (response) {
				if(response.success)
					deferred.resolve(response.result);
				else
					deferred.reject();
			})
			.error(function () {
				deferred.reject();
			})
			
			return deferred.promise;
		}
		
		function uploadProfilePicture(fileData, cropData, profilePictureId) {
		    var deferred = $q.defer();

			if(fileData == null || fileData.length == 0)
				return deferred.reject();
			
			// in case of file upload -- original file
			if(typeof fileData === 'object') {
				getBlobFromFile(fileData).then(function(base64data) {
					callProfilePictureUploadAPI(base64data).then(function(response) {
						deferred.resolve(response);
					});				
				});
			}
			// in case of data url -- cropped
			else if(typeof fileData === 'string') { 
				callProfilePictureUploadAPI(fileData, cropData, profilePictureId).then(function(response) {
					deferred.resolve(response);
				});
			}
            return deferred.promise;
		}	

		function getUserProfilePicture() {
		    var deferred = $q.defer();

			$http.post(serviceUrlPrefix + "GetUserProfilePicture", {"env": appSettings.AppEnv}, getHeaders())
			.success(function (response) {
				if(response.success)
					deferred.resolve(response.result);
				else
					deferred.reject();
			})
			.error(function () {
				deferred.reject();
			})
			
			return deferred.promise;
		}	
		
    }
})();