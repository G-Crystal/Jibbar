(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/templates/builder/builder.html',
    controller: TemplatesBuilderController,
    bindings: {
      sketch: '='
    }
  };

  angular
    .module('jibbar.dashboard.templates.builder')
    .component('jibbarDashboardTemplatesBuilder', componentConfig);

  TemplatesBuilderController.$inject = ['$stateParams', '$templateRequest', 'jibbarPopup','emailService', 'templateService','$timeout','$state','backService','$scope','statemoveService'];

  function TemplatesBuilderController($stateParams, $templateRequest, jibbarPopup, emailService, templateService, $timeout,$state,backService,$scope,statemoveService) {
    var vm = this;

    vm.$onInit = $onInit;
    vm.$onDestroy = $onDestroy;
    vm.onTemplateChange = onTemplateChange;
    // vm.openBuilderAddresseePopup = openBuilderAddresseePopup;
    vm.saveInLocalStorage = saveInLocalStorage;
    vm.updateEmailBody = updateEmailBody;
    vm.openReplyAddressPopup = openReplyAddressPopup;
    vm.undoChange = undoChange;
    vm.email = {
      subject : '',
      body : ''
    };

    ///////

    ////////////////Notification on leaving editor start/////////////////////////////////////////
    $scope.$on("$stateChangeStart", function(event, next, current){
      statemoveService.checkMove(event,'dashboard.templates.builder',next,current.proceed);
    });
    ////////////////Notification on leaving editor end/////////////////////////////////////////

    function $onInit() {
    
    backService.setCurrentPage('dashboard.templates.builder');
    emailService.setCurrentEmailFromAddress();
	  //vm.sketch = null;
      fetchSelectedTemplate();
      //vm.email.subject = localStorageService.get("email.subject");  
      vm.email.subject = emailService.getCurrentEmailSubject();
      vm.email.body = unescape(emailService.getCurrentEmailBody());
      //emailService.setLastStateOfEmailBody(unescape(emailService.getCurrentEmailBody()));
      jibbar.event.on(jibbar.event.events.UNDO_LAST_EDIT_EVENT, function (data) {
           vm.undoChange();
       });
    }

    function undoChange(){
      var body = emailService.getLastStateOfEmailBody();
      //emailService.setLastStateOfEmailBody(emailService.getCurrentEmailBody());
      
      emailService.setCurrentEmailBody(body);
      onTemplateChange(body);
      $stateParams.templateId = "undo";
      $state.reload();
      
    }

    function $onDestroy() {
      jibbarPopup.remove('builder-addressee');
     //backService.checkMove($state.current.name);
       //backService.setCurrentPage('dashboard.templates.builder');
    }

    function onTemplateChange(newValue) {
      vm.sketch = newValue;
      updateEmailBody();
    }

    function fetchSelectedTemplate() {
      
      var templateID = $stateParams.templateId;
      if(templateID == ""){

        if(unescape(emailService.getCurrentEmailBody())==null)vm.sketch = null;
        //console.log(emailService.getCurrentEmailInfo());
        else vm.sketch = unescape(emailService.getCurrentEmailBody());
      }
      else if(templateID == "undo"){
        vm.sketch = unescape(emailService.getLastStateOfEmailBody());
      }
      else{
        
        //emailService.resetEmail();
        emailService.setCurrentEmailTemplate(templateID);
        vm.sketch = null;
        templateService.getEmailTemplate(templateID)
        .then(function (result) {
          vm.onTemplateChange(unescape(result.template_html));
			   
          
        });   
      }
         
    }

    // function openBuilderAddresseePopup() {
    //   jibbarPopup.open('builder-addressee');
    // }

    function saveInLocalStorage(){
      emailService.setCurrentEmailSubject(vm.email.subject);
      //localStorageService.set("email.subject", vm.email.subject);
      
    }
    function updateEmailBody() {
      //localStorageService.set("email.body", vm.value);
      //emailService.setLastStateOfEmailBody(emailService.getCurrentEmailBody());
      emailService.setCurrentEmailBody(vm.sketch);
      console.log("email body updating...");
    }

    function openReplyAddressPopup(){
      jibbarPopup.open('builder-replyaddress');
    }
     
    jibbar.event.on(jibbar.event.events.UPDATE_EMAIL_BODY_EVENT, function(data) {        
            updateEmailBody();
    });

  }
})();
