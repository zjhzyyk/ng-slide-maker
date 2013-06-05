'use strict';

describe('Controller: InsertBtnCtrl', function () {

  // load the controller's module
  beforeEach(module('slidesGeneratorApp'));

  var InsertBtnCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    InsertBtnCtrl = $controller('InsertBtnCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
