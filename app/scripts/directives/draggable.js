'use strict';

angular.module('slidesGeneratorApp')
  .directive('draggable', ['$document', 'insertItem', function ($document, insertItem) {
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
      	element.css({
					position: 'relative',
					cursor: 'pointer'
				});
				$document.bind('mousemove', mousemove);
				$document.bind('mousedown', mousedown);
				function mousemove(event) {
					var y = event.screenY - insertItem.startY;
					var x = event.screenX - insertItem.startX;
					element.css({
					top: y + 'px',
					left: x + 'px'
					});
				}
				function mousedown() {
					$document.unbind('mousemove', mousemove);
					$document.unbind('mousedown', mousedown);
				}
      }
    };
  }]);
