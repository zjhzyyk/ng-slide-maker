'use strict';

angular.module('slidesGeneratorApp')
  .directive('textFrame', ['$document', function ($document) {
    return {
      restrict: 'C',
      terminal: true,
      link: function postLink(scope, element, attrs) {
        var prex = 0, prey = 0, ci = 0;
        var coef = [
        {x:-1, y:-1},
        {x:1, y:-1},
        {x:-1, y:1},
        {x:1, y:1}
        ];
        var coef2 = [
        {x:1, y:1},
        {x:0, y:1},
        {x:1, y:0},
        {x:0, y:0}
        ];
        element.mousedown(function(event){
          console.log("mousedown on textFrame"); 
          event.preventDefault();
          event.stopPropagation();
          prex = event.clientX;
          prey = event.clientY;
          $document.bind('mousemove', mousemove);
          $document.bind('mouseup', mouseup);
        });
        element.children().each(function(index){
          $(this).mousedown(function(event){
            event.preventDefault();
            event.stopPropagation();
            prex = event.screenX;
            prey = event.screenY;
            ci = index;
            $document.bind('mousemove', cmousemove);
            $document.bind('mouseup', cmouseup);
          });
        });
        function mousemove(event) {
          event.preventDefault();
          event.stopPropagation();
          scope.component.x = scope.component.x + (event.clientX-prex)/scope.canvas.scale;
          scope.component.y = scope.component.y + (event.clientY-prey)/scope.canvas.scale;
          scope.component.frameStyle.left = (parseFloat(scope.component.frameStyle.left)+event.clientX-prex)+'px';
          scope.component.frameStyle.top = (parseFloat(scope.component.frameStyle.top)+event.clientY-prey)+'px';
          prex = event.clientX;
          prey = event.clientY;
          $("body").scope().$digest();
        }
        function mouseup(event) {
          event.preventDefault();
          event.stopPropagation();
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
        }
        function cmouseup(event){
          event.preventDefault();
          event.stopPropagation();
          $document.unbind('mousemove', cmousemove);
          $document.unbind('mouseup', cmouseup);
        }
        function cmousemove(event){
          event.preventDefault();
          event.stopPropagation();
          // console.log("old width", scope.component.width);
          // console.log("old frame width", scope.component.frameStyle.width);
          scope.component.x += (event.screenX-prex)*coef2[ci].x/scope.canvas.scale;
          scope.component.y += (event.screenY-prey)*coef2[ci].y/scope.canvas.scale;
          scope.component.frameStyle.left = (parseFloat(scope.component.frameStyle.left)+(event.screenX-prex)*coef2[ci].x)+'px';
          scope.component.frameStyle.top = (parseFloat(scope.component.frameStyle.top)+(event.screenY-prey)*coef2[ci].y)+'px';
          scope.component.width += (event.screenX-prex)*coef[ci].x/coef[3].x/scope.canvas.scale;
          scope.component.height += (event.screenY-prey)*coef[ci].y/coef[3].y/scope.canvas.scale;
          // scope.component.frameStyle.width = (scope.component.width*scope.canvas.scale)+'px';
          // console.log("scale", scope.canvas.scale);
          // console.log("new width", scope.component.width);
          // console.log("new frame width", scope.component.frameStyle.width);
          // scope.component.frameStyle.height = (scope.component.height*scope.canvas.scale)+'px';
          prex = event.screenX;
          prey = event.screenY;
          $("body").scope().$digest();
        }
        element.dblclick(function(){
          scope.component.frameStyle.display = "none";
          $("body").scope().$digest();
          $(scope.component.editor.composer.iframe).contents().find('body').focus();
          $(scope.component.editor.composer.iframe).css("width", scope.component.width+'px');
        });
        scope.$on("unselect-textbox", function(){
          scope.component.frameStyle.display = "none";
          $("body").scope().$$phase || $("body").scope().$digest();
          $(scope.component.editor.composer.iframe).css("width", scope.component.width+'px');
        });
      }
    };
  }]);
