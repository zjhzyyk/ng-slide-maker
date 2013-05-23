'use strict';

angular.module('slidesGeneratorApp')
  .factory('insertItem', [function() {
    return {
      visible: false,
      type: "frame",
      width: "80px",
      height: "60px",
      startx: 0,
      starty: 0
    };
  }]);
