'use strict';

angular.module('slidesGeneratorApp')
  .directive('canvas', [function () {
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        var ratio = 1.5;
        var currentSlide=null;
        var position = {
          left: 0,
          top: 0
        };
        var origin = {
          left: 0,
          top: 0
        };
        var node;
        var originstr="";
        var originarr=[];
        var removeTransition = function (){
          node.css("-webkit-transition", "");
          node.unbind("transitionend", removeTransition);
        };
        // scope.canvas.width = element[0].clientWidth;
        // scope.canvas.height = element[0].clientHeight;
        scope.canvas.width = element.innerWidth();
        scope.canvas.height = element.innerHeight();
        element.bind("mousewheel", function(){
          console.log("mousewheel");
        });
        element.parent().children("input#zoomin").bind("click", function(){
          console.log("zoomin clicked");
          scope.canvas.scale *= ratio;
          originstr = element.css("-webkit-transform-origin");
          originarr = originstr.split(" ");
          origin.left = parseFloat(originarr[0]);
          origin.top = parseFloat(originarr[1]);
          console.log(origin);
          if (scope.current!==scope.canvas)
            currentSlide = $(".slide[id="+scope.current.index+"]");
          else
            currentSlide = null;
          if (currentSlide!==null) {
            node = element.find(".recli[id="+scope.current.index+"]");
            node.css("-webkit-transition", "all 0.5s linear");
            position.left = origin.left-(origin.left-scope.current.x)*scope.canvas.scale;
            position.top = origin.top-(origin.top-scope.current.y)*scope.canvas.scale;
            //kindly pseudo double-binding
            scope.current.style = {
              left: position.left+'px',
              top: position.top+'px'
            };
            // console.log(scope.current.style);
            $("body").scope().$digest();
            node.bind("transitionend", removeTransition);
          }
          var transform = "scale(" + scope.canvas.scale + ")";
          element.children("#mainCanvas").css("-webkit-transform", transform);
          element.children("#mainCanvas").css("-moz-transform", transform);
        });
        element.parent().children("input#zoomout").bind("click", function(){
          console.log("zoomout clicked");
          scope.canvas.scale /= ratio;
          var transform = "scale(" + scope.canvas.scale + ")";
          element.children("#mainCanvas").css("-webkit-transform", transform);
          element.children("#mainCanvas").css("-moz-transform", transform);
        });
        scope.$watch('canvas.background', function(){
          element.children("#backcolor").css("background-color", scope.canvas.background);
        });
      }
    };
  }]);
