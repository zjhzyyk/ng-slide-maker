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
        var empty = function(){};
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
        var mainCanvas = element.children("#mainCanvas");
        // element.children("#mainCanvas").css("-webkit-transform-origin", ox+'px '+oy+'px');
        var tx, ty;
        var background = canvas.getCanvasBackground();
        var bgprop;
        var bgELem = element[0].children[0];
        for (bgprop in background) {
          if (background.hasOwnProperty(bgprop)) {
            bgELem.style[bgprop] = background[bgprop];
          }
        }

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
            $("body").scope().$$phase || $("body").scope().$digest();
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
          tx = (ffx-ofx)/scale;
          ty = (ffy-ofy)/scale;
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
        element.find("#zoomin").bind("mousedown", zoominDefault);
        element.find("#zoomout").bind("mousedown", zoomoutDefault);
        function zoominDefault(event) {
          event.preventDefault();
          event.stopPropagation();
          console.log("zoomin clicked");
          off = element.offset();
          zoomToPoint(1, off.left+canvas.getCanvasWidth()/2, off.top+canvas.getCanvasHeight()/2);
        }
        function zoomoutDefault(event){
          event.preventDefault();
          event.stopPropagation();
          console.log("zoomout clicked");
          off = element.offset();
          zoomToPoint(-1, off.left+canvas.getCanvasWidth()/2, off.top+canvas.getCanvasHeight()/2);
        }
        function zoomin(event, change) {
          $("#zoomin").unbind("mousedown", zoominDefault);
          element[0].onmousewheel = function(){};
          // scope.$broadcast("hide-toolbar");
          if (change===undefined || change===true || change===null)
            canvas.setCanvasScale(canvas.getCanvasScale()*ratio);
          outterTransform();
          var transform = "scale(" + canvas.getCanvasScale() + ") "+ translate;
          // console.log(transform);
          document.getElementById("mainCanvas").style.webkitTransform = transform;
          $("#mainCanvas").bind("transitionend", endOfZoomIn);
        }
        function endOfZoomIn() {
          $("#zoomin").bind("mousedown", zoominDefault);
          element[0].onmousewheel = mousewheel;
          scope.$broadcast("zoomend");
          $("#mainCanvas").unbind("transitionend", endOfZoomIn);
        }
        function zoomout(){
          $("#zoomout").unbind("mousedown", zoomoutDefault);
          element[0].onmousewheel = function(){};
          // scope.$broadcast("hide-toolbar");
          console.log("zoomout mousedown");
          // scope.canvas.scale /= ratio;
          canvas.setCanvasScale(canvas.getCanvasScale()/ratio);
          outterTransform();
          var transform = "scale(" + canvas.getCanvasScale() + ") "+translate;
          element.children("#mainCanvas").css("-webkit-transform", transform);
          element.children("#mainCanvas").css("-moz-transform", transform);
          $("#mainCanvas").bind("transitionend", endOfZoomOut);
        }
        function endOfZoomOut() {
          $("#zoomout").bind("mousedown", zoomoutDefault);
          element[0].onmousewheel = mousewheel;
          $("#mainCanvas").unbind("transitionend", endOfZoomOut);
        }
        scope.$watch(canvas.getCanvasBackground, function(newvalue){
          bgELem.style = {
            width: '100%',
            height: '100%',
            display: 'none',
            position: 'absolute'
          };
          for (bgprop in background) {
            if (background.hasOwnProperty(bgprop)) {
              bgELem.style[bgprop] = background[bgprop];
            }
          }
        });
        scope.$watch(canvas.getCanvasLeft, function(newvalue){
          // console.log("in watch f");
          $('#slideFrames').css("left", newvalue+'px');
          $('#frames').css("left", newvalue+'px');
        });
        scope.$watch(canvas.getCanvasTop, function(newvalue){
          $('#slideFrames').css("top", newvalue+'px');
          $('#frames').css("top", newvalue+'px');
        });
        function moveto(i){
          if (i<0) return;
          console.log("in moveto "+i);
          off = element.offset();
          ox = off.left + canvas.getCanvasLeft();
          oy = off.top + canvas.getCanvasTop();
          // ofx = canvas.getCanvasScale()*canvas.getCanvasWidth()/2 + ofx;
          // ofy = canvas.getCanvasScale()*canvas.getCanvasHeight()/2 + ofy;
          var wr = 0.85;
          var hr = 0.85;
          var reserve = 0;
          var scale = canvas.getCanvasScale();
          var r1 = canvas.getCanvasWidth() * wr / slides.getSlideById(i).width / scale;
          var r2 = (canvas.getCanvasHeight()-reserve) * hr / slides.getSlideById(i).height / scale;
          var r = Math.min(r1,r2);
          canvas.getCanvas().scale *= r;
          scale = canvas.getCanvasScale();
          // afx = scale*(ofx-ox)+ox;
          // afy = scale*(ofy-oy)+oy;
          ffx = off.left+(canvas.getCanvasWidth()-scale*slides.getSlideById(i).width)/2;
          ffy = off.top+(canvas.getCanvasHeight()-reserve-scale*slides.getSlideById(i).height)/2 + reserve;
          console.log("scale", scale);
          // console.log("slide actual x", ffx, "slide actual y", ffy);
          $("#test #sa").css({left: ffx+'px', top: ffy+'px'});
          ffx -= slides.getSlideById(i).x * scale;
          ffy -= slides.getSlideById(i).y * scale;
          // console.log("maincanvas actual x", ffx, "maincanvas actual y", ffy);
          $("#test #ca").css({left: ffx+'px', top: ffy+'px'});
          tx = (ffx-ox)/scale;
          ty = (ffy-oy)/scale;
          translate = "translate("+tx.toFixed(10)+"px,"+ty.toFixed(10)+"px)";
          zoomin(null, false);
        }
        function moveToCurrent(){
          moveto(slides.getCurrentSlide().index);
        }
        scope.$on("newSlide", function(){
          var afterZoom = function(){
            // console.log("in afterZoom");
            // var toolbar = $("#toolbar");
            // toolbar[0].style.left = (parseFloat(slides.getCurrentSlide().style.left) + 70)+'px';
            // toolbar[0].style.top = (parseFloat(slides.getCurrentSlide().style.top) - 55) + 'px';
            // toolbar.show();
            unbindZoomend();
          };
          var unbindZoomend = scope.$on("zoomend", afterZoom);
          moveToCurrent();
        });
        scope.$on("unselect-all-text", function(){
          scope.$broadcast("unselect-textbox");
        });
        scope.$on("unselect-all-image", function(){
          scope.$broadcast("unselect-image");
        });
        scope.$on("present", function(){
          // $("body").scope().$digest();
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
            $('#main')[0].innerHTML+
            "  </body>"+
            "</html>";
            present.presentation();
          };
        });
        scope.$on("moveto", function(e, id){
          moveto(id);
        });
        scope.$on("canvas-init", function(e){
          // e.stopPropagation();
          e.preventDefault();
          mainCanvas.css("-webkit-transition", "none");
          mainCanvas.css("-webkit-transform", "none");
          mainCanvas.css("-webkit-transition", "-webkit-transform 0.5s linear");
          mainCanvas.css("top", 0);
          mainCanvas.css("left", 0);
          canvas.init();
        });
        // if (slides.isCurrentSlide()) {
        //   moveToCurrent();
        // }
      }
    };
  }]);
