'use strict';

angular.module('slidesGeneratorApp')
  .factory("canvas", [function(){
  	var canvas = {
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
  	return {

  	};
  }]);