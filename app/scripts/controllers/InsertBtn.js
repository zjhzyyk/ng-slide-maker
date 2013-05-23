'use strict';

angular.module('slidesGeneratorApp')
  .controller('InsertBtnCtrl', ['$scope', 'insertItem', function ($scope, insertItem) {
    $scope.items = [
	    "frame",
	    "textbox"
	  ];
	  $scope.click = function(event, item) {
	  	insertItem.visible = true;
	  	insertItem.startx = event.screenX;
	  	insertItem.starty = event.screenY;
	  	insertItem.type = item;
	  	console.log(insertItem);
	  };
  }]);
