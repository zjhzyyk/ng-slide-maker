'use strict';

describe('Directive: finalComponent', function () {
  beforeEach(module('slidesGeneratorApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<final-component></final-component>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the finalComponent directive');
  }));
});
