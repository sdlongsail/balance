(function(a, narrow_screen_ad,narrow_screen_w,narrow_screen_h,narrow_screen_isActive,wide_screen_ad,wide_screen_w,wide_screen_h,wide_screen_isActive,placeIdentifier) {
	var ad, w, h, isActive,randId,container,containerId;
	//var isXY = isXiangYing();
	randId = Math.ceil(Math.random() * 1000000);
	if(typeof placeIdentifier  != 'undefined'){
		var identifier = document.getElementById(placeIdentifier);
		container = document.createElement('div');
		container.id = "tonglanContainer" + randId ;
		container.style.position = 'relative';
		identifier.parentNode.appendChild(container);
	}else{
		return false;
	}
	//document.write('<div id="tonglanContainer' + randId + '" style="position:relative;"></div>');
	container = document.getElementById("tonglanContainer" + randId);
	init();
	_addEventFunction(window,"resize",function(){
		onResize();
	});

	function init(){
		container.innerHTML = '';
		ad = narrow_screen_ad;w = narrow_screen_w;h = narrow_screen_h;isActive = narrow_screen_isActive;
		if( (getWidth() >= 1300) && (typeof(wide_screen_ad) != 'undefined')){//isXY &&
			ad = wide_screen_ad;w = wide_screen_w;h = wide_screen_h;isActive = wide_screen_isActive;
		}
		var sExt = ext(ad);
		if (sExt == "swf") {
			createFlash(ad, a, w, h, isActive);
		}else if(sExt == "jpg" || sExt == "png" || sExt == "gif"){
			createImg(ad, a, w, h);
		}else {
			createIframe(ad, a, w, h, isActive);
		}
	}

	function createFlash(flash_ad, flash_a, flash_w, flash_h, flash_isActive){
		var id = "flash_click_" + randId;
		var fvars = "";
		containerId = "flash_outer_2_" + id;
		if(flash_isActive){
			flash_a = encodeURIComponent(flash_a);
			fvars = 'clickTag=' + flash_a ;
		}
		var flash_nad = '<embed  width="'+flash_w+'px" height="'+flash_h+'px" wmode="opaque" src="'+flash_ad+'" flashvars="' + fvars + '" type="application/x-shockwave-flash"></embed>';
		if (/msie/.test(navigator.userAgent.toLowerCase())) {
			flash_nad = '<object  width="'+flash_w+'px" height="'+flash_h+'px" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" '
				+'codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0" id="flash_swf_'+id+'">'
				+'<param name="wmode" value="opaque"/><param name="movie" value="'+flash_ad+'"><param name="flashvars" value="' + fvars + '">'+flash_nad+'</object>';
		}
				
		container.innerHTML += ('<div style="clear: both;margin: 0 auto; width:'+flash_w+'px;height:'+flash_h+'px;" id="' + containerId + '">'
			+'<div style="width:'+flash_w+'px;height:'+flash_h+'px;position:relative;" id="flash_outer_1_'+id+'">'+flash_nad);
		
		if(!flash_isActive) {
			container.innerHTML += ('<div style="width:' + (flash_w) + 'px;position:absolute; top:0px; left:0px;z-index:3;">'
				+'<a href="'+flash_a+'" target="_blank"><img style="width:'+ (flash_w) +'px;height:'+flash_h+'px;border:0px" '
				+'src="http://y0.ifengimg.com/34c4a1d78882290c/2012/0528/1x1.gif"></a></div>');
		}
		
		container.innerHTML += '</div></div><div style="clear:both;height:0;"></div>';
		
		resizeContainerDiv();
	}

	function createImg(img_ad, img_a, img_w, img_h){
		var id = "flash_click_" + randId;
		container.innerHTML += ('<a id=' + id + ' target="_blank" href="' + img_a + '"><img src="' + img_ad + '" style="width:' + img_w + 'px;height:' + img_h+ 'px;border:none;"/></a>');
		containerId = id;
		resizeContainerDiv();
	}

	function createIframe(iframe_ad, iframe_a, iframe_w, iframe_h, iframe_isActive) {
		container.innerHTML += '<iframe width="' + iframe_w + '" height="' + iframe_h + '"  frameborder="0" scrolling="no" src=' + iframe_ad + '></iframe>';
		if (!iframe_isActive) {
			container.innerHTML += ('<div style="width:' + iframe_w + 'px;position:absolute; top:0px; left:0px;z-index:3;">'
				+ '<a href="' + iframe_a + '" target="_blank"><img style="width:' + iframe_w + 'px;height:' + iframe_h + 'px;border:0px" '
				+ 'src="http://y0.ifengimg.com/34c4a1d78882290c/2012/0528/1x1.gif"></a></div>');
		}
	}

	function resizeContainerDiv(){
		//if(isXY){
			var containerWidth = getWidth() >= 1300 ? "1230px" : "1000px";
			container.parentNode.style.width = containerWidth;
		//}
	}

	function onResize(){
		resizeContainerDiv();
		init();
	}

	function isStrictMode(){
		return document.compatMode != "BackCompat";
	}

	function getWidth(){
		if(window.ActiveXObject){
			return document.body.offsetWidth ;
		}else{
			return window.innerWidth ;
		}
	}

	function _addEventFunction(obj,evt,fn){
		if (obj.addEventListener) {
			obj.addEventListener(evt, fn, false);
		} else if (obj.attachEvent) {
			obj.attachEvent("on" + evt, fn);
		} else {
			obj["on" + evt] = fn;
		}
	}

	function ext(s){
		var pairs;
		var file;
		var s = s.replace(/(\\+)/g, '#');

		pairs = s.split('#');
		file = pairs[pairs.length - 1];

		pairs = file.split('.');
		var resultExt = pairs[pairs.length - 1];

		return resultExt.toLowerCase();
	}

	function isXiangYing(){
		var xy = false;
		if(!String.prototype.indexOf){
			String.prototype.indexOf = function(val){
				var value = this;
				for(var i =0; i < value.length; i++){
					if(value[i] == val) return i;
				}
				return -1;
			};
		}
		try{
			var docType = document.documentElement.previousSibling.nodeValue;
			if(docType == null){
				
				docType = document.doctype.publicId;
			}
			
			if(docType.indexOf("-//W3C//DTD XHTML 1.0 Transitional//EN") != -1){
				xy = false;
			}else {
				xy = true;
			}
		}catch(e){
			try{
				console.log(e.message);
			}catch(e){
				
			}
		}
		return xy;
	}


})(a, narrow_screen_ad,narrow_screen_w,narrow_screen_h,narrow_screen_isActive,wide_screen_ad,wide_screen_w,wide_screen_h,wide_screen_isActive,placeIdentifier);