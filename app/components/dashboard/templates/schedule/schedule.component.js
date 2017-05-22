(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/templates/schedule/schedule.html',
    controller: TemplatesScheduleController,
    bindings: {
      schedule: '='
    }
  };

  angular
    .module('jibbar.dashboard.templates.schedule')
    .component('jibbarDashboardTemplatesSchedule', componentConfig);

  TemplatesScheduleController.$inject = ['toastr', '$state', '$stateParams', 'emailService', 'jibbarBuilder', 'timezoneService','backService','$scope','statemoveService'];

  function TemplatesScheduleController(toastr, $state, $stateParams, emailService, jibbarBuilder, timezoneService,backService,$scope,statemoveService) {


    var vm = this;

    vm.$onInit = $onInit;
    vm.dateOptions = {
      minDate: new Date(),
      showWeeks: false
    };
    vm.addNewSchedule = addNewSchedule;
    //vm.editSchedule = editSchedule;
    vm.ScheduleNow = ScheduleNow;
    vm.recipientsList = [];
    vm.isEditMode = false;
    vm.saveSchedule = saveSchedule;
    vm.schedulePubliId = null;
    vm.sendNow         = sendNow;
    vm.scheduleon  = null;
    ///////

    ////////////////Notification on leaving editor start/////////////////////////////////////////
    $scope.$on("$stateChangeStart", function(event, next, current){
      statemoveService.checkMove(event,'dashboard.templates.schedule',next,current.proceed);
    });
    ////////////////Notification on leaving editor end/////////////////////////////////////////


    function $onInit() {
      vm.schedulePubliId = $stateParams.publicId;
      if (vm.schedulePubliId != null) {
        getScheduledMail(vm.schedulePubliId);
      } else {
        vm.schedule = timezoneService.currentDateTimeInTimeZone();
        vm.scheduleon = timezoneService.formatDateTime();
      }
      backService.setCurrentPage('dashboard.templates.schedule');
    }

    function saveSchedule() {

       if(emailService.getNumberOfReceipents() == 0)
         {
           toastr.warning("Please select recipients.")
            $state.go('dashboard.templates.recipients')
           return false;
         }
         else
           {
                if (!vm.isEditMode) {
                  vm.addNewSchedule();
                } else {
                  vm.editSchedule();
                }
           }

    }

    function addNewSchedule() {
      vm.recipientsList = emailService.getSelectedRecipients();
      if (vm.recipientsList.length === 0) {
        toastr.warning("Please select recipients before schedule mail.")
        return false;
      }
      if (emailService.getCurrentEmailSubject() == null || emailService.getCurrentEmailSubject() == "") {
        toastr.warning("Email subject can't be blank");
        return false;
      }

      vm.ScheduleNow();

    }

    function ScheduleNow() {
      console.log("Setting schedule:" + vm.schedule);

         $state.go('dashboard.templates.prepare', { isScheduled: true, schedule:angular.copy(vm.schedule)});    

      // vm.email = emailService.getCurrentEmailInfo();
      // //if (vm.email.body === null) {
      // vm.email.body = escape(jibbarBuilder.getIframeMainContainerElement()[0].innerHTML); //emailService.getCurrentEmailBody();
      // //}
      // vm.email.isTest = false;
      // vm.email.isScheduled = true;
      // vm.email.recipients = vm.recipientsList[0];
      // vm.email.scheduled_on = timezoneService.convertToUtc(angular.copy(vm.schedule)); //moment.utc(angular.copy(vm.schedule)).format('YYYY-MM-DD HH:mm:ss Z');
      // emailService.sendMail(vm.email).then(

      //   function (result) {
      //     if (result.success) {
      //       toastr.success("Email scheduled successfully");
      //       vm.email = {};
      //       $state.go('dashboard.templates.list');
      //     } else {
      //       toastr.error(result.error);
      //     }

      //   },
      //   function (error) {

      //     toastr.error("Something went wrong!!!");
      //   });
    }

    function sendNow(){
        $state.go('dashboard.templates.prepare', { isScheduled: false});    
    }

  }
})();