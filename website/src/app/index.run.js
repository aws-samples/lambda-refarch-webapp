(function() {
  'use strict';

  angular
    .module('ServerlessBlog')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {
	//$log.debug('runBlock end');
  }

})();
