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
      this.width = 400;
      this.height = 300;
      this.components = [];
      this.style={};
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
  }]);
