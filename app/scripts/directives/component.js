'use strict';

angular.module('slidesGeneratorApp')
  .directive('component', ['slides', 'canvas', '$compile', '$document', function (slides, canvas, $compile, $document) {
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        // console.log(scope.component.type);
        var text, editor, prev, textid, iframe, body, resizeLeft, resizeRight, c;
        c = slides.getSlideById(scope.slide.index).components[scope.component.id];
        if (scope.component.type==="textbox") {
          scope.$emit("unselect-all-text");
          textid = "slide"+scope.slide.index+"text"+scope.component.tid;
        	text = $compile("<div ui-tinymce ng-model='tinymceModel'></div>")(scope);
        	element.append(text);
          resizeLeft = $("<i class='icon-resize-horizontal' id='resize-left'></i>");
          resizeRight = $("<i class='icon-resize-horizontal' id='resize-right'></i>");
          element.append(resizeLeft);
          element.append(resizeRight);
          var coef1, coef2, prex;
          var resizeMousemove = function (e){
            e.preventDefault();
            e.stopPropagation();
            c.x += coef1 * (e.screenX-prex) / canvas.getCanvasScale();
            c.width += coef2 * (e.screenX-prex) / canvas.getCanvasScale();
            element[0].style.left = c.x + 'px';
            element[0].style.width = c.width + 'px';
            prex = e.screenX;
          };
          var resizeMouseup = function(e){
            e.preventDefault();
            e.stopPropagation();
            $document.unbind('mousemove', resizeMousemove);
            $document.unbind('mouseup', resizeMouseup);
          };
          var resizeMousedown = function (e){
            e.preventDefault();
            e.stopPropagation();
            if ($(this).attr("id")==="resize-left") {
              coef1 = 1;
              coef2 = -1;
            }
            else {
              coef1 = 0;
              coef2 = 1;
            }
            prex = e.screenX;
            c.x = parseFloat(element.css("left"));
            c.width = parseFloat(element.css("width"));
            $document.bind('mousemove', resizeMousemove);
            $document.bind('mouseup', resizeMouseup);
          };
          resizeLeft.mousedown(resizeMousedown);
          resizeRight.mousedown(resizeMousedown);
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
          scope.$watch("component.x", function(){
            element[0].style.left = scope.component.x+'px';
          });
          scope.$watch("component.y", function(){
            element[0].style.top = scope.component.y+'px';
          });
        }
        element[0].style.left = scope.component.x+'px';
        element[0].style.top = scope.component.y+'px';
      }
    };
  }]);
