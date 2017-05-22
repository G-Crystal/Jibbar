(function () {
    'use strict';
    var env = {};

    // Import variables if present (from env.js)
    if(window){  
      Object.assign(env, window.__env);
    }
    var application_environment = env.app_environment
    var staging_app_uri = "http://jibbar-backend-staging.azurewebsites.net/"; //"http://jibbartest.com/";
    
    angular
        .module('jibbar')
        .constant("appSettings", {
            "BaseUri": application_environment =="production" ? "https://jibbar-backend-production.azurewebsites.net/" : staging_app_uri,
            //"BaseUri": "http://localhost:6240/",
            "ServiceApiUri": "api/services/app/",
            "AdminBaseUri": application_environment =="production" ? "https://jibbar-admin.herokuapp.com/v1/" : "http://jibbar-admin.herokuapp.com/v1/", 
       //   "AdminBaseUri": "http://localhost:4004/v1/",
            "JibberRedirectUri": application_environment =="production" ? "https://jibbar-redirect.herokuapp.com" : "http://jibbar-redirect.herokuapp.com",
            "SocialInviterUri": application_environment =="production" ? "https://socialinviter.com/api/contacts.aspx" : "http://socialinviter.com/api/contacts.aspx",
            //"JibberMailer": "http://localhost:30205/api/v1/",
            // "JibberMailer": "http://jibbar-mailer-api.azurewebsites.net/api/v1/",
            //"JibberScheduler": "http://localhost:48573/api/v1/",
            // "JibberScheduler": "http://jibbar-schedular.azurewebsites.net/api/v1/",
            "HubName": "abpCommonHub",
            "JibberAnalytics": application_environment =="production" ? "https://jibbar-analytics.herokuapp.com/v1/" : "https://jibbar-analytics-staging.herokuapp.com/v1/",
            "ImageProcessingUri": "https://jibbar-aws-s3.herokuapp.com/v1/",
            "AuthenticationApiUri": application_environment =="production" ? "https://jibbar-sso.herokuapp.com/v1/" : "https://jibbar-sso-staging.herokuapp.com/v1/",
            //"JibbarEmailsUri": "http://localhost:2999/v1/",
            "JibbarEmailsUri": application_environment =="production" ? "https://jibbar-emails.herokuapp.com/v1/" : "https://jibbar-emails-staging.herokuapp.com/v1/",
            "LocationServiceUri": "https://jibbar-bcap-client.azurewebsites.net/location.php",
            "isInPreRegMode": true,
            "AppEnv": application_environment =="production" ? "p" : "s",
            
            aws: {
                bucket: 'jibbar',
                accessKey: 'AKIAJYQCFHMH4PLBVRCA',
                secretKey: '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',
                region: 'ap-southeast-2',
                encryption: 'AES256',
                templateImgUrl: 'http://s3-ap-southeast-2.amazonaws.com/jibbar/',
                previewImgUrl: 'http://s3-ap-southeast-2.amazonaws.com/jibbar/templates/preview/',
                profileImgUrlOriginal: 'https://jibbar.s3.amazonaws.com/profiles/original/',
                profileImgUrlCropped: 'https://jibbar.s3.amazonaws.com/profiles/cropped/',
                templateImgPath: 'templates/',
                previewImgPath: 'templates/preview/',
                profileImgPathOriginal: 'profiles/original/',
                profileImgPathCropped: 'profiles/cropped/',
                userImageGalleryPath: '/u/',
                jibbarImageGalleryPath: '/jibbar/',
                userImageGalleryUrl: 'https://jibbar.s3.amazonaws.com/user-gallery/',
                emailImageUrl: 'http://jibbar.s3.amazonaws.com/emails/',
                emailImagesPath: 'emails/',
                draftEmailImagesPath: 'draft-emails/',
                draftEmailImageUrl: 'http://jibbar.s3.amazonaws.com/draft-emails/',
                maximumImageSizeAllowed: 500000
            },

            profile: {
                pictureDefaultCropData: {
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100,
                    rotate: 0
                }
            }
        })
})();