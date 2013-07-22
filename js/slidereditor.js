/*
@package Abricos
@license http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
*/

var Component = new Brick.Component();
Component.requires = {
	mod:[
		{name: '{C#MODNAME}', files: ['lib.js']}
	]
};
Component.entryPoint = function(NS){
	
	var Dom = YAHOO.util.Dom,
		E = YAHOO.util.Event,
		L = YAHOO.lang,
		buildTemplate = this.buildTemplate,
		BW = Brick.mod.widget.Widget;

	var SliderEditorWidget = function(container, slider, cfg){
		cfg = L.merge({
			'onCancelClick': null,
			'onSave': null
		}, cfg || {});
		SliderEditorWidget.superclass.constructor.call(this, container, {
			'buildTemplate': buildTemplate, 'tnames': 'widget' 
		}, slider, cfg);
	};
	YAHOO.extend(SliderEditorWidget, BW, {
		init: function(slider, cfg){
			this.slider = slider;
			this.cfg = cfg;
		},
		onLoad: function(slider){
			this.slider = slider;

			this.elHide('loading');
			this.elShow('view');
			
			this.elSetValue({
				'tl': slider.title,
				'dsc': slider.descript
			});
			
			var elTitle = this.gel('tl');
			setTimeout(function(){try{elTitle.focus();}catch(e){}}, 100);
			
			var __self = this;
			E.on(this.gel('id'), 'keypress', function(e){
				if ((e.keyCode == 13 || e.keyCode == 10) && e.ctrlKey){ 
					__self.save(); return true; 
				}
				return false;
			});
		},
		onClick: function(el, tp){
			switch(el.id){
			case tp['bsave']: this.save(); return true;
			case tp['bcancel']: this.onCancelClick(); return true;
			}
			return false;
		},
		onCancelClick: function(){
			NS.life(this.cfg['onCancelClick'], this);
		},
		save: function(){
			var cfg = this.cfg;
			var slider = this.slider;
			var sd = {
				'id': slider.id,
				'tl': this.gel('tl').value
			};
			
			this.elHide('btnsc');
			this.elShow('btnpc');

			var __self = this;
			NS.manager.sliderSave(slider.id, sd, function(slider){
				__self.elShow('btnsc,btnscc');
				__self.elHide('btnpc,btnpcc');
				NS.life(cfg['onSave'], __self, slider);
			}, slider);
		}
	});
	NS.SliderEditorWidget = SliderEditorWidget;
};