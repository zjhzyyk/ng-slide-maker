'use strict';

angular.module('slidesGeneratorApp')
  .controller('MainCtrl', ['$scope', function ($scope) {
  	var defaultSlideMargin = 30;
  	var Slide = function (title, i, selected){
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
      this.components = [];
      this.style={};
      this.toolbar = "slide"+this.index+"toolbar";
      this.current = null;
    };
    var Component = function(opt){
      for (var prop in opt) {
        if (opt.hasOwnProperty(prop)) {
          this[prop] = opt[prop];
        }
      }
    };

    Component.prototype.getStyle = function(){
      return {
        left: this.x+'px',
        top: this.y+'px',
        width: this.width+'px',
        height: this.height+'px'
      };
    };
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
        editor: null
      }));
      this.current = this.components[this.components.length-1];
      this.textnum++;
    };
    Slide.prototype.getPosStyle = function () {
      return {
        left: this.style.left,
        top: this.style.top
      };
    };

    Slide.prototype.getStyle = function (){
      return {
        left: this.style.left,
        top: this.style.top,
        width: this.width,
        height: this.height
      };
    };

    var calcCenterCood = function(item){
    	return {
    		x:$scope.canvas.width/2.0-item.width/2.0,
    		y:$scope.canvas.height/2.0-item.height/2.0
    	};
    };

  	$scope.slides = [];
    $scope.sideMenu = {
      title: "canvas",
      item: $scope.canvas
    };
    $scope.canvas = {
      width: 0,
      height: 0,
      // left: 0,
      // top: 0
      background:"",
      selected: true,
      mx: 0,
      my: 0,
      scale: 1
    };
    $scope.current = $scope.canvas;
    $scope.mainx = 0;
    $scope.mainy = 0;
    $scope.dragScale = true;
    $scope.origin = {
      left:0,
      top:0
    };

    $scope.addSlide = function() {
      var snum = $scope.slideNum();
      var slide = new Slide("", snum);
      $scope.current.selected = false;
      $scope.current = slide;
      $scope.current.selected = true;

      slide.x = snum==0 ? calcCenterCood(slide).x : 
        $scope.slides[snum-1].x + $scope.slides[snum-1].width + defaultSlideMargin;
      slide.y = snum==0 ? calcCenterCood(slide).y : $scope.slides[snum-1].y;
      var left;
      var top;
      slide.style = {
        left: 0,
        top: 0,
        width: slide.width*$scope.canvas.scale + "px",
        height: slide.height*$scope.canvas.scale + "px"
      };
      $scope.slides.push(slide);
    };
    $scope.slideNum = function(){
      return $scope.slides.length;
    };
    $scope.present = function(){
      $scope.$broadcast("present");
    }
  }]);
