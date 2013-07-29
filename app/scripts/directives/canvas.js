'use strict';

angular.module('slidesGeneratorApp')
  .directive('canvas', ['$document', '$window', 'canvas', 'slides', function ($document, $window, canvas, slides) {
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
        // scope.canvas.width = $window.innerWidth-element.offset().left;
        // scope.canvas.height = $window.innerHeight-element.offset().top;
        canvas.setCanvasWidth($window.innerWidth-element.offset().left);
        canvas.setCanvasHeight($window.innerHeight-element.offset().top);
        // var ox = scope.canvas.width/2;
        // var oy = scope.canvas.height/2;
        var ox = canvas.getCanvasWidth()/2;
        var oy = canvas.getCanvasHeight()/2;
        var translate = "";
        element.children("#mainCanvas").css("-webkit-transform-origin", ox+'px '+oy+'px');
        var tx, ty;
        var outterTransform = function (){
          originstr = element.children("#mainCanvas").css("-webkit-transform-origin");
          originarr = originstr.split(" ");
          // scope.origin.left = parseFloat(originarr[0]);
          // scope.origin.top = parseFloat(originarr[1]);
          var tleft = parseFloat(originarr[0]);
          var ttop = parseFloat(originarr[1]);
          if (slides.isCurrentSlide())
            currentSlide = $(".slide[id="+slides.getCurrentSlide().index+"]");
          else
            currentSlide = null;
          if (currentSlide!==null) {
            node = element.find(".recli[id="+slides.getCurrentSlide().index+"]");
            node.css("-webkit-transition", "all 0.5s linear");
            position.left = tleft-(tleft-slides.getCurrentSlide().x)*canvas.getCanvasScale()+tx*canvas.getCanvasScale();
            position.top = ttop-(ttop-slides.getCurrentSlide().y)*canvas.getCanvasScale()+ty*canvas.getCanvasScale();
            newwidth = slides.getCurrentSlide().width*canvas.getCanvasScale();
            newheight = slides.getCurrentSlide().height*canvas.getCanvasScale();
            slides.getCurrentSlide().style = {
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
          ofx = off.left+canvas.getCanvasLeft();
          ofy = off.top+canvas.getCanvasTop();
          ox = canvas.getCanvasWidth()/2 + ofx;
          oy = canvas.getCanvasHeight()/2+ofy;
          cx = x;
          cy = y;
          off = $("#mainCanvas").offset();
          cfx = off.left;
          cfy = off.top;
          var scale = canvas.getCanvasScale();
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
          // scope.mainx = parseFloat(element.children("#mainCanvas").css("left"));
          // scope.mainy = parseFloat(element.children("#mainCanvas").css("top"));
          canvas.setCanvasLeft(parseFloat(element.children("#mainCanvas").css("left")));
          canvas.setCanvasTop(parseFloat(element.children("#mainCanvas").css("top")));
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
          zoomToPoint(1, off.left+canvas.getCanvasWidth()/2, off.top+canvas.getCanvasHeight()/2);
        }
        function zoomoutDefault(){
          console.log("zoomout clicked");
          off = element.offset();
          zoomToPoint(-1, off.left+canvas.getCanvasWidth()/2, off.top+canvas.getCanvasHeight()/2);
        }
        function zoomin(event, change) {
          $("#zoomin").unbind("click", zoominDefault);
          element[0].onmousewheel = function(){};
          
          if (change===undefined || change===true || change===null)
            canvas.setCanvasScale(canvas.getCanvasScale()*ratio);
          outterTransform();
          var transform = "scale(" + canvas.getCanvasScale() + ") "+ translate;
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
          // scope.canvas.scale /= ratio;
          canvas.setCanvasScale(canvas.getCanvasScale()/ratio);
          outterTransform();
          var transform = "scale(" + canvas.getCanvasScale() + ") "+translate;
          element.children("#mainCanvas").css("-webkit-transform", transform);
          element.children("#mainCanvas").css("-moz-transform", transform);
          $("#mainCanvas").bind("transitionend", endOfZoomOut);
        }
        function endOfZoomOut() {
          $("#zoomout").bind("click", zoomoutDefault);
          element[0].onmousewheel = mousewheel;
          $("#mainCanvas").unbind("transitionend", endOfZoomOut);
        }
        scope.$watch('canvas.getCanvasBackground()', function(newvalue){
          element.children("#backcolor").css("background-color", newvalue);
        });
        scope.$watch('canvas.getCanvasLeft()', function(newvalue){
          // console.log("in watch f");
          $('#slideFrames').css("left", newvalue+'px');
          $('#frames').css("left", newvalue+'px');
        });
        scope.$watch('canvas.getCanvasTop()', function(newvalue){
          $('#slideFrames').css("top", newvalue+'px');
          $('#frames').css("top", newvalue+'px');
        });
        function moveto(i){
          if (i<0) return;
          console.log("in moveto "+i);
          off = element.offset();
          ofx = off.left+canvas.getCanvasLeft();
          ofy = off.top+canvas.getCanvasTop();
          ox = canvas.getCanvasWidth()/2 + ofx;
          oy = canvas.getCanvasHeight()/2 + ofy;
          var wr = 0.85;
          var hr = 0.85;
          var reserve = 40;
          var r1 = canvas.getCanvasWidth() * wr / parseFloat(slides.getSlideById(i).style.width);
          var r2 = (canvas.getCanvasHeight()-reserve) * hr / parseFloat(slides.getSlideById(i).style.height);
          var r = Math.min(r1,r2);
          canvas.getCanvas().scale *= r;
          var scale = canvas.getCanvasScale();
          afx = scale*(ofx-ox)+ox;
          afy = scale*(ofy-oy)+oy;
          ffx = off.left + (canvas.getCanvasWidth()-r*parseFloat(slides.getSlideById(i).style.width))/2;
          ffy = off.top + (canvas.getCanvasHeight()-reserve-r*parseFloat(slides.getSlideById(i).style.height))/2 + reserve;
          ffx -= slides.getCurrentSlide().x * scale;
          ffy -= slides.getCurrentSlide().y * scale;
          tx = (ffx-afx)/scale;
          ty = (ffy-afy)/scale;
          translate = "translate("+tx.toFixed(10)+"px,"+ty.toFixed(10)+"px)";
          zoomin(null, false);
        }
        function moveToCurrent(){
          moveto(slides.getCurrentSlide().index);
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
