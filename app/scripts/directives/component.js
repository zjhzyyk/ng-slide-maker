'use strict';

angular.module('slidesGeneratorApp')
  .directive('component', function () {
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        // console.log(scope.component.type);
        var child, editor, prev, textid, iframe, body;
        if (scope.component.type==="textbox") {
          scope.$emit("unselect-all-text");
          textid = "slide"+scope.slide.index+"text"+scope.component.id;
        	child = $("<textarea id="+textid+" placeholder='input here...' autofocus rows='1'></textarea>");
          // console.log(child);
        	child.appendTo(element);

          // scope.component.frameStyle.width = '150px';
          // scope.component.frameStyle.height = child.height()+'px';
          // console.log("ifr w", child.width(), "ifr h", child.height());

        	editor = new wysihtml5.Editor(textid, { // id of textarea element
          toolbar:      "slide"+scope.slide.index+"toolbar", // id of toolbar element
          parserRules:  wysihtml5ParserRules, // defined in parser rules set 
          stylesheets:  "components/wysihtml5/examples/css/stylesheet.css"
        	});
          element[0].style.left = scope.component.x+'px';
          element[0].style.top = scope.component.y+'px';
          scope.component.editor = editor;
          iframe = $(editor.composer.iframe);
          body = iframe.contents().find('body');
          editor.on('load', function() {
            // iframe.wysihtml5_size_matters();
            // iframe[0].style.width = "0";
            
            body.css('overflow', 'hidden');
            // body.css('min-width', 0);
            body.css('min-height', 0);
            // var adjustWidth = function () {
              // iframe.css('min-width', body[0].scrollWidth);
            // };
            var adjustHeight = function() {
              iframe.css('min-height', body.height());
            };
            body.on('keyup keydown paste change', function(event) {
              // if (event.keyCode === 13 || event.keyCode === 8) adjustHeight();
              // iframe.css('min-width', 0);
              // adjustWidth();
              adjustHeight();

              // scope.component.frameStyle.width = (iframe[0].offsetWidth * scope.canvas.scale)+'px';
              scope.component.frameStyle.height = (iframe[0].offsetHeight * scope.canvas.scale)+'px';

              $("body").scope().$digest();
            });

            body.on('focus', function(){
              scope.$emit("unselect-all-text");
            });

            adjustHeight();

            scope.component.frameStyle.width = (iframe[0].offsetWidth * scope.canvas.scale)+'px';
            scope.component.frameStyle.height = (iframe[0].offsetHeight * scope.canvas.scale)+'px';

            // $("body").scope().$digest();
            body.dblclick(function(event){
              event.preventDefault();
              event.stopPropagation();
              body.blur();
              iframe[0].style.width = scope.component.width+'px';
              scope.component.frameStyle.display = "block";
              $("body").scope().$digest();
              // element.dblclick();
            });
          });
          editor.on('change', function(){
            console.log("content change: ", body[0].innerHTML);
            scope.component.content = body[0].innerHTML;
            $("body").scope().$digest();
          });
          // element.dblclick(function() {
          //   scope.component.frameStyle.display = "block";
          //   $("body").scope().$digest();
          // });
          scope.$watch("component.x", function(){
            element[0].style.left = scope.component.x+'px';
          });
          scope.$watch("component.y", function(){
            element[0].style.top = scope.component.y+'px';
          });
          scope.$watch("component.width", function(){
            // console.log("prev width", iframe[0].style.width, "new width", scope.component.width);
            iframe[0].style.minWidth = scope.component.width+'px';
            iframe[0].style.width = scope.component.width+'px';
            scope.component.frameStyle.width = (iframe[0].offsetWidth * scope.canvas.scale)+'px';
          });
          scope.$watch("component.height", function(){
            iframe[0].style.minHeight = scope.component.height+'px';
            scope.component.frameStyle.height = (iframe[0].offsetHeight * scope.canvas.scale)+'px';
          });
        }
      }
    };
  });
