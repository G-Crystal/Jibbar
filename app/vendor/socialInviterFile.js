var SI = (function () {
    var signatureObj = {}, callback;
    var endpoint = "http://localhost:63477/socialinviter/api/getsignature.aspx";
    if (window.location.href.toString().indexOf("63477") == -1)
        endpoint = "//socialinviter.com/api/getsignature.aspx";
    var makeCall = function (lics) {
        var rurl = endpoint + "?license=" + lics + "&callback=SI.load" + "&formaturl=" + window.location;
        var jspt = document.createElement('script');
        jspt.setAttribute('src', rurl);
        document.getElementsByTagName('head')[0].appendChild(jspt);
    }
    var getSignature = function (license) {
        return signatureObj[license];
    }
    var init = function (licenseObj) {
        if (licenseObj) {
            var list = licenseObj.license;
            if (list) {
                if (licenseObj.callback)
                    callback = licenseObj.callback;
                var type = Object.prototype.toString.call(list);
                if (type == "[object String]") {
                    makeCall(list);
                }
                else if (type == "[object Array]") {
                    var licenses = [];
                    var len = list.length;
                    for (var i = 0; i < len; i++) {
                        licenses.push(list[i]);
                    }
                    makeCall(licenses.join(","));
                }
                else {
                    return "Invalid argument";
                }
            }
        }
        else
            return "License empty";
    }
    var load = function (sigs) {
        if (sigs) {
            if (sigs.error == "") {
                //signatureObj = sigs.signaturekey;
                signatureObj = $.extend({}, signatureObj, sigs.signaturekey);
                if (callback) {
                    callback(signatureObj);
                }
            }
            else {
                try {
                    console.log(sigs.error);
                } catch (e) { }
            }
        }
        else {
            try {
                console.log("Something went wrong");
            } catch (e) { }
        }
    }
    return {
        initialize: init,
        load: load,
        getSignature: getSignature
    }
})();

//SI.initialize({ license: "lic_testsd", callback: function (sigData) {
//    console.log(sigData);
//}
//})