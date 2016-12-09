(function() {
  'use strict';

  angular
    .module('ServerlessBlog')
    .config(config);

  /** @ngInject */
  function config($logProvider, $locationProvider, toastrConfig) {
    // Enable log
    $logProvider.debugEnabled(true);

    // HTML5Mode
    // $locationProvider.html5Mode(true);
    
    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
  }

})();
