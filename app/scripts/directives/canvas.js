'use strict';

angular.module('slidesGeneratorApp')
  .directive('canvas', [function () {
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        var ratio = 1.5;
        // scope.canvas.width = element[0].clientWidth;
        // scope.canvas.height = element[0].clientHeight;
        scope.canvas.width = element.innerWidth();
        scope.canvas.height = element.innerHeight();
        // scope.canvas.left = parseFloat(element[0].style.left);
        // scope.canvas.top = parseFloat(element[0].style.top);
        // console.log("canvas left: "+scope.canvas.left);
        // console.log("canvas top: "+scope.canvas.top);
        element.bind("mousewheel", function(){
          console.log("mousewheel");
        });
        element.parent().children("input#zoomin").bind("click", function(){
          console.log("zoomin clicked");
          scope.canvas.scale *= ratio;
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
