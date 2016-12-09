(function() {
	'use strict'

	angular
		.module('ServerlessBlog')
		.directive('post',post);

		/** @ngInject **/
		function post($log) {
			var directive = {
				restrict: 'E',
				replace:true,
				template: '<md-card> ' +
							'<md-card-header> ' +
							'<md-card-header-text>' +
								'<span class="md-headline post-title"> ' +
									'<a href="/#/post/{{post.id}}">{{ post.title || "Untitled" }}</a> ' +
								'</span> ' +
								'<span class="md-subhead">{{ post.createdAt | date:\'fullDate\' }}</span> ' +
							'</md-card-header-text> ' +
							'</md-card-header> ' +
        					'<md-card-content> ' +
          						'<p class="post-body">{{ post.body }}</p> ' +
        					'</md-card-content> ' +
        					'<md-card-footer> ' + 
        					'<md-card-actions> ' +
          						'<md-button ng-href="/#/post/{{ post.id }}">Read More</md-button> ' +
        					'</md-card-actions> ' +
        					'</md-card-footer> ' + 
      						'</md-card>',
				link: link
			};

			return directive;

			function link(scope, el, attr) {

			};
		}
})();