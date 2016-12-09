(function() {
	'use strict'

	angular
		.module('ServerlessBlog')
		.factory('authService', authService);

	/**
	 *
	 * Authentication service to handle Cognito authentication and identity.
	 * Most services will return a $q promise. sessionStatus variable is used
	 * to track logged in status for views. Views can call sessionStatus() or 
	 * $watch sessionStatus() for changes to authentication.
	 *
	 * $cookies are used to store authentication identity tokens etc. from 
	 * cognito to persist sessions.
	 *
	 */
	function authService(
		$q,
		$log,
		$cookies, 
		$window,
		awsRegion,
		awsCognitoIdentityPoolId ) {

		var sessionStatus = undefined, 
			user = {}, 
			syncClient = undefined;

		var svc = {
			me: function() {
				return user;
			},
			setSessionStatus: function(status) {
				sessionStatus = status;
			},
			logout: function(service) {
				var then = $q.defer();
				AWS.config.credentials.clearCachedId();
				delete AWS.config.credentials.params.Logins;
				var creds = AWS.config.credentials = new AWS.CognitoIdentityCredentials({
		    		IdentityPoolId: awsCognitoIdentityPoolId
		    	});
		    	AWS.config.update({
		    		region: awsRegion,
		    		credentials: creds
		    	});

		    	$cookies.remove('awsOpenIdToken');
				$cookies.remove('awsIdentityId');
				$cookies.remove('awsEmail');

				creds.get(function(err) {
					if (err) {
						$log.error(err);
						$q.reject(err);
					} else {
						sessionStatus = false; 
						then.resolve();
					}
				});
				
				if (typeof FB !== 'undefined') {
					FB.logout(function(response) {
					  sessionStatus = false; 
					});
				}
				
				return then.promise;
			},
			sessionStatus: function() {
				if (typeof sessionStatus === 'undefined') {
					svc.getIdentity();
				};
			  	return sessionStatus;
			},
			login: function(service,data) {
				var then = $q.defer();
		   		AWS.config.credentials.params.Logins = AWS.config.credentials.params.Logins || {};
		   		AWS.config.credentials.params.Logins[service] = data.openIdToken;

		   		if (data) {
		   			$cookies.put('awsOpenIdToken',data.openIdToken);
					$cookies.put('awsIdentityId',data.identityId);
					$cookies.put('awsEmail',data.email);
				}

		   		svc.getIdentity(data)
		   			.then(function(client) {
		   				svc.setSessionStatus(true);
		   				then.resolve(client);
		   			}, function(err) {
		   				$log.error(err);
		   				svc.setSessionStatus(false);
		   				then.reject();
		   			});
		   		return then.promise;
			},
			getIdentity: function(data) {
				var then = $q.defer();

				if ($cookies.get('awsOpenIdToken') && 
					$cookies.get('awsEmail') &&
					$cookies.get('awsIdentityId')) {

					AWS.config.credentials = new AWS.CognitoIdentityCredentials({
	                   IdentityPoolId: awsCognitoIdentityPoolId,
	                   IdentityId: $cookies.get('awsIdentityId'),
	                   Logins: {
                       		'cognito-identity.amazonaws.com': $cookies.get('awsOpenIdToken')
	                   }
			   		});
				   	user.email = $cookies.get('awsEmail');
				   	this.setSessionStatus(true);
				}
				AWS.config.credentials.get(function(err,data) {
				  if (!err) {
				    var id = (data)?data.identityId:AWS.config.credentials.identityId;
			    	user.id = id;
				    if (sessionStatus && !syncClient) {
				    	syncClient = new AWS.CognitoSyncManager();
				    	syncClient.openOrCreateDataset('blogCreds', function(err, dataset) {
			              dataset.put('email',$cookies.get('awsEmail'), function(err, record) {
			                if (err) $log.error(err);
			              });
			              dataset.synchronize({
			                onSuccess: function(dataset, newRecords) {
			                   //$log.debug('dataset: ', newRecords);
			                },
			                onConflict: function(dataset, conflicts, callback) {
			                   $log.error('CONFLICT:', conflicts);
			                }
			              });
			            });
				    }
				    then.resolve(syncClient);
				  } else {
				  	$log.error(err);
				  	svc.logout();
				  }
				});
				return then.promise;
			},
			getSyncClient: function() {
				return syncClient;
			}
		};
		return svc;
	}

})();