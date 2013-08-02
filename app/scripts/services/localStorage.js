'use strict';

angular.module('slidesGeneratorApp')
	.factory("localStorage", [function(){
		var db = localStorage;
		var _set = function(key, value) {
			db.setItem(key, value);
		};
		var _get = function(key) {
			return db.getItem(key);
		};
		return {
			storeSlide: function(slides) {
				_set("slides", JSON.stringify(slides));
			},
			storeCanvas: function(canvas) {
				_set("canvas", JSON.stringify(canvas));
			},
			getSlides: function(){
				var result = _get("slides");
				if (result===null)
					return [];
				else
					return JSON.parse(result);
			},
			getCanvas: function(){
				var result = _get("canvas");
				if (result===null)
					return {scale: 1};
				else
					return JSON.parse(result);
			}
		};
	}]);