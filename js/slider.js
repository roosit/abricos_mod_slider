(function($){
	$.fn.slider=function(options){
	var defaults={
		speed: 400,
		numOf: 2,
		lenta: true,
		orientation: 'gorizontal',
		wrapSlider: true,
		wrapId:'wrap',
		addBtn: true,
		prevId:'prevBtn',
		nextId:'nextBtn',
		autoplay:true,
		autoplayTimeout:5000,
		stopOnHover: false
	};
	options=$.extend(defaults, options);
	return this.each(function(){
		var obj = $(this);
		var all = $('li', obj).length;
		var w = obj.find('li:first').width();
		var h = obj.find('li:first').height();
		obj.css({width:all*w});
		var ml = obj.css('marginLeft');
		var mar = 0;
		(options.orientation=='gorizontal') ? orientation = 'satndart' : orientation = 'not-standart';
		if(options.wrapSlider)$(obj).wrapAll("<div id='"+options.wrapId+"'></div>");
		if(options.addBtn && options.wrapSlider){
			$("<div id='"+options.prevId+"'></div>").insertBefore("#"+options.wrapId);
			$("<div id='"+options.nextId+"'></div>").insertAfter("#"+options.wrapId);
		}
		
		$("#"+options.nextId).click(function(){
			if($(obj).is(':animated') == false) {
				clearInterval(intervalTimeout);
				anmSld('prev', ml);
			}
		});
		$("#"+options.prevId).click(function(){
			if($(obj).is(':animated') == false) {
				clearInterval(intervalTimeout);
				anmSld('next', ml);
			}
		});
		
		function anmSld(dir, ml){
			obj.stop(true, true);
			
			(dir != 'next') ? i = -1 : i = 1;
			(!options.lenta) ? mar += options.numOf*i : mar = options.numOf*i;
			
			if(options.lenta && dir=='next'){
				replace_elm('next');
				obj.animate({marginLeft:ml},options.speed);
			}else{
				obj.animate({marginLeft:w*mar},options.speed, function(){
					if(options.lenta) replace_elm();
				});
			}
			
			if(options.autoplay){
				intervalTimeout = setTimeout(function(){anmSld('next', ml);},options.autoplayTimeout);
			}
		}
		
		function replace_elm(dir){
			if(dir != 'next'){
				$('li',obj).slice(0,options.numOf).clone().appendTo(obj);
				$('li',obj).slice(0,options.numOf).remove();
				obj.css({marginLeft:ml});
			}else{
				sl = $('li',obj).slice(all-options.numOf);
				sl.clone().prependTo(obj);
				sl.remove();
				obj.css({marginLeft:w*(-options.numOf)});
			}
		}
		
		if(options.autoplay){
			var intervalTimeout = setTimeout(function(){anmSld('next', ml);},options.autoplayTimeout);
		}
		
		if(options.stopOnHover) {
			obj.hover(function() {
				clearInterval(intervalTimeout);
			}, function() {
				anmSld('next', ml);
			})
		}
    });
  }
  
})(jQuery);