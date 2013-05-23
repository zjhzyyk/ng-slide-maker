'use strict';

describe('Controller: DragItemCtrl', function () {

  // load the controller's module
  beforeEach(module('slidesGeneratorApp'));

  var DragItemCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DragItemCtrl = $controller('DragItemCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
