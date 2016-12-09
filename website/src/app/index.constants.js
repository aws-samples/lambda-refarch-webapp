/* global malarkey:false, moment:false */
(function() {
  'use strict';

  angular
    .module('ServerlessBlog')
    .constant('malarkey', malarkey)
    .constant('moment', moment);
})();
