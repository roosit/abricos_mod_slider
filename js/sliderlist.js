/*
@package Abricos
@license http://www.gnu.org/copyleft/gpl.html GNU/GPL, see LICENSE.php
*/

var Component = new Brick.Component();
Component.requires = {
	mod:[
		{name: '{C#MODNAME}', files: ['slidereditor.js']}
	]
};
Component.entryPoint = function(NS){
	
	var Dom = YAHOO.util.Dom,
		E = YAHOO.util.Event,
		L = YAHOO.lang,
		buildTemplate = this.buildTemplate,
		BW = Brick.mod.widget.Widget;

	var SliderListWidget = function(container, cfg){
		cfg = L.merge({
		}, cfg || {});
		
		SliderListWidget.superclass.constructor.call(this, container, {
			'buildTemplate': buildTemplate, 'tnames': 'widget' 
		}, cfg);
	};
	YAHOO.extend(SliderListWidget, BW, {
		init: function(cfg){
			this.cfg = cfg;
			this.wsList = [];
			
			this.newEditorWidget = null;
		},
		destroy: function(){
			this.clearList();
			SliderListWidget.superclass.destroy.call(this);			
		},
		onLoad: function(){
			var __self = this;
			NS.initManager(function(){
				__self._onLoadManager();
			});
		},
		_onLoadManager: function(){
			this.renderList();
		},
		clearList: function(){
			var ws = this.wsList;
			for (var i=0;i<ws.length;i++){
				ws[i].destroy();
			}
			this.elSetHTML('list', '');
		},
		renderList: function(){
			this.clearList();
			
			var elList = this.gel('list'), ws = this.wsList, 
				__self = this;
			
			NS.manager.sliderList.foreach(function(pay){
				var div = document.createElement('div');

				elList.appendChild(div);
				var w = new NS.SliderRowWidget(div, pay, {
					'onEditClick': function(w){__self.onSliderEditClick(w);},
					'onRemoveClick': function(w){__self.onSliderRemoveClick(w);},
					'onSelectClick': function(w){__self.onSliderSelectClick(w);},
					'onSave': function(w){ __self.renderList(); }
				});
		
				ws[ws.length] = w;
			});
		},
		foreach: function(f){
			if (!L.isFunction(f)){ return; }
			var ws = this.wsList;
			for (var i=0;i<ws.length;i++){
				if (f(ws[i])){ return; }
			}
		},
		allEditorClose: function(wExclude){
			this.newEditorClose();
			this.foreach(function(w){
				if (w != wExclude){
					w.editorClose();
				}
			});
		},
		onSliderEditClick: function(w){
			this.allEditorClose(w);
			w.editorShow();
		},
		onSliderRemoveClick: function(w){
			var __self = this;
			new SliderRemovePanel(w.pay, function(){
				__self.renderList();
			});
		},
		onSliderSelectClick: function(w){
			this.allEditorClose(w);
		},
		showNewEditor: function(){
			if (!L.isNull(this.newEditorWidget)){ return; }
			
			this.allEditorClose();
			var __self = this;
			var item = new NS.Slider();

			this.newEditorWidget = new NS.SliderEditorWidget(this.gel('neweditor'), item, {
				'onCancelClick': function(wEditor){ __self.newEditorClose(); },
				'onSave': function(wEditor, item){
					__self.newEditorClose(); 
					__self.renderList();
				}
			});
		},
		newEditorClose: function(){
			if (L.isNull(this.newEditorWidget)){ return; }
			this.newEditorWidget.destroy();
			this.newEditorWidget = null;
		},
		onClick: function(el, tp){
			switch(el.id){
			case tp['badd']:
				this.showNewEditor();
				return true;
			}
		}
	});
	NS.SliderListWidget = SliderListWidget;
	
	var SliderRowWidget = function(container, item, cfg){
		cfg = L.merge({
			'onEditClick': null,
			'onRemoveClick': null,
			'onSelectClick': null,
			'onSave': null
		}, cfg || {});
		SliderRowWidget.superclass.constructor.call(this, container, {
			'buildTemplate': buildTemplate, 'tnames': 'row' 
		}, item, cfg);
	};
	YAHOO.extend(SliderRowWidget, BW, {
		init: function(item, cfg){
			this.item = item;
			this.cfg = cfg;
			this.editorWidget = null;
		},
		onLoad: function(item){
			var __self = this;
			
			E.on(this.gel('id'), 'dblclick', function(e){
				__self.onEditClick();
			});
		},
		render: function(){
			var item = this.item;
			
			this.elSetHTML({
				'tl': item.title,
				'desc': item.descript
			});
		},
		onClick: function(el, tp){
			switch(el.id){
			case tp['bedit']: case tp['beditc']:
				this.onEditClick();
				return true;
			case tp['bremove']: case tp['bremovec']:
				this.onRemoveClick();
				return true;
			}
			
			return false;
		},
		onEditClick: function(){
			NS.life(this.cfg['onEditClick'], this);
		},
		onRemoveClick: function(){
			NS.life(this.cfg['onRemoveClick'], this);
		},
		onSelectClick: function(){
			NS.life(this.cfg['onSelectClick'], this);
		},
		onSave: function(){
			NS.life(this.cfg['onSave'], this);
		},
		editorShow: function(){
			if (!L.isNull(this.editorWidget)){ return; }
			var __self = this;
			this.editorWidget = 
				new NS.SliderEditorWidget(this.gel('easyeditor'), this.item, {
					'onCancelClick': function(wEditor){ __self.editorClose(); },
					'onSave': function(wEditor){ 
						__self.editorClose(); 
						__self.onSave();
					}
				});

			Dom.addClass(this.gel('wrap'), 'rborder');
			Dom.addClass(this.gel('id'), 'rowselect');
			this.elHide('menu');
			this.render();
		},
		editorClose: function(){
			if (L.isNull(this.editorWidget)){ return; }

			Dom.removeClass(this.gel('wrap'), 'rborder');
			Dom.removeClass(this.gel('id'), 'rowselect');
			this.elShow('menu');

			this.editorWidget.destroy();
			this.editorWidget = null;
			this.render();
		},
		hide: function(){
			Dom.addClass(this.gel('id'), 'hide');
		},
		show: function(){
			Dom.removeClass(this.gel('id'), 'hide');
		}
	});
	NS.SliderRowWidget = SliderRowWidget;	

	var SliderRemovePanel = function(item, callback){
		this.item = item;
		this.callback = callback;
		SliderRemovePanel.superclass.constructor.call(this, {fixedcenter: true});
	};
	YAHOO.extend(SliderRemovePanel, Brick.widget.Dialog, {
		initTemplate: function(){
			return buildTemplate(this, 'removepanel').replace('removepanel');
		},
		onClick: function(el){
			var tp = this._TId['removepanel'];
			switch(el.id){
			case tp['bcancel']: this.close(); return true;
			case tp['bremove']: this.remove(); return true;
			}
			return false;
		},
		remove: function(){
			var TM = this._TM, gel = function(n){ return  TM.getEl('removepanel.'+n); },
				__self = this;
			Dom.setStyle(gel('btns'), 'display', 'none');
			Dom.setStyle(gel('bloading'), 'display', '');
			NS.manager.sliderRemove(this.item.id, function(){
				__self.close();
				NS.life(__self.callback);
			});
		}
	});
	NS.SliderRemovePanel = SliderRemovePanel;

};