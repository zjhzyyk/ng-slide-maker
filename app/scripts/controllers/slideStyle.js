'use strict';

angular.module('slidesGeneratorApp')
	.controller("slideStyle", ['$scope', 'slideStyle', function($scope, slideStyle){
		$scope.slideStyle = false;
		$scope.openSlideStyle = function(){
			if ($scope.current!==$scope.canvas)
				$scope.slideStyle = true;
		};
		$scope.$on("openSlideStyle", $scope.openSlideStyle);
		$scope.closeSlideStyle = function(){
			$scope.slideStyle = false;
		};
		$scope.slideStyleOpts = {
			backdropFade: true,
      dialogFade:true
		};
		$scope.slideStyles = slideStyle.getSlideStyles();
		$scope.submitSlideStyle = function() {
			$scope.current.background = slideStyle.getCurrentStyle();
			$scope.closeSlideStyle();
		};
	}]);