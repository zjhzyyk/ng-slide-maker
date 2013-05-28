'use strict';

angular.module('slidesGeneratorApp')
  .controller('InsertBtnCtrl', ['$scope', function ($scope) {
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

	    	}
	    }
	  ];
  }]);
