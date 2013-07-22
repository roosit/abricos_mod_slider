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
	
	NS.activeImageList = null;

	var SliderEditorWidget = function(container, slider, cfg){
		cfg = L.merge({
			'onCancelClick': null,
			'onSave': null
		}, cfg || {});
		SliderEditorWidget.superclass.constructor.call(this, container, {
			'buildTemplate': buildTemplate, 'tnames': 'widget,img' 
		}, slider, cfg);
	};
	YAHOO.extend(SliderEditorWidget, BW, {
		init: function(slider, cfg){
			this.slider = slider;
			this.cfg = cfg;
			
			this.uploadWindow = null;
			this.imageid = null;
		},
		onLoad: function(slider){
			this.slider = slider;

			this.elHide('loading');
			this.elShow('view');
			
			this.elSetValue({
				'tl': slider.title,
				'dsc': slider.descript
			});
			
			this.setImageByFID(slider.image);
			
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
			case tp['bimgfrompc']:
				this.uploadImageFromPC();
				return true;
			case tp['bimgfromfm']:
				this.selectImageFromFM();
				return true;
			case tp['bimgremove']:
				this.removeImage();
				return true;
			
			case tp['bsave']: this.save(); return true;
			case tp['bcancel']: this.onCancelClick(); return true;
			}
			return false;
		},
		onCancelClick: function(){
			NS.life(this.cfg['onCancelClick'], this);
		},
		uploadImageFromPC: function() {
			if (!L.isNull(this.uploadWindow) && !this.uploadWindow.closed){
				this.uploadWindow.focus();
				return;
			}
			var url = '/{C#MODNAME}/uploadimg/';
			this.uploadWindow = window.open(
				url, 'catalogimage',	
				'statusbar=no,menubar=no,toolbar=no,scrollbars=yes,resizable=yes,width=550,height=500' 
			);
			NS.activeImageList = this;
		},
		selectImageFromFM: function() {
			this.elShow('bimgfromfmld');
			this.elHide('bimgfromfm');

			var __self = this;
			Brick.ff('filemanager', 'api', function(){
				__self.elHide('bimgfromfmld');
				__self.elShow('bimgfromfm');
				Brick.mod.filemanager.API.showFileBrowserPanel(function(result){
					__self.setImageByFID(result['file']['id']);
				});
        	});
		},
		removeImage: function(){
			this.setImageByFID(null);
		},
		setImageByFID: function(fid){
			this.imageid = fid;
			var TM = this._TM,
				el50 = this.gel('thumb50'),
				el100 = this.gel('thumb100'),
				el200 = this.gel('thumb200');
			
			if (L.isNull(fid)){
				el50.innerHTML = el100.innerHTML = el200.innerHTML = '';
				this.elHide('bimgremove');
			}else{
				el50.innerHTML = TM.replace('img', {'fid': fid, 'w': 50, 'h': 50});
				el100.innerHTML = TM.replace('img', {'fid': fid, 'w': 100, 'h': 100});
				el200.innerHTML = TM.replace('img', {'fid': fid, 'w': 200, 'h': 200});
				this.elShow('bimgremove');
			}
		},		
		save: function(){
			var cfg = this.cfg;
			var slider = this.slider;
			var sd = {
				'id': slider.id,
				'tl': this.gel('tl').value,
				'img': L.isNull(this.imageid) ? '' : this.imageid
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