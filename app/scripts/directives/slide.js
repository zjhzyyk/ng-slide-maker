'use strict';

angular.module('slidesGeneratorApp')
  .directive('slide', ['$document', 'slides', 'canvas', '$timeout', function ($document, slides, canvas, $timeout) {
    var move = false, movein = false;
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        var index = scope.slide.index;
        var offset;
        // scope.slide.cselected = false;
        element.css({
        	left : scope.slide.x + "px",
        	top: scope.slide.y + "px",
        	width: scope.slide.width + "px",
        	height: scope.slide.height + "px"
        });
        // element.children(".toolbar").click(function(e){
        //   e.preventDefault();
        //   e.stopPropagation();
        // });
        // element.children(".slide-background").children().remove();
        // element.children(".slide-background").append($(slides.getSlideById(index).background));
        var afterZoom = function(){
          console.log("in empty afterZoom");
        };
        var isMoving = function(){
          return move;
        }
        var unbindZoomend;
        element.mousedown(function(event){
          console.log("mousedown on slide "+scope.slide.index);
          event.stopPropagation();
          $(".delete-btn").hide();
          element.focus();
          
          if (scope.lock===false) {
            move = false;
            $document.bind('mousemove', mousemove);
            $document.bind('mouseup', mouseup);
          }
        });
        function mousemove(event){
          // console.log("moving slide "+index);
          event.preventDefault();
          event.stopPropagation();
          move = true;
          var position = element.position();
          // console.log(position);
          var x = position.left;
          var y = position.top;
          scope.slide.x = parseFloat(element.css("left"));
          scope.slide.y = parseFloat(element.css("top"));
          offset = element.offset();
          x = offset.left-$("#slideFrames").offset().left;
          y = offset.top-$("#slideFrames").offset().top;
          scope.slide.style = {
            left: x+'px',
            top: y+'px',
            width: scope.slide.width*canvas.getCanvasScale() + "px",
            height: scope.slide.height*canvas.getCanvasScale() + "px"
          };
          $("body").scope().$digest();
        }
        function noComponentsSelected(){
          var slideNum = scope.slides.length, it, it2, ret = true;
          for (it = 0; it < slideNum; it++) {
            var cnum = scope.slides[it].components.length;
            for (it2 = 0; it2<cnum; it2++) {
              if (scope.slides[it].components[it2].frameStyle.display === "block") {
                ret = false;
                break;
              }
            }
            if (!ret) break;
          }
          if (ret) {
            var ednum = tinymce.editors.length;
            for (var ei = 0; ei<ednum; ei++) {
              if (tinymce.editors[ei].state === 0 || tinymce.editors[ei].state===1)
              {
                ret  = false;
                break;
              }
            }
          }
          return ret;
        }
        function mouseup(event){
          event.preventDefault();
          event.stopPropagation();
          movein = false;
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
        }
        element.mouseup(function(event){
          var cselected = noComponentsSelected();
          if (cselected===false) {
            scope.$emit("unselect-all-text");
            scope.$emit("unselect-all-image");
          }
          if ((slides.getCurrentSlideId()!==scope.slide.index || scope.fit === false) && move===false) {
            movein = true;
            slides.setCurrentSlideId(scope.slide.index);
            scope.$emit("moveto", scope.slide.index);
          }
          if (move===false && slides.getCurrentSlideId()===scope.slide.index && movein===false && cselected===true) {
            offset = element.offset();
            var x = (event.clientX-offset.left)/canvas.getCanvasScale();
            var y = (event.clientY-offset.top)/canvas.getCanvasScale();
            slides.getSlideById(scope.slide.index).addTextBox(x, y);
            $("body").scope().$digest();
          }
          movein = false;
        });
        element.children(".delete-btn").mousedown(function(e){
          e.stopPropagation();
          var s = slides.getSlideById(scope.slide.index);
          var cnum = s.components.length;
          for (var ci = 0; ci<cnum; ci++) {
            tinymce.remove("#"+s.components[ci].textid);
          }
          slides.removeSlide(scope.slide.index);
          scope.toggleDelBtn();
          if (slides.slideNum()===0)
            scope.clearSlides();
          // else
            // scope.$emit("moveto", scope.slide.index-1);
          $("body").scope().$digest();
        });
        scope.$watch("slide.width", function(){
          element.css("width", scope.slide.width+'px');
        });
        scope.$watch("slide.height", function(){
          element.css("height", scope.slide.height+'px');
        });
        scope.$watch("slide.x", function(){
          element.css("left", scope.slide.x+'px');
        });
        scope.$watch("slide.y", function(){
          element.css("top", scope.slide.y+'px');
        });
        // scope.$watch("slide.imgnum", function(newvalue, oldvalue){
        //   if (newvalue === oldvalue+1) {
        //     slides.getCurrentSlide().selected = false;
        //   }
        // });
        // scope.$watch(slides.getCurrentBackground, function(newvalue){
        //   element.children(".slide-background").children().remove();
        //   element.children(".slide-background").append($(newvalue));
        // });
        // scope.$watch(slides.getCurrentSlideId, function(newvalue){
        //   if (newvalue===index) {
        //     $("#"+scope.slide.toolbar)[0].style.display = "block";
        //   }
        // });
        // scope.$watch(isMoving, function(newvalue){
        //   // if (newvalue) {
        //     // $("#toolbar").hide();
        //   // }
        // });
        // scope.$on("onOpen", function(){
        //   if (index!==slides.getCurrentSlideId()) {
        //     // $("#"+scope.slide.toolbar)[0].style.display = "none"; 
        //     scope.slide.selected = false;
        //   }
        // });
        offset = element.offset();
        var left = offset.left-$("#slideFrames").offset().left;
        var top = offset.top-$("#slideFrames").offset().top;
        scope.slide.style.left = left+'px';
        scope.slide.style.top = top+'px';
        $timeout(function () {
          if (slides.isAddingNewSlide()) {
            scope.$emit('newSlide');
            slides.setNewSlideFlag(false);
          }
        });
      }
    };
  }]);
