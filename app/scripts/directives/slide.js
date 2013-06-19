'use strict';

angular.module('slidesGeneratorApp')
  .directive('slide', ['$document', function ($document) {
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        var index = scope.slide.index;
        element.css({
        	left : scope.slide.x + "px",
        	top: scope.slide.y + "px",
        	width: scope.slide.width + "px",
        	height: scope.slide.height + "px",
        	border: "1px solid black"
        });
        element.bind("click", function(event){
          //show selected effect
          console.log("click on slide "+index);
          // console.log(scope);
          event.preventDefault();
          event.stopPropagation();
          select();
        });
        element.mousedown(function(event){
          console.log("select slide "+index);
          event.preventDefault();
          event.stopPropagation();
          select();
          $document.bind('mousemove', mousemove);
          $document.bind('mouseup', mouseup);
        });
        var offset = element.offset();
        function select(){
          $("body").scope().current.selected = false;
          $("body").scope().current = scope.slides[index];
          $("body").scope().current.selected = true;
          offset = element.offset();
          var x = offset.left-$("#slideFrames").offset().left;
          var y = offset.top-$("#slideFrames").offset().top;
          scope.slide.style.left = x+'px';
          scope.slide.style.top = y+'px';
          scope.slide.style.width = scope.slide.width*scope.canvas.scale;
          scope.slide.style.height = scope.slide.height*scope.canvas.scale;
          $("body").scope().$digest();
        }
        function mousemove(event){
          // console.log("moving slide "+index);
          event.preventDefault();
          event.stopPropagation();
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
            width: scope.slide.width*scope.canvas.scale + "px",
            height: scope.slide.height*scope.canvas.scale + "px"
          };
          $("body").scope().$digest();
        }
        function mouseup(event){
          event.preventDefault();
          event.stopPropagation();
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
        var left = offset.left-$("#slideFrames").offset().left;
        var top = offset.top-$("#slideFrames").offset().top;
        scope.slide.style.left = left+'px';
        scope.slide.style.top = top+'px';
        function f(){scope.$emit("newSlide");}
        setTimeout(f, 0);
      }
    };
  }]);
