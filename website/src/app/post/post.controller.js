(function() {
	'use strict'

	angular
    .module('ServerlessBlog')
    .controller('PostController', PostController);

    /** @ngInject **/
    function PostController(
        $scope, 
        $timeout, 
        $log, 
        $stateParams, 
        $mdSidenav,
        toastr, 
        apigService, 
        authService ) {

    	var vm = this;
    		vm.content = "Loading...";
    		vm.title = "";
            vm.comments = [];
            vm.loading = true;
            vm.submitting = false;
            vm.comment = "";
            vm.submitComment = submitComment;
            vm.login = login;
            vm.authenticated = authService.sessionStatus();

        $scope.$watch(
            function() { 
                return authService.sessionStatus(); 
            }, 
            function(status) {
                vm.authenticated = status;
            }
        );

    	activate();

    	function activate() {
            getPost();
    	}

        function login() {
            $mdSidenav('right').toggle();
        }

        function submitComment() {
            vm.submitting = true;
            //$log.info(vm.comment);
            apigService.createComment($stateParams.id,vm.comment)
                .then(function(result) {
                    //$log.info(result);
                    vm.comment = "";
                    vm.comments.unshift(result);
                    vm.submitting = false;
                }, function(error) {
                    $log.error(error);
                    toastr.error(error.errorMessage || "Error Creating Comment");
                    vm.submitting = false;
                });
        }

        function getPost() {
            vm.loading = true;
            apigService.getPost($stateParams.id)
                .then(function(result) {
                    vm.content = result.body;
                    vm.title = result.title;
                    vm.created = result.createdAt;
                    getComments(result.id);
                },function(error) {
                    $log.error(error);
                    vm.loading = false;
                });
        }

        function getComments(postId) {
            vm.loading = true;
            apigService.getComments(postId)
                .then(function(result) {
                    vm.comments = result;
                    vm.loading = false;
                },function(error) {
                    $log.error(error);
                    vm.loading = false;
                });
        }
    }

})();