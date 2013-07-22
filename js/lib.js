/*
@package Abricos
@license http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
*/

var Component = new Brick.Component();
Component.requires = { 
	mod:[
        {name: 'sys', files: ['container.js', 'item.js']},
        {name: 'widget', files: ['notice.js']},
        {name: '{C#MODNAME}', files: ['roles.js']}
	]		
};
Component.entryPoint = function(NS){

	var Dom = YAHOO.util.Dom,
		L = YAHOO.lang,
		R = NS.roles;

	var SysNS = Brick.mod.sys;

	var buildTemplate = this.buildTemplate;
	buildTemplate({},'');
	
	NS.lif = function(f){return L.isFunction(f) ? f : function(){}; };
	NS.life = function(f, p1, p2, p3, p4, p5, p6, p7){
		f = NS.lif(f); f(p1, p2, p3, p4, p5, p6, p7);
	};
	NS.Item = SysNS.Item;
	NS.ItemList = SysNS.ItemList;
	
	var Slider = function(d){
		d = L.merge({
			'tl': '',
			'dsc': '',
			'def': 0,
			'ord': 0
		}, d || {});
		Slider.superclass.constructor.call(this, d);
	};
	YAHOO.extend(Slider, SysNS.Item, {
		update: function(d){
			this.imgage = d['img'];
			this.title = d['tl'];
			this.url = d['url'];
			this.order = d['ord']|0;
		}
	});
	NS.Slider = Slider;
	
	var SliderList = function(d){
		SliderList.superclass.constructor.call(this, d, Slider, {
			'order': '!order'
		});
	};
	YAHOO.extend(SliderList, SysNS.ItemList, {});
	NS.SliderList = SliderList;
	
	
	// все запросы к данным модуля (на сервер) поступают через этот класс
	// на сервере обрабатывает метод AJAX (includes/manager.php)
	var Manager = function (callback){
		this.init(callback);
	};
	Manager.prototype = {
		init: function(callback){
			NS.manager = this;
			
			this.sliderList = new SliderList();
	
			var __self = this;
			R.load(function(){ // загрузили роли, если они еще не подгружены в ядро JS
				__self.ajax({'do': 'initdata'}, function(d){ // запросили данные

					// Brick.console(d); // - так можно смотреть что вернул сервер
					
					__self._updateSliderList(d);
					NS.life(callback, __self);
				});
			});
		},
		ajax: function(data, callback){
			data = data || {};

			Brick.ajax('{C#MODNAME}', {
				'data': data,
				'event': function(request){
					NS.life(callback, request.data);
				}
			});
		},
		
		_updateSliderList: function(d){
			if (!L.isValue(d) || !L.isValue(d['sliders']) || !L.isValue(d['sliders']['list'])){
				return null;
			}
			this.sliderList.update(d['sliders']['list']);
		},
		sliderListLoad: function(callback){
			var __self = this;
			this.ajax({
				'do': 'sliderlist'
			}, function(d){
				__self._updateSliderList(d);
				NS.life(callback);
			});
		},
		sliderSave: function(sliderid, sd, callback){
			var list = this.sliderList, slider = null;
			var __self = this;
			this.ajax({
				'do': 'slidersave',
				'sliderid': sliderid,
				'savedata': sd
			}, function(d){
				__self._updateSliderList(d);
				if (L.isValue(d) && L.isValue(d['sliderid'])){
					slider = list.get(d['sliderid']);
				}
				NS.life(callback, slider);
			});
		},
		sliderListOrderSave: function(orders, callback){
			var __self = this;
			this.ajax({
				'do': 'sliderlistorder',
				'sliderorders': orders
			}, function(d){
				__self._updateSliderList(d);
				NS.life(callback);
			});
		},
		sliderRemove: function(sliderid, callback){
			var __self = this;
			this.ajax({
				'do': 'sliderremove',
				'sliderid': sliderid
			}, function(d){
				__self.sliderList.remove(sliderid);
				NS.life(callback);
			});
		}
	};
	NS.manager = null;
	
	NS.initManager = function(callback){
		if (L.isNull(NS.manager)){
			NS.manager = new Manager(callback);
		}else{
			NS.life(callback, NS.manager);
		}
	};
};