(function() {
	'use strict'

	angular
		.module('ServerlessBlog')
		.directive('menuButton',menuButton);

	/** @ngInject **/
	function menuButton() {
		var directive = {
			restrict:'E',
			replace:true,
			template:'<div layout="row" ' +
        				'layout-align="end start"> ' +
        				'<md-button ng-click="vm.toggleRight()" ' +
          					'class="md-icon-button" ' +
          					'aria-label="Menu"> ' +
          					'<md-icon>menu</md-icon> ' +
        			  	'</md-button> ' +
      				  '</div>',
			controller:MenuButtonController,
			controllerAs: 'vm',
			bindToController:true
		};

		return directive;
	}

	function MenuButtonController($log,$mdSidenav) {
		var vm = this;
			vm.toggleRight = buildToggler('right');
		function buildToggler(navID) {
	      return function() {
	        $mdSidenav(navID).toggle();
	      }
	    }

	}

})();