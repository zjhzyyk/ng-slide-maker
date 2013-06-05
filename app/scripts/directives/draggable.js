'use strict';

angular.module('slidesGeneratorApp')
  .directive('draggable', ['$document', function ($document) {
    var prex=0, prey=0, x = 0, y = 0;
		return function(scope, element, attr) {
			element.css({
				cursor: 'pointer'
			});
			element.bind('mousedown', function(event) {
				console.log("mousedown");
				event.preventDefault();
        event.stopPropagation();
				// prex = event.screenX-parseFloat(element.css("left"));
				// prey = event.screenY-parseFloat(element.css("top"));
				prex = event.screenX;
				prey = event.screenY;
				$document.bind('mousemove', mousemove);
				$document.bind('mouseup', mouseup);
			});
			function mousemove(event) {
				console.log("mousemove");
				// y = (event.screenY - top)*scope.canvas.scale;
				// x = (event.screenX - left)*scope.canvas.scale;
				x = parseFloat(element.css("left")) + (event.screenX-prex)/scope.canvas.scale;
				y = parseFloat(element.css("top")) + (event.screenY-prey)/scope.canvas.scale;
				prex = event.screenX;
				prey = event.screenY;
				scope.slide.x = x;
				scope.slide.y = y;
				scope.slide.style = {
					left: x+'px',
					top: y+'px'
				};
				$("body").scope().$digest();
				element.css({
				top: y+'px',
				left: x+'px'
				});
				// element.css("top", y+"px");
				// element.css("left", x+"px");
				// element.css("margin", "5px");
				// element.css("margin", "0");
			}
			function mouseup() {
				$document.unbind('mousemove', mousemove);
				$document.unbind('mouseup', mouseup);
			}
		}
  }]);
