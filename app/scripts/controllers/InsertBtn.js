'use strict';

angular.module('slidesGeneratorApp')
  .controller('InsertBtnCtrl', ['$scope', 'slides', function ($scope, slides) {
  	$scope.addTextBox = function(){
  		console.log("add textbox triggered");
  		// if ($scope.current!==$scope.canvas) {
			if (slides.isCurrentSlide()) {
  			// $scope.current.addTextBox();
  			slides.getCurrentSlide().addTextBox();
  		}
  		else 
  			console.log("no slide selected");
  	};
  	$scope.addImage = function(){
  		if (slides.isCurrentSlide()) {
  			$scope.openAddImageModal();
  		}
  		else 
  			console.log("no slide selected");
  	};
    $scope.items = [
	    {
	    	name:"slide",
	    	click:function(){
	    		slides.addSlide();
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
