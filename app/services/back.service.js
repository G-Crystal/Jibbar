(function() {
'use strict';

    angular
        .module('jibbar')
        .factory('backService', backService);

    backService.$inject = ['localStorageService','$state'];
    
    function backService(localStorageService,$state) {
       
        var service = { 
        	initializePage: initializePage,
            setCurrentPage:setCurrentPage,
            goBack:goBack,
            generatePdf: generatePdf
        };
        
        return service;

        function initializePage() {
			
			localStorageService.set("page.previous", "");
			localStorageService.set("page.current", "");
            localStorageService.set("arg.previous", {});
            localStorageService.set("arg.current", {});
        }

        function setCurrentPage(page,arg) {
			if (typeof(arg)=='undefined') arg = {};
			localStorageService.set("page.previous", localStorageService.get("page.current"));
            localStorageService.set("arg.previous", localStorageService.get("arg.current"));
			localStorageService.set("page.current", page);
            localStorageService.set("arg.current", arg);
        }
        function goBack(page) {
            if(typeof(page)=='undefined'){
                if(typeof(localStorageService.get("page.previous"))!='undefined' && localStorageService.get("page.previous")!="")
                $state.go(localStorageService.get("page.previous"),localStorageService.get("arg.previous"));
            }
            else{
                $state.go(page);
            }
        	
        }
        function generatePdf(id,filename){
          html2canvas(document.getElementById(id), {
                  onrendered: function (canvas) {
                      debugger
                      var data = canvas.toDataURL();
                      var docDefinition = {
                          content: [{
                              image: data,
                              width: 700,
                          }]
                      };
                      pdfMake.createPdf(docDefinition).download(filename);
                  }
              });

    }
    }
})();