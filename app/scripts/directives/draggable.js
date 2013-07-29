'use strict';

angular.module('slidesGeneratorApp')
  .directive('draggable', ['$document', 'canvas', function ($document, canvas) {
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
				// console.log("mousemove");
				event.preventDefault();
        event.stopPropagation();
				// y = (event.screenY - top)*scope.canvas.scale;
				// x = (event.screenX - left)*scope.canvas.scale;
				// console.log("eventx:"+event.screenX+" eventy:"+event.screenY);
				x = parseFloat(element.css("left"));
				y = parseFloat(element.css("top"));
				x = isNaN(x) ? 0 : x;
				y = isNaN(y) ? 0 : y;
				if (!scope.dragScale) {
					x += event.screenX-prex;
					y += event.screenY-prey;
				}
				else {
					x += (event.screenX-prex)/canvas.getCanvasScale();
					y += (event.screenY-prey)/canvas.getCanvasScale();
				}
				prex = event.screenX;
				prey = event.screenY;
				element.css({
				top: y+'px',
				left: x+'px'
				});
			}
			function mouseup(event) {
				event.preventDefault();
        event.stopPropagation();
				$document.unbind('mousemove', mousemove);
				$document.unbind('mouseup', mouseup);
			}
		}
  }]);
