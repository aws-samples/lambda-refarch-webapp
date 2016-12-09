(function() {
  'use strict';

  angular
    .module('ServerlessBlog')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(
    $scope,
    $timeout, 
    $log, 
    toastr, 
    apigService, 
    $mdSidenav,
    authService ) {

    var vm = this;
        vm.posts = [];
        vm.loading = true;
        vm.toggleRight = buildToggler('right');
        vm.authenticated = false;
        vm.selectedForum = undefined;

    $scope.$watch(
      function() { 
        return authService.sessionStatus(); 
      }, 
      function(authenticated) {
        vm.authenticated = authenticated;
    });

    $scope.$watch(
      function() {
        return vm.selectedForum
      },
      function(forum) {
        if (forum) {
          getPosts(forum);
        }
      });

    activate();

    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }

    function activate() {
      vm.loading = true;
      apigService.getForums()
        .then(function(result) {
          vm.loading = false;
          vm.forums = result;
        },function(result) {
          vm.loading = false;
          $log.error(result);
          toastr.error(result);
        });
    }

    function getPosts(forumId) {
      $log.info('selected forum: ', forumId);
      apigService.getPosts(forumId)
        .then(function(result) {
          vm.posts = result;
          vm.loading = false;
        })
        .catch(function(result) {
          $log.error(result);
          vm.loading = false;
          // @TODO:
          // Not sure how a readable error message is returned here...
          toastr.error(result);
        });
    }
  }
})();
