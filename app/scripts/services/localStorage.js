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
			storePresentation: function(slidesArr) {
				_set("presentation", JSON.stringify(slidesArr));
			},
			getPresentation: function(){
				return JSON.parse(_get("presentation"));
			}
		};
	}]);