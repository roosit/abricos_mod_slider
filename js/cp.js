/*
@version $Id$
@copyright Copyright (C) 2008 Abricos. All rights reserved.
@license http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
*/

/**
 * @module Sys
 */

var Component = new Brick.Component();
Component.requires = {
	mod:[{name: 'user', files: ['cpanel.js']}]
};
Component.entryPoint = function(){
	
	if (!Brick.env.user.isAdmin()){ return; }
	var cp = Brick.mod.user.cp;

	var menuItem = new cp.MenuItem(this.moduleName, 'слайдер');
	menuItem.icon = '/modules/slider/images/cp_icon.gif';
	menuItem.titleId = 'mod.slider.cp.title';
	menuItem.entryComponent = 'manager';
	menuItem.entryPoint = 'Brick.mod.slider.API.showSliderWidget';
	cp.MenuManager.add(menuItem);
};
