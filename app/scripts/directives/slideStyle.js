'use strict';

angular.module('slidesGeneratorApp')
	.directive("slideStyle", ['slideStyle', function(slideStyle){
		return {
			restrict: "C",
			link: function postLink(scope, element, attrs) {
				var style = $(scope.style.template);
				style[0].style.width = "100px";
				style[0].style.height = "100px";
				element.append(style);
				var cid = slideStyle.getCurrentStyleId();
				if (cid === scope.$index) {
					element.children()[0].style.boxShadow = "0 0 0 4px black";
				}
				element.click(function(){
					cid = slideStyle.getCurrentStyleId();
					if (cid !== scope.$index) {
						element.parent().children("#style"+cid).children()[0].style.boxShadow = "none";
						slideStyle.setCurrentStyleId(scope.$index);
						element.children()[0].style.boxShadow = "0 0 0 4px black";
					}
				});
			}
		};
	}]);