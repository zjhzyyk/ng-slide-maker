'use strict';

angular.module('slidesGeneratorApp')
  .directive('finalComponent', ['slides', function (slides) {
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        // console.log("in final-component");
        var c = slides.getSlideById(scope.slide.index).components[scope.component.id];
      	if (scope.component.type==="textbox") {
      		element[0].innerHTML = scope.component.content;
      		scope.$watch("component.content", function(){
            element[0].innerHTML = scope.component.content;
          });
      	}
        angular.forEach(c.getStyle(), function(val, key){
          element.css(key, val);
        });
        scope.$watch(c.getStyle, function(newvalue){
          angular.forEach(newvalue, function(val, key){
            element.css(key, val);
          });
        }, true);
      }
    };
  }]);
