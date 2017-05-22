(function () {
    'use strict';

    angular
        .module('jibbar')
        .factory('statemoveService', statemoveService);

    statemoveService.$inject = ['jibbarPopup','emailService'];

    function statemoveService(jibbarPopup,emailService) {
        
        var service = {
            checkMove: checkMove

        };

        return service;

        ////////////////////

        function checkMove(event,current,next,proceed){
           if(!emailService.IsEditingInProgress()) return;
        	 var allowedMove = [
                          "dashboard.templates.recipients",
                          "dashboard.templates.preview",
                          "dashboard.templates.prepare",
                          "dashboard.templates.schedule",
                          "dashboard.templates.builder"
                        ];
            if(allowedMove.includes(current)&&!allowedMove.includes(next.name)&&!proceed){
            	jibbar.event.trigger(jibbar.event.events.RESET_DESTINATION_EVENT,{
                   destination: next.name
                    
                });
            	jibbarPopup.open('dashboard-templates-prepare-discard-popup');
            	event.preventDefault();
            }
        }
    }
})();