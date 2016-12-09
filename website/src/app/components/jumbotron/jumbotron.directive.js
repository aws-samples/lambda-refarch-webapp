(function() {
	'use strict'

	angular
		.module('ServerlessBlog')
		.directive('jumbotron', jumbotron);

	/** @ngInject **/
	function jumbotron() {
		var directive = {
			restrict:'E',
			replace:true,
			scope: {
				loading:'@'
			},
			templateUrl:'app/components/jumbotron/jumbotron.html',
			link:link
		};
		
		return directive;

		function link(scope,el,attrs) {
			scope.img = attrs.img || 'assets/images/aws-cloud.png';
			scope.alt = attrs.apt || 'Amazon Web Services';
			scope.title = attrs.title || 'Serverless Blog Engine';
			scope.description = attrs.description || 'A serverless blog engine using Amazon Web Services'; 
		}
	}

})();