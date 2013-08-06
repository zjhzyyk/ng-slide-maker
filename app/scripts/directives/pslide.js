'use strict';

angular.module('slidesGeneratorApp')
	.directive("pslide", ['slides', function(slides){
		return {
			restrict: "C",
			link: function postlink(scope, element,attrs) {
				var s = slides.getSlideById(scope.slide.index);
				angular.forEach(s.getStyle(), function(val, key){
					element.css(key, val);
				});
				scope.$watch(s.getStyle, function(newvalue){
					angular.forEach(newvalue, function(val, key){
						element.css(key, val);
					});
				}, true);
			}
		};
	}]);