(function() {
	'use strict'

	angular
    .module('ServerlessBlog')
    .controller('CreateController', CreateController);

    /** @ngInject **/
    function CreateController(
        $scope,
        $timeout, 
        $log, 
        $state, 
        $location,
        toastr, 
        apigService, 
        authService ) {

    	var vm = this;
            vm.content = {};
            vm.title = "Create a New Blog Post";
            vm.loading = false;
            vm.submitting = false;
            vm.authenticated = false;
            vm.create = create;
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
            $log.debug('selected forum: ', forum);
        });

        function create(forum) {
            vm.submitting = true;
            $log.debug('creating post in forum ', forum);
            apigService.createPost(vm.content,forum)
                .then(function(result) {
                    if (result.errorMessage) {
                        return toastr.error(result.errorMessage);
                    }
                    toastr.info('Post Created');
                    $log.debug(result);
                    vm.submitting = false;
                    $state.go('post',{id:result.id});
                },function(error) {
                    $log.error(error);
                    vm.submitting = false;
                    toastr.error('Error creating Post');
                });
        }
    }

})();