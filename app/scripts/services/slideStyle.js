'use strict';

angular.module('slidesGeneratorApp')
	.factory("slideStyle", [function(){
		var slideStyles = [
		//type could be html, svg, img
		{type:"html", template: "<div style='border-radius: 5px; background-color: blue;'></div>"},
		{type:"html", template: "<div style='border-radius: 5px; background-color: yellow;'></div>"},
		{type:"html", template: "<div style='border-radius: 5px; background-color: yellow;'></div>"},
		{type:"html", template: "<div style='border-radius: 5px; background-color: yellow;'></div>"},
		{type:"html", template: "<div style='border-radius: 5px; background-color: yellow;'></div>"},
		{type:"html", template: "<div style='border-radius: 5px; background-color: yellow;'></div>"},
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