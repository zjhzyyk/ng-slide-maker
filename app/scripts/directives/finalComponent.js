'use strict';

angular.module('slidesGeneratorApp')
  .directive('finalComponent', ['slides', function (slides) {
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        // console.log("in final-component");
        scope.c = slides.getSlideById(scope.slide.index).components[scope.component.id];
      	if (scope.component.type==="textbox") {
      		element[0].innerHTML = scope.component.content;
      		scope.$watch("c.content", function(){
            element[0].innerHTML = scope.c.content;
          });
      	}
        else if (scope.component.type==="image") {
          element[0].innerHTML = "<img src="+scope.c.content+">";
        }
        angular.forEach(scope.c.getStyle(), function(val, key){
          element.css(key, val);
        });
        scope.$watch(scope.c.getStyle, function(newvalue){
          angular.forEach(newvalue, function(val, key){
            element.css(key, val);
          });
        }, true);
      }
    };
  }]);
