'use strict';

angular.module('slidesGeneratorApp')
  .directive('canvas', ['$document', function ($document) {
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
          var fsoff = $(".slide[id=0]").offset();
          console.log("fsfx:"+fsoff.left+" fsfy:"+fsoff.top);
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
        // element.children("#mainCanvas").css("width", scope.canvas.width+'px');
        // element.children("#mainCanvas").css("height", scope.canvas.height+'px');
        // element.children("#mainCanvas").css("background-color", "yellow");
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
            // node.css("-webkit-transform", "translate("+(tx)+"px,"+(ty)+"px");
            position.left = scope.origin.left-(scope.origin.left-scope.current.x)*scope.canvas.scale+tx*scope.canvas.scale;
            position.top = scope.origin.top-(scope.origin.top-scope.current.y)*scope.canvas.scale+ty*scope.canvas.scale;
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
        var off;
        var ofx;
        var ofy;
        var cx,cy,cfx,cfy,ffx,ffy,afx,afy;
        element[0].onmousewheel = function(event){
          event.preventDefault();
          event.stopPropagation();
          console.log("mousewheel");
          off = element.offset();
          ofx = off.left+scope.mainx;
          ofy = off.top+scope.mainy;
          ox = scope.canvas.width/2 + ofx;
          oy = scope.canvas.height/2+ofy;
          cx = event.clientX;
          cy = event.clientY;
          // console.log(event);
          off = $("#mainCanvas").offset();
          cfx = off.left;
          cfy = off.top;

          var scale = scope.canvas.scale;
          if (event.wheelDelta>0) {
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
          console.log("cfx:"+cfx+" cfy:"+cfy);
          console.log("cx:"+cx+" cy:"+cy);
          console.log("ox:"+ox+" oy:"+oy);
          console.log("ofx:"+ofx+" ofy:"+ofy);
          console.log("afx:"+afx+" afy:"+afy);
          console.log("ffx:"+ffx+" ffy:"+ffy);
          var soff = $(".slide[id=0]").offset();
          console.log("osfx:"+soff.left+" osfy:"+soff.top);
          translate = "translate("+tx+"px,"+ty+"px)";
          if (event.wheelDelta > 0) zoomin();
          else zoomout();
        };
        element.bind("mousedown", function(event){
          console.log("mousedown captured in canvas.js");
          // $("body").scope().current.selected = false;
          // $("body").scope().current = scope.canvas;
          // $("body").scope().current.selected = true;
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
          zoomin();
        });
        element.parent().children("input#zoomout").bind("click", function(){
          zoomout();
        });
        function zoomin() {
          console.log("zoomin clicked");
          scope.canvas.scale *= ratio;
          outterTransform();
          var transform = "scale(" + scope.canvas.scale + ") "+ translate;
          element.children("#mainCanvas").css("-webkit-transform", transform);
          element.children("#mainCanvas").css("-moz-transform", transform);     
        };
        function zoomout(){
          console.log("zoomout clicked");
          scope.canvas.scale /= ratio;
          outterTransform();
          var transform = "scale(" + scope.canvas.scale + ") "+translate;
          element.children("#mainCanvas").css("-webkit-transform", transform);
          element.children("#mainCanvas").css("-moz-transform", transform);
        }
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
