(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/template-preview/template-preview.html',
    controller: TemplatePreviewController,
    bindings: {
    }
  };

  angular
    .module('jibbar.templatePreview')
    .component('jibbarTemplatePreview', componentConfig);

  TemplatePreviewController.$inject = ['$element', '$stateParams', 'jibbarPopup', 'templateService','emailService'];

  function TemplatePreviewController($element, $stateParams, jibbarPopup, templateService,emailService) {
    var vm = this;

    vm.$onInit = $onInit;

    ///////

    var iframeElement = $element.find('.c-templates-preview__iframe');
    var iframeDocument = iframeElement[0].contentDocument || iframeElement[0].contentWindow.document;
    var iframeBodyElement = angular.element('body', iframeDocument);

  
    function $onInit() {
      initTemplatePreview();
      
    }

    function initTemplatePreview() {
      iframeBodyElement.css({
        'margin': 0,
        'background-color': '#fff'
      });
      var prefix = $stateParams.templateId.substring(0, 5);
      
      if (prefix == 'e_id_'){
        var emailId = $stateParams.templateId.replace(prefix,"");
        emailService.getEmailByPublicId(emailId)
          .then(function (result) {
              
              iframeBodyElement.html(unescape(result.result.body));
              adjustIframeHeightToItsContentHeight();
          });
      }
      else{
        templateService.getEmailTemplate($stateParams.templateId)
          .then(function (result) {
              iframeBodyElement.html(unescape(result.template_html));
              adjustIframeHeightToItsContentHeight();
          });
      }
      

    }

    function adjustIframeHeightToItsContentHeight() {
      iframeElement.height(iframeDocument.body.scrollHeight);
    }
  }
})();
