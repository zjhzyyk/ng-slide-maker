'use strict';

angular.module('slidesGeneratorApp')
  .controller('InsertBtnCtrl', ['$scope', function ($scope) {
    $scope.items = [
	    "frame",
	    "textbox"
	  ];
	  $scope.click = function(event, item) {
	  };
  }]);
