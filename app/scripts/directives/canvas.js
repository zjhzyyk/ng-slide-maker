'use strict';

angular.module('slidesGeneratorApp')
  .directive('canvas', ['$document', '$window', function ($document, $window) {
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        var ratio = 1.2;
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
        scope.canvas.width = window.innerWidth-element.offset().left;
        scope.canvas.height = window.innerHeight-element.offset().top;
        var ox = scope.canvas.width/2;
        var oy = scope.canvas.height/2;
        var translate = "";
        element.children("#mainCanvas").css("-webkit-transform-origin", ox+'px '+oy+'px');
        var tx, ty;
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
            position.left = scope.origin.left-(scope.origin.left-scope.current.x)*scope.canvas.scale+tx*scope.canvas.scale;
            position.top = scope.origin.top-(scope.origin.top-scope.current.y)*scope.canvas.scale+ty*scope.canvas.scale;
            newwidth = scope.current.width*scope.canvas.scale;
            newheight = scope.current.height*scope.canvas.scale;
            scope.current.style = {
              left: position.left+'px',
              top: position.top+'px',
              width: newwidth+'px',
              height: newheight+'px'
            };
            $("body").scope().$digest();
            node.bind("transitionend", removeTransition);
          }
        }
        var off;
        var ofx;
        var ofy;
        var cx,cy,cfx,cfy,ffx,ffy,afx,afy;
        element[0].onmousewheel = mousewheel;
        function mousewheel(event){
          event.preventDefault();
          event.stopPropagation();
          console.log("mousewheel");
          zoomToPoint(event.wheelDelta, event.clientX, event.clientY);
        }
        function zoomToPoint(d,x,y) {
          scope.$broadcast("unselect-textbox");
          off = element.offset();
          ofx = off.left+scope.mainx;
          ofy = off.top+scope.mainy;
          ox = scope.canvas.width/2 + ofx;
          oy = scope.canvas.height/2+ofy;
          cx = x;
          cy = y;
          // console.log(event);
          off = $("#mainCanvas").offset();
          cfx = off.left;
          cfy = off.top;

          var scale = scope.canvas.scale;
          if (d>0) {
            scale *= ratio;
            ffx = ratio*(cfx-cx)+cx;
            ffy = ratio*(cfy-cy)+cy;
          }
          else {
            scale /= ratio;
            ffx = (cfx-cx)/ratio+cx;
            ffy = (cfy-cy)/ratio+cy;
          }
          afx = scale*(ofx-ox)+ox;
          afy = scale*(ofy-oy)+oy;
          tx = (ffx-afx)/scale;
          ty = (ffy-afy)/scale;
          translate = "translate("+tx.toFixed(10)+"px,"+ty.toFixed(10)+"px)";
          if (d > 0) zoomin();
          else zoomout();
        }
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
        element.parent().children("#zoomin").bind("click", zoominDefault);
        element.parent().children("#zoomout").bind("click", zoomoutDefault);
        function zoominDefault(event) {
          // event.preventDefault();
          // event.stopPropagation();
          console.log("zoomin clicked");
          off = element.offset();
          zoomToPoint(1, off.left+scope.canvas.width/2, off.top+scope.canvas.height/2);
        }
        function zoomoutDefault(){
          console.log("zoomout clicked");
          off = element.offset();
          zoomToPoint(-1, off.left+scope.canvas.width/2, off.top+scope.canvas.height/2);
        }
        function zoomin(event, change) {
          $("#zoomin").unbind("click", zoominDefault);
          element[0].onmousewheel = function(){};
          
          if (change===undefined || change===true || change===null) scope.canvas.scale *= ratio;
          outterTransform();
          var transform = "scale(" + scope.canvas.scale + ") "+ translate;
          // console.log(transform);
          document.getElementById("mainCanvas").style.webkitTransform = transform;
          $("#mainCanvas").bind("transitionend", endOfZoomIn);
        }
        function endOfZoomIn() {
          $("#zoomin").bind("click", zoominDefault);
          element[0].onmousewheel = mousewheel;
          scope.$broadcast("zoomend");
          $("#mainCanvas").unbind("transitionend", endOfZoomIn);
        }
        function zoomout(){
          $("#zoomout").unbind("click", zoomoutDefault);
          element[0].onmousewheel = function(){};
          console.log("zoomout clicked");
          scope.canvas.scale /= ratio;
          outterTransform();
          var transform = "scale(" + scope.canvas.scale + ") "+translate;
          element.children("#mainCanvas").css("-webkit-transform", transform);
          element.children("#mainCanvas").css("-moz-transform", transform);
          $("#mainCanvas").bind("transitionend", endOfZoomOut);
        }
        function endOfZoomOut() {
          $("#zoomout").bind("click", zoomoutDefault);
          element[0].onmousewheel = mousewheel;
          $("#mainCanvas").unbind("transitionend", endOfZoomOut);
        }
        scope.$watch('canvas.background', function(){
          element.children("#backcolor").css("background-color", scope.canvas.background);
        });
        scope.$watch('mainx', function(){
          // console.log("in watch f");
          $('#slideFrames').css("left", scope.mainx+'px');
          $('#frames').css("left", scope.mainx+'px');
        });
        scope.$watch('mainy', function(){
          $('#slideFrames').css("top", scope.mainy+'px');
          $('#frames').css("top", scope.mainy+'px');
        });
        function moveto(i){
          if (i<0) return;
          console.log("in moveto "+i);
          off = element.offset();
          ofx = off.left+scope.mainx;
          ofy = off.top+scope.mainy;
          ox = scope.canvas.width/2 + ofx;
          oy = scope.canvas.height/2+ofy;
          var wr = 0.85;
          var hr = 0.85;
          var reserve = 40;
          // console.log(scope);
          // console.log(i);
          var r1 = scope.canvas.width * wr / parseFloat(scope.slides[i].style.width);
          var r2 = (scope.canvas.height-reserve) * hr / parseFloat(scope.slides[i].style.height);
          var r = Math.min(r1,r2);
          scope.canvas.scale *= r;
          // console.log("r", r, "scale", scope.canvas.scale, "w", scope.canvas.width, "h", scope.canvas.height);
          afx = scope.canvas.scale*(ofx-ox)+ox;
          afy = scope.canvas.scale*(ofy-oy)+oy;
          ffx = off.left + (scope.canvas.width-r*parseFloat(scope.slides[i].style.width))/2;
          ffy = off.top + (scope.canvas.height-reserve-r*parseFloat(scope.slides[i].style.height))/2 + reserve;
          ffx -= scope.current.x * scope.canvas.scale;
          ffy -= scope.current.y * scope.canvas.scale;
          tx = (ffx-afx)/scope.canvas.scale;
          ty = (ffy-afy)/scope.canvas.scale;
          translate = "translate("+tx.toFixed(10)+"px,"+ty.toFixed(10)+"px)";
          zoomin(null, false);
        }
        function moveToCurrent(){
          moveto(scope.current.index);
        }
        scope.$on("newSlide", moveToCurrent);
        scope.$on("unselect-all-text", function(){
          scope.$broadcast("unselect-textbox");
        });
        scope.$on("unselect-all-image", function(){
          scope.$broadcast("unselect-image");
        });
        scope.$on("present", function(){
          var present = $window.open("index.html?presentation=true");
          present.onload = function(){
            (present.document.getElementsByTagName("html")[0]).innerHTML = 
            "<!doctype html>"+
            "<html>"+
            "  <head>"+
            "    <meta charset='utf-8'>"+
            "    <meta http-equiv='X-UA-Compatible' content='IE=edge,chrome=1'>"+
            "    <title>presentation</title>"+
            "    <meta name='description' content=''>"+
            "    <meta name='viewport' content='width=device-width'>"+
            "  </head>"+
            "  <body style='overflow:hidden;margin:0; padding:0;'>"+
            $('#presentation')[0].outerHTML+
            "  </body>"+
            "</html>";
            present.presentation();
          };
        });
        scope.$on("moveto", function(e, id){
          moveto(id);
        });
      }
    };
  }]);
