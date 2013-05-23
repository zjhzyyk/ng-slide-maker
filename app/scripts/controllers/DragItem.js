'use strict';

angular.module('slidesGeneratorApp')
  .controller('DragItemCtrl', ['$scope', 'insertItem', function ($scope, insertItem) {
  	$scope.visible = insertItem.visible;
  }]);
