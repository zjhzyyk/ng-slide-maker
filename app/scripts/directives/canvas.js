'use strict';

angular.module('slidesGeneratorApp')
  .directive('canvas', [function () {
    return {
      template: '<div></div>',
      restrict: 'C',
      replace: true,
      link: function postLink(scope, element, attrs) {
        element.text('this is the canvas directive');
        
      }
    };
  }]);
