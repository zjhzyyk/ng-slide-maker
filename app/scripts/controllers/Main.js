'use strict';

angular.module('slidesGeneratorApp')
  .controller('MainCtrl', ['$scope', 'localStorage', 'slides', function ($scope, localStorage, slides) {
    $scope.dragScale = true;
    
    $scope.$watch(slides.getAllSlides, function(newvalue){
      localStorage.storePresentation(newvalue);
      // console.log(localStorage.getPresentation());
    }, true);

    $scope.slides = slides.getAllSlides();

    $scope.present = function(){
      $scope.$broadcast("present");
    };
    $scope.openSlideStyle = function(){
      $scope.$broadcast("openSlideStyle");
    };
    $scope.openAddImageModal = function(){
      $scope.$broadcast("openAddImageModal");
    };
  }]);
