/**
* @package Abricos
* @copyright Copyright (C) 2008 Abricos. All rights reservedd.
* @license http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
*/

var Component = new Brick.Component();
Component.requires = {
	mod:[
         {name: 'slider', files: ['api.js']},
         {name: 'filemanager', files: ['filemanager.js']}
    ]
};
Component.entryPoint = function(){
	var Dom = YAHOO.util.Dom,
		E = YAHOO.util.Event,
		L = YAHOO.lang;

	var NS = this.namespace, 
		TMG = this.template;
	
	var API = NS.API;
	
	
(function(){
	
	var SliderWidget = function(container){
		this.init(container);
	};
    
    	Brick.Loader.add({mod:[{name:'filemanager',files:['filemanager.html']}],
        onSuccess: function() {

          }
        });

	SliderWidget.prototype = {
		init: function(container){
			var TM = TMG.build('slider'), T = TM.data, TId = TM.idManager;
			container.innerHTML = T['slider'];
		}
	};

	NS.SliderWidget = SliderWidget; 
})();

};

