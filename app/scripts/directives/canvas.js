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
        canvas.setCanvasWidth($window.innerWidth-element.offset().left);
        canvas.setCanvasHeight($window.innerHeight-element.offset().top);
        var ox = canvas.getCanvasWidth()/2;
        var oy = canvas.getCanvasHeight()/2;
        var translate = "";
        var mainCanvas = element.children("#mainCanvas");
        // element.children("#mainCanvas").css("-webkit-transform-origin", ox+'px '+oy+'px');
        var tx, ty;
        var background = canvas.getCanvasBackground();
        // var bgprop;
        var bgELem = element.children(":first-child");
        // bgELem.removeClass();
        // bgELem.addClass(background);
        element.removeClass();
        element.addClass(background+" canvas");
        // for (bgprop in background) {
        //   if (background.hasOwnProperty(bgprop)) {
        //     bgELem.style[bgprop] = background[bgprop];
        //   }
        // }
        scope.fit = false;
        var outterTransform = function (){
          originstr = element.children("#mainCanvas").css("-webkit-transform-origin");
          originarr = originstr.split(" ");
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
          scope.fit = false;
          zoomToPoint(event.wheelDelta, event.clientX, event.clientY);
        }
        function zoomToPoint(d,x,y) {
          scope.$emit("unselect-all-textbox");
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
          // console.log("lock", scope.lock);
          if (scope.lock===false) {
            element.children("#mainCanvas").trigger("mousedown");
            scope.dragScale = false;
            $document.bind('mousemove', mousemove);
            $document.bind('mouseup', mouseup);
          }
          $(".delete-btn").hide();
          scope.$emit("unselect-all-text");
          scope.$emit("unselect-all-image");
        });
        function mousemove(event){
          // console.log("mousemove in canvas.js");
          event.preventDefault();
          event.stopPropagation();
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
        element.find("#gohome").bind("mousedown", gohome);
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
          element.removeClass();
          element.addClass(newvalue + " canvas");
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
        function gohome(){
          var frame = slides.getMainFrame();
          scope.fit = false;
          if (frame.w===0 || frame.h===0) return;
          moveToRec(frame.x, frame.y, frame.w, frame.h);
        }
        function moveto(i){
          if (i<0) return;
          console.log("in moveto "+i);
          scope.fit = true;
          var si = slides.getSlideById(i);
          moveToRec(si.x, si.y, si.width, si.height);
        }
        function moveToRec(x,y,w,h){
          off = element.offset();
          ox = off.left + canvas.getCanvasLeft();
          oy = off.top + canvas.getCanvasTop();
          // ofx = canvas.getCanvasScale()*canvas.getCanvasWidth()/2 + ofx;
          // ofy = canvas.getCanvasScale()*canvas.getCanvasHeight()/2 + ofy;
          var wr = 0.85;
          var hr = 0.85;
          var reserve = 0;
          var scale = canvas.getCanvasScale();
          var r1 = canvas.getCanvasWidth() * wr / w / scale;
          var r2 = (canvas.getCanvasHeight()-reserve) * hr / h / scale;
          var r = Math.min(r1,r2);
          canvas.getCanvas().scale *= r;
          scale = canvas.getCanvasScale();
          // afx = scale*(ofx-ox)+ox;
          // afy = scale*(ofy-oy)+oy;
          ffx = off.left+(canvas.getCanvasWidth()-scale*w)/2;
          ffy = off.top+(canvas.getCanvasHeight()-reserve-scale*h)/2 + reserve;
          console.log("scale", scale);
          ffx -= x * scale;
          ffy -= y * scale;
          tx = (ffx-ox)/scale;
          ty = (ffy-oy)/scale;
          translate = "translate("+tx.toFixed(10)+"px,"+ty.toFixed(10)+"px)";
          zoomin(null, false);
        }
        function moveToCurrent(){
          moveto(slides.getCurrentSlide().index);
        }
        scope.$on("newSlide", function(){
          // var afterZoom = function(){
            // console.log("in afterZoom");
            // var toolbar = $("#toolbar");
            // toolbar[0].style.left = (parseFloat(slides.getCurrentSlide().style.left) + 70)+'px';
            // toolbar[0].style.top = (parseFloat(slides.getCurrentSlide().style.top) - 55) + 'px';
            // toolbar.show();
            // unbindZoomend();
          // };
          // var unbindZoomend = scope.$on("zoomend", afterZoom);
          moveToCurrent();
        });

        scope.$on("unselect-all-image", function(){
          // scope.$broadcast("unselect-image");
          var slideNum = scope.slides.length, it, it2;
          for (it = 0; it < slideNum; it++) {
            var cnum = scope.slides[it].components.length;
            for (it2 = 0; it2<cnum; it2++) {
              scope.slides[it].components[it2].frameStyle.display = "none";
            }
          }
          $("body").scope().$$phase || $("body").scope().$digest();
        });
        scope.$on("present", function(){
          // $("body").scope().$digest();
          var present = $window.open("presentation.html");
          present.onload = function(){
            (present.document.getElementsByTagName("body")[0]).innerHTML = $('#main')[0].innerHTML + 
            "<script type='text/javascript'>prezi.init();</script>";
            present.prezi.init();
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
      }
    };
  }]);
