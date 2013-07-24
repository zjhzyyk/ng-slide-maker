'use strict';

describe('Directive: textFrame', function () {
  beforeEach(module('slidesGeneratorApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<text-frame></text-frame>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the textFrame directive');
  }));
});
