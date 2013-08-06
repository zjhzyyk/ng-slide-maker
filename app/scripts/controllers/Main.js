'use strict';

angular.module('slidesGeneratorApp')
  .controller('MainCtrl', ['$scope', 'localStorage', 'slides', 'canvas', '$timeout', function ($scope, localStorage, slides, canvas, $timeout) {
    $scope.dragScale = true;
    
    $scope.$watch(slides.getAllSlides, function(newvalue){
      localStorage.storeSlide(newvalue);
      $scope.slides = newvalue;
      console.log(localStorage.getSlides());
    }, true);

    // $scope.$watch(canvas.storeItems, function(newvalue){
    //   localStorage.storeCanvas(newvalue);
    // }, true);

    $scope.slides = slides.getAllSlides();

    $scope.present = function(){
      // $scope.$digest();
      // $timeout(function (){
      $scope.$broadcast("present");
      // });
    };
    $scope.openSlideStyle = function(){
      $scope.$broadcast("openSlideStyle");
    };
    $scope.openAddImageModal = function(){
      $scope.$broadcast("openAddImageModal");
    };
    $scope.clearSlides = function(){
      slides.clearSlides();
      $scope.$broadcast("canvas-init");
    };
    // $scope.$on("show-toolbar", function(){
    //   $scope.$broadcast("show-toolbar");
    // });
    // $scope.$on("hide-toolbar", function(){
    //   $scope.$broadcast("hide-toolbar");
    // });
  }]);
