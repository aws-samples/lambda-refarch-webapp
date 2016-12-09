(function() {
  'use strict';

  describe('controllers', function(){
    var vm;
    var $timeout;
    var toastr;

    beforeEach(module('ServerlessBlog'));
    beforeEach(inject(function(_$controller_, _$timeout, _toastr_) {
      spyOn(_toastr_, 'info').and.callThrough();

      vm = _$controller_('MainController');
      $timeout = _$timeout_;
      toastr = _toastr_;
    }));

    it('should show a Toastr info and stop animation when invoke showToastr()', function() {
      vm.showToastr();
      expect(toastr.info).toHaveBeenCalled();
      expect(vm.classAnimation).toEqual('');
    });

    it('should define posts', function() {
      expect(angular.isArray(vm.posts)).toBeTruthy();
      expect(vm.posts.length === 0).toBeTruthy();
    });
  });
})();
