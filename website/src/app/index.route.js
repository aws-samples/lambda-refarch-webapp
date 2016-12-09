(function() {
  'use strict';

  angular
    .module('ServerlessBlog')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'
      })
      .state('post', {
        url: '/post/:id',
        templateUrl: 'app/post/post.html',
        controller: 'PostController',
        controllerAs: 'post'
      })
      .state('create', {
        url: '/create',
        templateUrl:'app/post/create.html',
        controller: 'CreateController',
        controllerAs: 'post',
        onEnter: function(authService,$state,$rootScope) {
          $rootScope.$watch(
            function() {
              return authService.sessionStatus();
            },
            function(authenticated) {
              if (!authenticated) {
                $state.go('home');
              }
          });
        }
      });

    $urlRouterProvider.otherwise('/');
  }

})();
