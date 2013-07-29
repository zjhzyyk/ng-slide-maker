'use strict';

angular.module('slidesGeneratorApp')
	.controller("addImageModal", ['$scope', 'slides', function($scope, slides){
		$scope.addImageModal = false;
    $scope.openAddImageModal = function(){
      $scope.imageURL = "";
      $scope.addImageModal = true;
    };
    $scope.closeAddImageModal = function () {
      $scope.addImageModal = false;
    };
    $scope.addImageModalOpts = {
      backdropFade: true,
      dialogFade:true
    };
    $scope.imageURL="";
    $scope.submitAddImageModal = function(){
      slides.getCurrentSlide().addImage($scope.imageURL, $("#img-preview")[0].naturalWidth, $("#img-preview")[0].naturalHeight);
      // $scope.current.addImage($scope.imageURL, $("#img-preview")[0].naturalWidth, $("#img-preview")[0].naturalHeight);
      $scope.closeAddImageModal();
    };
    $scope.$on("openAddImageModal", $scope.openAddImageModal);
	}]);