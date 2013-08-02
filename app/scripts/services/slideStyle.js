'use strict';

angular.module('slidesGeneratorApp')
	.factory("slideStyle", [function(){
		var slideStyles = [
		//type could be html, svg, img
		{type:"html", template: "<div style='background-color: white; border: 1px solid rgba(0, 0, 0, .3); border-radius: 10px; box-shadow: 0 2px 6px rgba(0, 0, 0, .1);'></div>"},
		{type:"html", template: "<div style='border-radius: 5px; background-color: blue;'></div>"},
		{type:"html", template: "<div style='border-radius: 5px; background-color: yellow;'></div>"},
		{type:"html", template: "<div style='border-radius: 5px; background-color: yellow;'></div>"},
		{type:"html", template: "<div style='border-radius: 5px; background-color: yellow;'></div>"},
		{type:"html", template: "<div style='border-radius: 5px; background-color: yellow;'></div>"}
		];
		var currentStyleId = 0;
		return {
			getSlideStyles: function() {
				return slideStyles;
			},
			getCurrentStyleId: function(){
				return currentStyleId;
			},
			setCurrentStyleId: function(id) {
				currentStyleId = id;
			},
			getCurrentStyle: function(){
				return slideStyles[currentStyleId].template;
			}
		};
	}]);