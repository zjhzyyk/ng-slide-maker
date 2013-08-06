'use strict';

angular.module('slidesGeneratorApp')
  .factory("slides", ['canvas', 'localStorage', function(canvas, localStorage){
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
      this.cnum = 0;
      this.components = [];
      this.style={};
      this.toolbar = "slide"+this.index+"toolbar";
      // this.current = null;
      this.background = "<div style='background-color: white; border: 1px solid rgba(0, 0, 0, .3); border-radius: 10px; box-shadow: 0 2px 6px rgba(0, 0, 0, .1);'></div>";
    }
    Slide.prototype.addTextBox = function (cx,cy, w, h){
      console.log("add textbox in slide "+this.index);
      cx = cx || 0;
      cy = cy || 0;
      // console.log("cx", cx, "cy", cy);
      this.components.push(new Component({
        type: "textbox",
        tid : this.textnum,
        id: this.cnum,
        content: "",
        x: cx || 0,
        y: cy || 0,
        width: w || 210,
        height: h || 20,
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
      this.cnum++;
    };
    Slide.prototype.addImage = function(url, w, h) {
      console.log("add image in slide "+this.index);
      var that = this;
      this.components.push(new Component({
        type: "image",
        content: url,
        id: this.cnum,
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
      this.imgnum++;
      this.cnum++;
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
  	var slides = [];
    var currentSlideId = -1;
    var defaultSlideMargin = 30;
    var addingNewSlide = false;

    var calcCenterCood = function(item){
      return {
        x:cs.width/2.0-item.width/2.0-cs.left,
        y:cs.height/2.0-item.height/2.0-cs.top
      };
    };

    var slideNum = function(){
      return slides.length;
    };

    var isCurrentSlide = function(){
      return (currentSlideId<0 || currentSlideId>=slideNum()) ? false : true;
    };

    var getCurrentSlide = function(){
      return isCurrentSlide() ? slides[currentSlideId] : null;
    };

  	return {
      slideNum: slideNum,
      isCurrentSlide: isCurrentSlide,
      getCurrentSlide: getCurrentSlide,
      getCurrentSlideId: function(){
        return currentSlideId;
      },
      getCurrentBackground: function(){
        return (currentSlideId<0 || currentSlideId>=slideNum()) ? "" : slides[currentSlideId].background;
      },
      setCurrentSlideId: function(id) {
        currentSlideId = id;
      },
      addSlide: function(){
        addingNewSlide = true;
        var snum = slideNum();
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
          getCurrentSlide().selected = false;
        }
        currentSlideId = snum;
        // slide.selected = true;
        var textboxWidthRatio = 0.8;
        slide.addTextBox((1-textboxWidthRatio)/2*slide.width, 0.065*slide.height, textboxWidthRatio*slide.width);
        slide.addTextBox((1-textboxWidthRatio)/2*slide.width, 0.065*slide.height+40, textboxWidthRatio*slide.width);
        slides.push(slide);
      },
      getAllSlides: function(){
        return slides;
      },
      getSlideById: function(id) {
        return slides[id];
      },
      getSlidesFromLocal: function (){
        var arr = localStorage.getSlides();
        var len = arr.length;
        var i = 0, i2 = 0, j;
        for (i=0;i<len;i++) {
          arr[i].style.width = arr[i].width+'px';
          arr[i].style.height = arr[i].height+'px';
          arr[i].style.left = arr[i].x+'px';
          arr[i].style.top = arr[i].y+'px';
          i2 = arr[i].components.length;
          for (j=0; j<i2; j++) {
            arr[i].components[j] = angular.extend(new Component({}), arr[i].components[j]);
          }
          arr[i] = angular.extend(new Slide(), arr[i]);
        }
        slides = arr;
      },
      isAddingNewSlide: function(){
        return addingNewSlide;
      },
      setNewSlideFlag: function(flag) {
        addingNewSlide = flag;
      },
      clearSlides: function(){
        slides = [];
      }
  	};
  }]);
