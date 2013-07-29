'use strict';

angular.module('slidesGeneratorApp')
	.controller("slideStyle", ['$scope', 'slideStyle', 'slides', function($scope, slideStyle, slides){
		$scope.slideStyle = false;
		$scope.openSlideStyle = function(){
			// if ($scope.current!==$scope.canvas)
			if (slides.isCurrentSlide())
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
			// $scope.current.background = slideStyle.getCurrentStyle();
			slides.getCurrentSlide().background = slideStyle.getCurrentStyle();
			$scope.closeSlideStyle();
		};
	}]);