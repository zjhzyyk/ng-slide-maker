'use strict';

angular.module('slidesGeneratorApp')
  .factory("canvas", ['localStorage', function(localStorage){
  	var canvas = {
      width: 0,
      height: 0,
      background:{
        // background: rgb(215, 215, 215);
        // background: -webkit-gradient(radial, 50% 50%, 0, 50% 50%, 500, from(rgb(240, 240, 240)), to(rgb(190, 190, 190)));
        background: "-webkit-radial-gradient(rgb(240, 240, 240), rgb(190, 190, 190))"
        // background:    -moz-radial-gradient(rgb(240, 240, 240), rgb(190, 190, 190));
        // background:     -ms-radial-gradient(rgb(240, 240, 240), rgb(190, 190, 190));
        // background:      -o-radial-gradient(rgb(240, 240, 240), rgb(190, 190, 190));
        // background:         radial-gradient(rgb(240, 240, 240), rgb(190, 190, 190));
      },
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