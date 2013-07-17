/*
* @version $Id$
* @copyright Copyright (C) 2008 Abricos All rights reserved.
* @license http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
*/

/**
 * Модуль "Структура сайта".
 * 
 * @module Sitemap
 * @namespace Brick.mod.slider
 */

var Component = new Brick.Component();
Component.requires = { yahoo: ['dom'] };
Component.entryPoint = function(){
	
	var Dom = YAHOO.util.Dom,
		E = YAHOO.util.Event,
		L = YAHOO.lang;
	
	var NS = this.namespace;
	
	var API = NS.API;

    
    API.showSliderWidget = function(container){
		var widget = new NS.SliderWidget(container);
		return widget;
	};
	
	
};
