(function() {
	'use strict'

	angular
		.module('ServerlessBlog')
		.factory('apigService', apigService);

	/**
	 *
	 * API Gateway service wrapper. Handles making calls
	 * to the API Gateway and retrieve the Cognito Identitiy.
	 * Most methods will return a $q promise and provide the results
	 * property returned from the API result. Data is cached using
	 * the Angular cacheFactory for less hits to the API, the cache
	 * is cleared on page refresh.
	 *
	 */
	function apigService(
		$q,
		$log,
		$cacheFactory,
		$cookies,
		authService ) {

		var svc = {},
			client = undefined,
			sync = undefined,
			cache = $cacheFactory('api');

		/**
		 * Returns the Cognito Sync Manager
		 */
		svc.getSyncClient = function() {
			return sync;
		};
		
		/**
		 * Gets the API Gateway client if defined. If not defined
		 * creates a new API Client based on users cognito identity.
		 *
		 * @param {boolean} refresh the api credentials on login/register
		 */
		svc.getApigClient = function(refresh) {
			var then = $q.defer();
			if (typeof client === 'undefined' || refresh) {
				authService.getIdentity()
		   			.then(function(cognitoSync) {
		   				client = apigClientFactory.newClient({
							accessKey: AWS.config.credentials.accessKeyId,
							secretKey: AWS.config.credentials.secretAccessKey,
							sessionToken: AWS.config.credentials.sessionToken
						});
						sync = cognitoSync;
						then.resolve(client);
		   				
		   			}, function(err) {
		   				$log.error(err);
		   				then.reject(err);
		   			});
			} else {
				then.resolve(client);
			}
			return then.promise;
		};

		/**
		 * Refresh the api gateway credentials
		 * @return {promise}
		 **/
		svc.refresh = function() {
			return svc.getApigClient(true);
		},

		/**
		 * Get posts for a particular forum
		 * @param {string} 
		 * @returns {promise}
		 */
		svc.getPosts = function(forumId) {
			var then = $q.defer();
			svc.getApigClient()
				.then(function() {
					if (cache.get('posts-'+forumId)) {
						$log.debug('retrieved posts from cache');
						then.resolve(cache.get('posts-'+forumId));
					}
					client.forumsIdPostsGet({'id':forumId}) 
						.then(function(result) {
							$log.info('forumsIdPostsGet: ', result);
							cache.put('posts-'+forumId,result.data);
							then.resolve(result.data);
						})
						.catch(function(result) {
							cache.remove('posts-'+forumId);
							then.reject(result.data);	
						});
				}, function(error) {
					cache.remove('posts');
					$log.error(error);
					then.reject(error);
				});
			return then.promise;
		};

		/**
		 * Get all forums
 		 * @return {promose}
		 */
		svc.getForums = function() {
			var then = $q.defer();
			svc.getApigClient()
				.then(function() {
					client.forumsGet()
						.then(function(result) {
							cache.put('forums',result.data);
							then.resolve(result.data);
						}).catch(function(result) {
							then.reject(result.data);	
						});
				}, function(error) {
					$log.error(error);
					then.reject(error);
				});
			return then.promise;
		};

		/**
		 * create a post within a forum
		 * @param {object} post body
		 * @param {string} forum ID
		 * @return {promise}
		 */
		svc.createPost = function(post,forumId) {
			var then = $q.defer();
			post.email = authService.me().email;
			svc.getApigClient()
				.then(function() {
					var params = (forumId)?{'id':forumId}:{};
					console.log('params: ', params);
					client.forumsIdPostsPost(params,post)
						.then(function(result) {
							// for now clear the posts cache so we get the updated
							// posts when the user returns to the posts section
							cache.remove('posts');
							then.resolve(result.data);
						})
						.catch(function(error) {
							$log.error(error);
							then.reject(error);
						})
				}, function(error) {
					then.reject(error);
				});
			return then.promise;
		};

		/**
		 * create a comment on a post
		 * @param {string} 
		 * @param {string}
		 * @return {promise}
		 */
		svc.createComment = function(postId,message) {
			var then = $q.defer();
			svc.getApigClient()
				.then(function() {
					var body = {
						'email': authService.me().email,
						'message': message
					};
					var params = {
						'id': postId
					};
					client.postsIdCommentsPost(params,body)
						.then(function(result) {
							then.resolve(result.data);
						})
						.catch(function(error) {
							then.reject(error);
						});
				}, function(error) {
					then.reject(error);
				});
			return then.promise;
		}

		/**
		 * Get a post
		 * @param {string}
		 * @return {promise}
		 */
		svc.getPost = function(id) {
			var then = $q.defer();
			svc.getApigClient()
				.then(function() {
					if (cache.get(id)) {
						$log.debug('retrieved post '+id+' from cache');
						then.resolve(cache.get(id));
					}
					client.postsIdGet({id:id})
					.then(function(result) {
						cache.put(id,result.data);
						then.resolve(result.data);
					})
					.catch(function(result) {
						cache.remove(id);
						then.reject(result);
					});
				}, function(error) {
					cache.remove(id);
					$log.error(error);
					then.reject(error);
				});
			return then.promise;
		};

		/**
		 * Get comments for a post
		 * @param {string}
		 * @return {promise}
		 */
		svc.getComments = function(postId) {
			var then = $q.defer();
			var cacheId = 'comments:'+postId;
			if (cache.get(cacheId)) {
				$log.debug('retrieved comments for post ' + postId + ' from cache');
				then.resolve(cache.get(cacheId));
			}
			svc.getApigClient()
				.then(function() {
					client.postsIdCommentsGet({'id':postId})
						.then(function(result) {
							cache.put(cacheId,result.data);
							then.resolve(result.data);
						},function(error) {
							$log.error(error);
							cache.remove(cacheId);
							then.reject(error);
						});
				})
				.catch(function(error) {
					$log.error(error);
					cache.remove(cacheId);
					then.reject(error);
				});
			return then.promise;
		};

		/**
		 * Logout a user
		 * @return {promise}
		 */
		svc.logout = function() {
			var then = $q.defer();
			AWS.config.credentials.clearCachedId();
			authService.logout('cognito-identity.amazonaws.com')
				.then(function(result) {
					then.resolve(result);
				},function(error) {
					then.reject(error);
				});	
			return then.promise;
		};

		/**
		 * user: { email: '', password: '' }
		 */
		svc.login = function(user) {
			var then = $q.defer();
			svc.getApigClient()
				.then(function() {
					client.loginPost({},user)
						.then(function(result) {
							//$log.debug('Login Result: ', result);
							if (result.data) {
								authService.login('cognito-identity.amazonaws.com',result.data)
									.then(function() {
										then.resolve(result.data);
									},function(error) {
										then.reject(error);
									});	
							} else {
								then.reject('Login Failed');
							}
						})
						.catch(function(error) {
							$log.error(error);
							then.reject(error);
						});
				}, function(error) {
					$log.error(error);
					then.reject(error);
				});
			return then.promise;
		};

		/**
		 * user: { email: '', password: '' }
		 */
		svc.register = function(user) {
			var then = $q.defer();
			svc.getApigClient()
				.then(function() {
					client.usersPost({},user)
						.then(function(result) {
							if (!result.data || !result.data.openIdToken) {
								$log.error(result);
								then.reject('Registration Failed :(');
							} else {
								svc.login(user)
									.then(function(result) {
										then.resolve(result);
									},function(error) {
										then.reject(error);
									})
							}
						})
						.catch(function(error) {
							$log.error(error);
							then.reject(error);
						});
				})
				.catch(function(error) {
					$log.error(error);
					then.reject(error);
				});
			return then.promise;
		};

		return svc;
	}
})();