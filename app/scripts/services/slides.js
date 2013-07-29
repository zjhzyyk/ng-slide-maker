'use strict';

angular.module('slidesGeneratorApp')
  .factory("slides", ['canvas', function(canvas){
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
          left: (cx*canvas.getCanvasScale())+"px",
          top: (cy*canvas.getCanvasScale())+"px",
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
          left: ((that.width-w)/2*canvas.getCanvasScale())+"px",
          top: ((that.height-h)/2*canvas.getCanvasScale())+"px",
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

    var cs = canvas.getCanvas();

    var calcCenterCood = function(item){
      return {
        x:cs.width/2.0-item.width/2.0-cs.left,
        y:cs.height/2.0-item.height/2.0-cs.top
      };
    };

  	var slides = [];
    var currentSlideId = -1;
    var defaultSlideMargin = 30;

  	return {
      slideNum: function(){
        return slides.length;
      },
      isCurrentSlide: function() {
        return (currentSlideId<0 || currentSlideId>=this.slideNum()) ? false : true;
      },
      getCurrentSlide: function(){
        return this.isCurrentSlide() ? slides[currentSlideId] : null;
      },
      getCurrentSlideId: function(){
        return currentSlideId;
      },
      setCurrentSlideId: function(id) {
        currentSlideId = id;
      },
      addSlide: function(){
        var snum = this.slideNum();
        var slide = new Slide("", snum);
        slide.x = snum===0 ? calcCenterCood(slide).x : 
          slides[snum-1].x + slides[snum-1].width + defaultSlideMargin;
        slide.y = snum===0 ? calcCenterCood(slide).y : slides[snum-1].y;
        slide.style = {
          left: 0,
          top: 0,
          width: slide.width*cs.scale + "px",
          height: slide.height*cs.scale + "px"
        };
        if (currentSlideId!==-1 && currentSlideId<snum) {
          this.getCurrentSlide().selected = false;
        }
        currentSlideId = snum;
        slide.selected = true;
        slides.push(slide);
      },
      getAllSlides: function(){
        return slides;
      },
      getSlideById: function(id) {
        return slides[id];
      }
  	};
  }]);
