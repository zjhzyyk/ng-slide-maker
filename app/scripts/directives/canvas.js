'use strict';

angular.module('slidesGeneratorApp')
  .directive('canvas', ['$document', function ($document) {
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        var ratio = 1.5;
        var currentSlide=null;
        var position = {
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
        var newwidth=0;
        var newheight=0;
        var outterTransform = function (){
          originstr = element.children("#mainCanvas").css("-webkit-transform-origin");
          originarr = originstr.split(" ");
          scope.origin.left = parseFloat(originarr[0]);
          scope.origin.top = parseFloat(originarr[1]);
          // console.log(origin);
          if (scope.current!==scope.canvas)
            currentSlide = $(".slide[id="+scope.current.index+"]");
          else
            currentSlide = null;
          if (currentSlide!==null) {
            node = element.find(".recli[id="+scope.current.index+"]");
            node.css("-webkit-transition", "all 0.5s linear");
            position.left = scope.origin.left-(scope.origin.left-scope.current.x)*scope.canvas.scale;
            position.top = scope.origin.top-(scope.origin.top-scope.current.y)*scope.canvas.scale;
            newwidth = scope.current.width*scope.canvas.scale;
            newheight = scope.current.height*scope.canvas.scale;
            //kindly pseudo double-binding
            scope.current.style = {
              left: position.left+'px',
              top: position.top+'px',
              width: newwidth+'px',
              height: newheight+'px'
            };
            // console.log(scope.current.style);
            $("body").scope().$digest();
            node.bind("transitionend", removeTransition);
          }
        }
        // scope.canvas.width = element[0].clientWidth;
        // scope.canvas.height = element[0].clientHeight;
        scope.canvas.width = element.innerWidth();
        scope.canvas.height = element.innerHeight();
        element.bind("mousewheel", function(){
          console.log("mousewheel");
        });
        element.bind("mousedown", function(event){
          console.log("mousedown captured in canvas.js");
          element.children("#mainCanvas").trigger("mousedown");
          scope.dragScale = false;
          $document.bind('mousemove', mousemove);
          $document.bind('mouseup', mouseup);
        });
        function mousemove(event){
          // console.log("mousemove in canvas.js");
          event.preventDefault();
          event.stopPropagation();
          scope.mainx = parseFloat(element.children("#mainCanvas").css("left"));
          scope.mainy = parseFloat(element.children("#mainCanvas").css("top"));
          // console.log("cx:"+scope.mainx);
          // console.log("cy:"+scope.mainy);
          $("body").scope().$digest();
        }
        function mouseup(event){
          event.preventDefault();
          event.stopPropagation();
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
          scope.dragScale = true;
        }
        element.parent().children("input#zoomin").bind("click", function(){
          console.log("zoomin clicked");
          scope.canvas.scale *= ratio;
          outterTransform();
          var transform = "scale(" + scope.canvas.scale + ")";
          element.children("#mainCanvas").css("-webkit-transform", transform);
          element.children("#mainCanvas").css("-moz-transform", transform);
        });
        element.parent().children("input#zoomout").bind("click", function(){
          console.log("zoomout clicked");
          scope.canvas.scale /= ratio;
          outterTransform();
          var transform = "scale(" + scope.canvas.scale + ")";
          element.children("#mainCanvas").css("-webkit-transform", transform);
          element.children("#mainCanvas").css("-moz-transform", transform);
        });
        scope.$watch('canvas.background', function(){
          element.children("#backcolor").css("background-color", scope.canvas.background);
        });
        scope.$watch('mainx', function(){
          // console.log("in watch f");
          $('#slideFrames').css("left", scope.mainx+'px');
        });
        scope.$watch('mainy', function(){
          $('#slideFrames').css("top", scope.mainy+'px');
        })
      }
    };
  }]);
