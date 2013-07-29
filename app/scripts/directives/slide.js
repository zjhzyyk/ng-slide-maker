'use strict';

angular.module('slidesGeneratorApp')
  .directive('slide', ['$document', 'slides', 'canvas', function ($document, slides, canvas) {
    var move = false, movein = false;
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        var index = scope.slide.index;
        var offset;
        element.css({
        	left : scope.slide.x + "px",
        	top: scope.slide.y + "px",
        	width: scope.slide.width + "px",
        	height: scope.slide.height + "px",
        	border: "1px solid black"
        });
        // element.children(".toolbar").click(function(e){
        //   e.preventDefault();
        //   e.stopPropagation();
        // });
        var afterZoom = function(){
          console.log("in empty afterZoom");
        };
        var unbindZoomend;
        element.mousedown(function(event){
          console.log("select slide "+index);
          event.preventDefault();
          event.stopPropagation();
          move = false;
          // if ($("body").scope().current !== scope.slides[index]) {
          if (slides.getCurrentSlideId()!==index) {
            movein = true;
            select();
            afterZoom = function(){
              console.log("in afterZoom");
              // $("body").scope().current.selected = true;
              slides.getCurrentSlide().selected = true;
              $("body").scope().$digest();
              unbindZoomend();
            };
            unbindZoomend = scope.$on("zoomend", afterZoom);
            scope.$emit("moveto", index);
          }
          else if (slides.getCurrentSlide().selected===false) {
            movein = true;
            slides.getCurrentSlide().selected = true;
            $("body").scope().$digest();
            scope.$emit("unselect-all-text");
            scope.$emit("unselect-all-image");
          }
          $document.bind('mousemove', mousemove);
          $document.bind('mouseup', mouseup);
        });
        function select(mode){
          slides.getCurrentSlide().selected = false;
          // $("body").scope().current = scope.slides[index];
          slides.setCurrentSlideId(index);
          if (mode==="move") slides.getCurrentSlide().selected = true;
          offset = element.offset();
          var x = offset.left-$("#slideFrames").offset().left;
          var y = offset.top-$("#slideFrames").offset().top;
          scope.slide.style.left = x+'px';
          scope.slide.style.top = y+'px';
          scope.slide.style.width = scope.slide.width*canvas.getCanvasScale();
          scope.slide.style.height = scope.slide.height*canvas.getCanvasScale();
          $("body").scope().$digest();
        }
        function mousemove(event){
          // console.log("moving slide "+index);
          event.preventDefault();
          event.stopPropagation();
          move = true;
          var position = element.position();
          // console.log(position);
          var x = position.left;
          var y = position.top;
          scope.slide.x = parseFloat(element.css("left"));
          scope.slide.y = parseFloat(element.css("top"));
          // console.log("slide "+index+" new x:"+x+" y:"+y);
          offset = element.offset();
          x = offset.left-$("#slideFrames").offset().left;
          y = offset.top-$("#slideFrames").offset().top;
          scope.slide.style = {
            left: x+'px',
            top: y+'px',
            width: scope.slide.width*canvas.getCanvasScale() + "px",
            height: scope.slide.height*canvas.getCanvasScale() + "px"
          };
          $("body").scope().$digest();
        }
        function mouseup(event){
          event.preventDefault();
          event.stopPropagation();
          if (move===false && slides.getCurrentSlideId()===index && movein===false) {
            offset = element.offset();
            var x = (event.clientX-offset.left)/canvas.getCanvasScale();
            var y = (event.clientY-offset.top)/canvas.getCanvasScale();
            scope.slide.addTextBox(x, y);
            $("body").scope().$digest();
          }
          movein = false;
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
        }
        scope.$watch("slide.width", function(){
          element.css("width", scope.slide.width+'px');
        });
        scope.$watch("slide.height", function(){
          element.css("height", scope.slide.height+'px');
        });
        scope.$watch("slide.x", function(){
          element.css("left", scope.slide.x+'px');
        });
        scope.$watch("slide.y", function(){
          element.css("top", scope.slide.y+'px');
        });
        scope.$watch("slide.imgnum", function(newvalue, oldvalue){
          if (newvalue === oldvalue+1) {
            slides.getCurrentSlide().selected = false;
          }
        });
        scope.$watch("slide.background", function(newvalue){
          element.children(".slide-background").children().remove();
          element.children(".slide-background").append($(scope.slide.background));
        });
        offset = element.offset();
        var left = offset.left-$("#slideFrames").offset().left;
        var top = offset.top-$("#slideFrames").offset().top;
        scope.slide.style.left = left+'px';
        scope.slide.style.top = top+'px';
        function f(){scope.$emit("newSlide");}
        setTimeout(f, 0);
      }
    };
  }]);
