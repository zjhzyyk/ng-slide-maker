'use strict';

angular.module('slidesGeneratorApp')
  .controller('MainCtrl', ['$scope', 'localStorage', 'slides', 'canvas', '$timeout', function ($scope, localStorage, slides, canvas, $timeout) {
    $scope.dragScale = true;
    
    $scope.$watch(slides.getAllSlides, function(newvalue){
      localStorage.storeSlide(newvalue);
      $scope.slides = newvalue;
      // console.log(localStorage.getSlides());
    }, true);

    // $scope.$watch(canvas.storeItems, function(newvalue){
    //   localStorage.storeCanvas(newvalue);
    // }, true);

    $scope.slides = slides.getAllSlides();
    $scope.lock = true;

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
      tinymce.remove();
      $scope.$broadcast("canvas-init");
    };
    // $scope.$on("show-toolbar", function(){
    //   $scope.$broadcast("show-toolbar");
    // });
    // $scope.$on("hide-toolbar", function(){
    //   $scope.$broadcast("hide-toolbar");
    // });
    $scope.lockCanvas = function(){
      var lockBtn = $("button#lock").children();
      if (lockBtn.hasClass("icon-lock")) {
        $scope.lock = false;
      }
      else
        $scope.lock = true;
      lockBtn.toggleClass("icon-lock icon-unlock");
    };
    $scope.toggleDelBtn = function() {
      // e.stopPropagation();
      $(".delete-btn").toggle();
    };
    $scope.$on("unselect-all-text", function(){
      var ednum = tinymce.editors.length;
      var IDLE_MODE = 2;
      for (var ei = 0; ei<ednum; ei++) {
        document.getElementById(tinymce.editors[ei].id).style.border = "none";
        $("#"+tinymce.editors[ei].id).parent().children(".icon-resize-horizontal").hide();
        tinymce.editors[ei].state = IDLE_MODE;
      }
    });
  }]);
