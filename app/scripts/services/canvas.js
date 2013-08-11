'use strict';

angular.module('slidesGeneratorApp')
  .factory("canvas", ['localStorage', function(localStorage){
  	var canvas = {
      width: 0,
      height: 0,
      background: "theme-color-silver-blue",
      left: 0,
      top: 0,
      scale: 1
    };
  	return {
      getCanvas: function(){
        return canvas;
      },
      setCanvasWidth: function(w) {
        canvas.width = w;
      },
      setCanvasHeight: function(h) {
        canvas.height = h;
      },
      getCanvasWidth: function(){
        return canvas.width;
      },
      getCanvasHeight: function(){
        return canvas.height;
      },
      getCanvasScale: function(){
        return canvas.scale;
      },
      setCanvasScale: function(s) {
        canvas.scale = s;
      },
      getCanvasLeft: function(){
        return canvas.left;
      },
      getCanvasTop: function(){
        return canvas.top;
      },
      setCanvasLeft: function(l){
        canvas.left = l;
      },
      setCanvasTop: function(t){
        canvas.top = t;
      },
      getCanvasBackground: function(){
        return canvas.background;
      },
      init: function(){
        canvas.scale = 1;
        canvas.left = 0;
        canvas.top = 0;
      },
      storeItems: function(){
        return {
          scale: canvas.scale
        };
      },
      getStoredCanvas: function(){
        canvas.scale = localStorage.getCanvas().scale;
      }
  	};
  }]);