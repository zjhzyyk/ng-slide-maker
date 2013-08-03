'use strict';

angular.module('slidesGeneratorApp', ['ui.bootstrap', 'ui.tinymce'])
	.run(['slides', '$rootScope', '$timeout', 'canvas', function (slides, $rootScope, $timeout, canvas) {
		slides.getSlidesFromLocal();
		// canvas.getStoredCanvas();
		if (slides.slideNum()<1) {
			slides.addSlide();
		}
		slides.setCurrentSlideId(0);
		console.log("finish run method");

		$timeout(function(){
			$rootScope.$broadcast("onOpen");
			$rootScope.$broadcast("newSlide");
		});
	}]);
