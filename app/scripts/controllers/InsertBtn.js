'use strict';

angular.module('slidesGeneratorApp')
  .controller('InsertBtnCtrl', ['$scope', function ($scope) {
  	$scope.addTextBox = function(){
  		console.log("add textbox triggered");
  		if ($scope.current!==$scope.canvas) {
  			$scope.current.addTextBox();
  		}
  		else 
  			console.log("no slide selected");
  	};
  	$scope.addImage = function(){
  		if ($scope.current!==$scope.canvas) {
  			$scope.current.addImage();
  		}
  		else 
  			console.log("no slide selected");
  	};
    $scope.items = [
	    {
	    	name:"slide",
	    	click:function(){
	    		$scope.$eval("addSlide()");
	    	}
	   	},
	    {
	    	name:"textbox",
	    	click:function(){
	    		$scope.$eval("addTextBox()");
	    	}
	    },
	    {
	    	name:"image",
	    	click: function(){
	    		$scope.$eval("addImage()");
	    	}
	    }
	  ];
  }]);
