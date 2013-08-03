'use strict';

angular.module('slidesGeneratorApp')
  .directive('component', ['slides', 'canvas', '$compile', function (slides, canvas, $compile) {
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        // console.log(scope.component.type);
        var text, editor, prev, textid, iframe, body;
        if (scope.component.type==="textbox") {
          scope.$emit("unselect-all-text");
          textid = "slide"+scope.slide.index+"text"+scope.component.id;
        	text = $compile("<div ui-tinymce ng-model='tinymceModel'></div>")(scope);
        	element.append(text);
          element.mousedown(function(event){
            event.stopPropagation();
            event.preventDefault();
            console.log("mousedown on text");
          })
          scope.$watch("component.width", function(){
          });
          scope.$watch("component.height", function(){
          });
        }
        else if (scope.component.type==="image") {
          element.append($("<img src='"+scope.component.content+"'>"));
          scope.component.frameStyle.width = (element[0].offsetWidth * canvas.getCanvasScale())+'px';
          scope.component.frameStyle.height = (element[0].offsetHeight * canvas.getCanvasScale())+'px';
          scope.$watch("component.width", function(){
            element[0].firstChild.style.width = scope.component.width+'px';
            scope.component.frameStyle.width = (scope.component.width * canvas.getCanvasScale())+'px';
          });
          scope.$watch("component.height", function(){
            element[0].firstChild.style.height = scope.component.height+'px';
            scope.component.frameStyle.height = (scope.component.height * canvas.getCanvasScale())+'px';
          });
          element.mousedown(function(event){
            event.preventDefault();
            event.stopPropagation();
            console.log("mousedown on component");
            // $("body").scope().current.selected = false;
            slides.getCurrentSlide().selected = false;
            scope.component.frameStyle.display = "block";
            $("body").scope().$digest();
          });
        }
        element[0].style.left = scope.component.x+'px';
        element[0].style.top = scope.component.y+'px';
        scope.$watch("component.x", function(){
          element[0].style.left = scope.component.x+'px';
        });
        scope.$watch("component.y", function(){
          element[0].style.top = scope.component.y+'px';
        });
      }
    };
  }]);
