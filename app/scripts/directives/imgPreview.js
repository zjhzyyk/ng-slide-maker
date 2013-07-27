'use strict';

angular.module('slidesGeneratorApp')
  .directive('imgPreview', [function () {
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
      	scope.$watch("imageURL", function(value){
      		element[0].src = value;
      	});
        element[0].onerror = function(){
          var submit = $('#image-submit');
          $('#img-preview').css('display','none');
          submit.addClass('disabled'); 
          if (scope.imageURL==='') 
            submit.html('Please input'); 
          else 
            submit.html('Incorrect URL');
        };
        element[0].onload = function(){
          console.log("image loading finishes");
          $("#img-preview").css("display", "block");
          var submit = $("#image-submit");
          submit.removeClass("disabled");
          submit.html("Submit");
        }
      }
    };
  }]);