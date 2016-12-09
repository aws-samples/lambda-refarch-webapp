(function() {
	'use strict'

	angular
		.module('ServerlessBlog')
		.directive('facebookLogin', facebookLogin);

	/** @ngInject **/
	function facebookLogin(authService,$timeout,$log) {
		var directive = {
			restrict:'E',
			replace:true,
			template:'<md-button class="md-primary md-raised" ' +
						'ng-click="onFbLogin()">Login with Facebook</md-button>',
			link: link
		};

		return directive;

		function link(scope,element,attrs) {
			scope.onFbLogin = function() {
				$ionicLoading.show({
			      template: 'Loading...'
			    });
				FB.login(function(response) {
			        if (response.authResponse) {
			            getLoginStatus();
			        } else {
			            //user hit cancel button
			            console.log('User cancelled login or did not fully authorize.');
			        }
			    }, {
			        scope: 'public_profile,email'
			    });
			};
			function getLoginStatus() {
				FB.getLoginStatus(function(response) {
				  if (response.status === 'connected') {
				    // the user is logged in and has authenticated your
				    // app, and response.authResponse supplies
				    // the user's ID, a valid access token, a signed
				    // request, and the time the access token 
				    // and signed request each expire
				    var uid = response.authResponse.userID;
				    var accessToken = response.authResponse.accessToken;
				    authService.login('graph.facebook.com', accessToken);
				  } else if (response.status === 'not_authorized') {
				    // the user is logged in to Facebook, 
				    // but has not authenticated your app
				    $log.debug(response);
				  } else {
				    // the user isn't logged in to Facebook.
				  }
				 });
			}
			// init facebook sdk
		    var d = document, s = 'script', id = 'facebook-jssdk';
		    var js, fjs = d.getElementsByTagName(s)[0];
		    if (d.getElementById(id)) return;
		    js = d.createElement(s); 
		    js.id = id;
		    js.type = 'text/javascript';
		    js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.6&appId=581233125359779";
		    fjs.parentNode.insertBefore(js, fjs);

		    $timeout(function() {
		    	getLoginStatus();
		    },500);
		}
	}
})();