'use strict';

angular.module('slidesGeneratorApp')
  .directive('rec', ['$document', 'canvas', function ($document, canvas) {
    var ix, iy, ci, i, prex, prey, left, top, width, height;
    var coef = [
    {x:-1, y:-1},
    {x:1, y:-1},
    {x:-1, y:1},
    {x:1, y:1}
    ];
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        element.children().each(function(index){
          $(this).mousedown(function(event){
            event.preventDefault();
            event.stopPropagation();
            prex = event.screenX;
            prey = event.screenY;
            ci = index;
            // scope.dragScale = false;
            $document.bind('mousemove', mousemove);
            $document.bind('mouseup', mouseup);
          });
        });
        function mousemove(event){
          event.preventDefault();
          event.stopPropagation();

          left = parseFloat(scope.slide.style.left);
          top = parseFloat(scope.slide.style.top);

          scope.slide.x = scope.slide.x-(event.screenX-prex)*coef[ci].x/coef[3].x/canvas.getCanvasScale();
          scope.slide.y = scope.slide.y-(event.screenY-prey)*coef[ci].y/coef[3].y/canvas.getCanvasScale();

          left -= (event.screenX-prex)*coef[ci].x/coef[3].x;
          top -= (event.screenY-prey)*coef[ci].y/coef[3].y;
          scope.slide.style.left = left+'px';
          scope.slide.style.top = top+'px';
          width = scope.slide.width;
          height = scope.slide.height;
          // console.log("pre wid:"+width+" pre hei:"+height);
          width += 2*coef[ci].x*(event.screenX-prex)/canvas.getCanvasScale();
          height += 2*coef[ci].y*(event.screenY-prey)/canvas.getCanvasScale();
          scope.slide.style.width = width*canvas.getCanvasScale()+'px';
          scope.slide.style.height = height*canvas.getCanvasScale()+'px';
          scope.slide.width = width;
          scope.slide.height = height;
          // console.log("post wid:"+scope.slide.style.width+" pre hei:"+scope.slide.style.height);
          prex = event.screenX;
          prey = event.screenY;
          $("body").scope().$digest();
        }
        function mouseup(event){
          event.preventDefault();
          event.stopPropagation();
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
          // scope.dragScale = true;
        }
      }
    };
  }]);
