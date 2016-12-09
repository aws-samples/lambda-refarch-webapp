(function() {
	'use strict'

	angular
		.module('ServerlessBlog')
		.directive('forumSelect',forumSelect);

		/** @ngInject **/
		function forumSelect($log,apigService) {
			var directive = {
				restrict: 'E',
				replace:true,
				scope: {
					'selectedForum': '=forum'
				},
				template: '<md-select ng-model="selectedForum" placeholder="Select a Forum" md-autofocus> ' +
            			  '		<md-option ng-repeat="forum in forums" ng-value="forum.id">{{forum.name}}</md-option> ' +
          				  '</md-select>',
				link: link
			};

			return directive;

			function link(scope, el, attr) {
				apigService.getForums()
			        .then(function(result) {
			          scope.forums = result;
			        },function(result) {
			          $log.error('getForums error: ', result);
			        });
			};
		}
})();