'use strict';

angular.module('slidesGeneratorApp')
  .directive('finalComponent', [function () {
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        console.log("in final-component");
      	if (scope.component.type==="textbox") {
      		element[0].innerHTML = scope.component.content;
      		scope.$watch("component.content", function(){
            element[0].innerHTML = scope.component.content;
          });
      	}
      }
    };
  }]);
