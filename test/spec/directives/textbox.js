'use strict';

describe('Directive: textbox', function () {
  beforeEach(module('slidesGeneratorApp'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<textbox></textbox>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the textbox directive');
  }));
});
