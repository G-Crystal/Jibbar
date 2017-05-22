(function () {
  'use strict';

  var componentConfig = {
    templateUrl: 'components/dashboard/templates/used/used.html',
    controller: TemplatesUsedController,
    bindings: {}
  };

  angular
    .module('jibbar.dashboard.templates.used')
    .component('jibbarDashboardTemplatesUsed', componentConfig);

  TemplatesUsedController.$inject = ['templateService','timezoneService','backService'];

  function TemplatesUsedController(templateService,timezoneService,backService) {
    var vm = this;
	vm.usedTemplates = null;
    vm.getUsedTemplates = getUsedTemplates;

	vm.$onInit = $onInit;
    ///////

	
	function $onInit() {
		backService.setCurrentPage('dashboard.templates.used');
		getUsedTemplates();
	}
	
	
    function getUsedTemplates() {
		templateService.getEmailTemplateStatistics().then(function(data) {
			
			if(!data.success)
				return;
			var templateStatistics = data.result.map(function(item) { return {templatePublicId: item.templatePublicId, count: item.count,  lastUsed: timezoneService.formatDateTime(item.lastUsed)}});
            
			var templates = templateService.getTemplates();

			vm.usedTemplates = _.map(templateStatistics, function(stat){
				return _.extend(stat, _.find(templates, { id: stat.templatePublicId} ));
			});	
		});
    }
  }
})();
