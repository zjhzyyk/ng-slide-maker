'use strict';

angular.module('slidesGeneratorApp')
  .factory("slides", [function(){
  	function Component(opt){
      for (var prop in opt) {
        if (opt.hasOwnProperty(prop)) {
          this[prop] = opt[prop];
        }
      }
    }
    Component.prototype.getStyle = function(){
      return {
        left: this.x+'px',
        top: this.y+'px',
        width: this.width+'px',
        height: this.height+'px'
      };
    };

    function Slide(title, i, selected){
      this.title = title || "";
      this.index = i || 0;
      this.selected = selected || false;
      this.x = 0;
      this.y = 0;
      this.vx = 0;
      this.vy = 0;
      this.width = 600;
      this.height = 450;
      this.textnum = 0;
      this.imgnum = 0;
      this.components = [];
      this.style={};
      this.toolbar = "slide"+this.index+"toolbar";
      // this.current = null;
      this.background = "";
    }
    Slide.prototype.addTextBox = function (cx,cy){
      console.log("add textbox in slide "+this.index);
      cx = cx || 0;
      cy = cy || 0;
      // console.log("cx", cx, "cy", cy);
      this.components.push(new Component({
        type: "textbox",
        id : this.textnum,
        content: "",
        x: cx || 0,
        y: cy || 0,
        width: 210,
        height: 20,
        frameStyle: {
          left: (cx*$scope.canvas.scale)+"px",
          top: (cy*$scope.canvas.scale)+"px",
          width: 0,
          height: 0,
          display: "none"
        },
        textid: ""
      }));
      // this.current = this.components[this.components.length-1];
      this.textnum++;
    };
    Slide.prototype.addImage = function(url, w, h) {
      console.log("add image in slide "+this.index);
      this.imgnum++;
      var that = this;
      this.components.push(new Component({
        type: "image",
        content: url,
        x: (that.width-w)/2,
        y: (that.height-h)/2,
        width: w,
        height: h,
        frameStyle: {
          left: ((that.width-w)/2*$scope.canvas.scale)+"px",
          top: ((that.height-h)/2*$scope.canvas.scale)+"px",
          width: 0,
          height: 0,
          display: "block"
        }
      }));
    };
    Slide.prototype.getPosStyle = function () {
      return {
        left: this.style.left,
        top: this.style.top
      };
    };
    Slide.prototype.getStyle = function (){
      return {
        left: this.x + 'px',
        top: this.y + 'px',
        width: this.width,
        height: this.height
      };
    };

  	var slides = [];
    var currentSlideId = -1;
  	return {
      slideNum: function(){
        return slides.length;
      },
      getCurrentSlide: function(){
        return (currentSlideId<0 || currentSlideId>=slideNum()) ? null : slides[currentSlideId];
      },
      addSlide: function(){
        var snum = slideNum();
        var slide = new Slide("", snum);
        if ()
    //   $scope.current.selected = false;
    //   $scope.current = slide;
    //   $scope.current.selected = true;

    //   slide.x = snum==0 ? calcCenterCood(slide).x : 
    //     $scope.slides[snum-1].x + $scope.slides[snum-1].width + defaultSlideMargin;
    //   slide.y = snum==0 ? calcCenterCood(slide).y : $scope.slides[snum-1].y;
    //   var left;
    //   var top;
    //   slide.style = {
    //     left: 0,
    //     top: 0,
    //     width: slide.width*$scope.canvas.scale + "px",
    //     height: slide.height*$scope.canvas.scale + "px"
    //   };
    //   $scope.slides.push(slide);
      }
  	};
  }]);
