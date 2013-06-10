'use strict';

describe('Directive: rec', function () {
  beforeEach(module('slidesGeneratorApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<rec></rec>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the rec directive');
  }));
});
