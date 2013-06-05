'use strict';

describe('Directive: canvas', function () {
  beforeEach(module('slidesGeneratorApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<canvas></canvas>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the canvas directive');
  }));
});
