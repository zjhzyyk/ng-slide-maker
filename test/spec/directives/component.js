'use strict';

describe('Directive: component', function () {
  beforeEach(module('slidesGeneratorApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<component></component>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the component directive');
  }));
});
