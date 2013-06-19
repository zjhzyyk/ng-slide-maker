'use strict';

angular.module('slidesGeneratorApp')
  .directive('textbox', [function () {
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        var prev = scope.current.getLastTextBox();
        if (prev===null) {
        	//put element in the middle of the slide
        	
        }
      }
    };
  }]);
