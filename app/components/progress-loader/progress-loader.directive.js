(function () {
  'use strict';

  angular
    .module('jibbar.progressLoader')
    .directive('jibbarProgressLoader', progressLoaderDirective);

  function progressLoaderDirective() {
    var directive = {
      restrict: 'E',
      templateUrl: 'components/progress-loader/progress-loader.html',
      scope: {
        id: '@'
      },
      controller: ProgressLoaderController,
      controllerAs: '$ctrl',
      bindToController: true
    };

    return directive;
  }

  ProgressLoaderController.$inject = ['$scope', '$element', '$timeout'];

  function ProgressLoaderController($scope, $element, $timeout) {
    var vm = this;
    vm.$onInit = $onInit;
	vm.idAttrTickOutlinePath = vm.id + 'tick-outline-path';
	vm.hashIdAttrTickOutlinePath = '#' + vm.idAttrTickOutlinePath;

	vm.idAttrTickPath = vm.id + 'tick-path';
	vm.hashIdAttrTickPath = '#' + vm.idAttrTickPath;
    ///////
	


    function $onInit() {
		$timeout(function() {showTick();});
		
    }
	
		
	var showIcon = new ui.Tween({
		values: {
			opacity: 1,
			length: {
				to: 65,
				ease: 'easeIn'
			}
		}
	});

	var spinIcon = new ui.Simulate({
		values: {
			rotate: -400
		}
	});

	var progressCompleteOutline = new ui.Tween({
		values: {
			rotate: '-=200',
			length: 100
		}
	});

	var progressCompleteTick = new ui.Tween({
		delay: 150,
		values: {
			length: 100,
			opacity: 1
		}
	});
	
	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function  showTick()   {
		var progressIcon = $('.progress-icon')[0];
		
		var progressOutline = new ui.Actor({
			element: $element.find(vm.hashIdAttrTickOutlinePath)[0]
		});
		
		var progressTick = new ui.Actor({
			element: $element.find(vm.hashIdAttrTickPath)[0]
		});

		progressOutline.start(showIcon)
			.then(spinIcon);

		var time = getRandomInt(500, 5000);

		$timeout(function() {
				progressOutline.start(progressCompleteOutline);
				progressTick.start(progressCompleteTick);
			}, time);
	}


  }
})();