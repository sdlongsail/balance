/*
 * @description : 该文件用于控制视频首页手机端(焦点图切换、
 * 头部相关功能[推广位，回到顶，修改连接打开形式，导航动画]、
 * 图片滚动加载)
 * @version     : 1.0.3
 * 
 */

//============================= 1. focusMobile.js ==================================
/* global focusData, device*/
var Zepto = Zepto || null;
var jQuery = jQuery || null;
(function (doc, win, device, $) {
  "use strict";

  // 非window phone手机的焦点图交互脚本
  if (device.config.os.wphone) {
    return;
  }

  // 轮播时间间隔
  var INTERVALTIME = 5000;

  // 是否在touch状态，如果在touch状态，会取停止掉轮询动画
  var touched = false;
  // movable 可以滑动图片，unmovable 不可滑动图片，uncertain 不确定是否能滑动
  // 在做滑动图的时候，第一次出门touchmove时，会做一次角度判断，
  // 如果是小于45度，即横向移动大于纵向移动，则将状态设为movable，
  // 这时会滑动图片，而禁止滚动页面
  // 如果是大于45度，即横向移动小于纵向移动，则将状态设为unmovable
  // 这时会禁止图片滑动，而可以滚动页面
  // 在触发touchend时，如果状态是movable，则可以进行图片滚动的动画
  // 如果状态是unmovable，则不可以进行图片滚动的动画
  // 最后会将状态设置为uncertain，用来准备下一次touch过程
  var canMove = "uncertain";
  // 当前索引位置
  var index = 1;
  // 动画元件数量
  var itemCount = focusData.length;
  // 动画的容器
  var $box = $("#js_focus");
  // 容器宽度
  var boxWidth = $box.width();
  // 动画移动的容器
  var $movBox = $("#js_focus_in");

  // 自动播放timer
  var autoMoveTimer = null;

  var beginX = 0;
  var beginY = 0;

  var init = function () {
    initStyle();
    initEvent();
    initAutoPlay();
  };

  // 初始化样式
  var initStyle = function () {
    addCssTransform("-" + boxWidth + "px");
  };

  var initEvent = function () {

    // 当屏幕发生旋转时，重新获取容器宽度，并且重新设置动画容器的位置。
    $(win).on("resize", function () {
      boxWidth = $box.width();
      $movBox.removeClass("anim");
      addCssTransform("-" + boxWidth * index + "px");
    });

    // 触摸滚动
    $movBox.on("touchstart", function (ev) {
      touched = true;
      $movBox.removeClass("anim");
      // 根据index值对位置进行重置，造成能够循环的效果
      if (index <= 0) {
        addCssTransform("-" + itemCount * boxWidth + "px");
        index = itemCount;
      }
      if (index >= itemCount + 1) {
        addCssTransform("-" + boxWidth + "px");
        index = 1;
      }
      beginX = ev.touches[0].pageX;
      beginY = ev.touches[0].pageY;
    });

    // @todo 这里touchmove的时候，中低端安卓下面性能有问题，回头考虑将move脚本优化一下
    $movBox.on("touchmove", function (ev) {
      var movx = ev.touches[0].pageX - beginX;
      var movy = ev.touches[0].pageY - beginY;

      // 增加了滑动时，第一次来判断滑动角度，从而决定是滚屏还是滑动图片。
      if (canMove === "uncertain") {
        if (Math.abs(movx) > Math.abs(movy)) {
          canMove = "movable";
        } else {
          canMove = "unmovable";
        }
      }

      if (canMove === "unmovable") {
        return;
      }

      var posx = ev.touches[0].pageX - beginX - boxWidth * (index);

      if (movx >= -boxWidth && movx <= boxWidth) {
        addCssTransform(posx + "px");
        // doc.title = beginX - ev.touches[0].pageX + ":" + index;
      }
      return false;
    });

    $movBox.on("touchend", function (ev) {

      if (canMove === "unmovable") {
        canMove = "uncertain";
        touched = false;
        return;
      }

      $movBox.addClass("anim");
      // 根据位移关系，决定动画方式
      if (beginX - ev.changedTouches[0].pageX > 50) {
        addCssTransform("-" + ((index + 1) * boxWidth) + "px");
        index++;
      } else if (beginX - ev.changedTouches[0].pageX < -50) {
        addCssTransform("-" + ((index - 1) * boxWidth) + "px");
        index--;
      } else {
        addCssTransform("-" + ((index - 0) * boxWidth) + "px");
      }

      canMove = "uncertain";
      touched = false;
      // console.log("*********>>", index);
      autoMove();
    });

    // 点击箭头滚动
    $(".fucusbar .next").on("touchend", function () {
      moveNext();
      autoMove();

    });
    $(".fucusbar .prev").on("touchend", function () {
      movePrev();
      autoMove();
    });

  };

  var initAutoPlay = function () {
    autoMove();
  };

  // 修改特定样式
  var addCssTransform = function (value) {
    var prefixs = ["-moz-", "-webkit-", "-ms-", "-o-", ""];
    for (var i = 0, iLen = prefixs.length; i < iLen; i++) {
      $movBox.css(prefixs[i] + "transform", "translate3d(" + value + ", 0, 0)");
    }
  };

  var moveNext = function () {
    if (touched) {
      return;
    }

    if (index >= itemCount + 1) {
      $movBox.removeClass("anim");
      addCssTransform("-" + boxWidth + "px");
      index = 1;
    }

    setTimeout(function () {
      $movBox.addClass("anim");
      addCssTransform("-" + ((index + 1) * boxWidth) + "px");
      index++;
    }, 100);
  };

  var movePrev = function () {
    if (touched) {
      return;
    }
    if (index <= 0) {
      $movBox.removeClass("anim");
      addCssTransform("-" + itemCount * boxWidth + "px");
      index = itemCount;
    }

    setTimeout(function () {
      $movBox.addClass("anim");
      addCssTransform("-" + ((index - 1) * boxWidth) + "px");
      index--;
    }, 100);
  };

  var autoMove = function () {
    clearInterval(autoMoveTimer);
    autoMoveTimer = setInterval(moveNext, INTERVALTIME);
  };

  init();

}(document, window, device, (Zepto || jQuery)));

(function (doc, win, device, $) {
  "use strict";

  // window phone手机的焦点图交互脚本
  if (!device.config.os.wphone) {
    return;
  }

  var INTERVALTIME = 5000;
  // 是否在touch状态，如果在touch状态，会取停止掉轮询动画
  var touched = false;
  // 当前索引位置
  var index = 0;
  // 动画元件数量
  var itemCount = 4;
  // 动画的容器
  var $box = $("#js_focus");
  // 容器宽度
  var boxWidth = $box.width();
  // 动画移动的容器
  var $movBox = $("#js_focus_in");

  var autoMoveTimer = null;

  var init = function () {
    initStyle();
    initEvent();
    initAutoPlay();
  };

  var initStyle = function () {
    // addCssTransform("-" + boxWidth + "px");
    // $movBox.css("position", "absolute");
    $movBox.css("margin-left", "-" + boxWidth + "px");
    $movBox.find("img").width(boxWidth);
    $movBox.width(boxWidth * (itemCount + 2));
    $movBox.find(".pic").width(boxWidth);
  };

  var initEvent = function () {

    // 当屏幕发生旋转时，重新获取容器宽度，并且重新设置动画容器的位置。
    $(win).on("resize", function () {
      boxWidth = $box.width();
      $movBox.find("img").width(boxWidth);
      $movBox.width(boxWidth * (itemCount + 2));
      $movBox.find(".pic").width(boxWidth);
      addCssMargin("-" + boxWidth * index + "px");
    });

    // 点击箭头滚动
    $(".fucusbar .next").on("mousedown", function () {
      moveNext();
      autoMove();

    });
    $(".fucusbar .prev").on("mousedown", function () {
      movePrev();
      autoMove();
    });

  };

  var initAutoPlay = function () {
    autoMove();
  };

  // 修改特定样式
  var addCssMargin = function (value) {
    $movBox.css("margin-left", value);
  };

  var autoMove = function () {
    clearInterval(autoMoveTimer);
    autoMoveTimer = setInterval(moveNext, INTERVALTIME);
  };

  var moveNext = function () {
    if (touched) {
      return;
    }

    if (index >= itemCount + 1) {
      addCssMargin("-" + boxWidth + "px");
      index = 1;
    }

    $movBox.animate({
      "margin-left": "-" + ((index + 1) * boxWidth) + "px"
    }, 300, function () {
      index++;
    });

  };

  var movePrev = function () {
    if (touched) {
      return;
    }

    if (index <= 0) {
      addCssMargin("-" + itemCount * boxWidth + "px");
      index = itemCount;
    }

    $movBox.animate({
      "margin-left": "-" + ((index - 1) * boxWidth) + "px"
    }, 300, function () {
      index--;
    });

  };

  init();

}(document, window, device, (Zepto || jQuery)));


//============================= 1. headMobile.js ==================================
//Update by Guomiao  --20140711 
(function () {
  if (typeof device === 'undefined') {
    return;
  }
  if (device.type !== 'pc') {	
    var $ = function (id) {
      return document.getElementById(id);
    };
	var pageUrl = window.location.href;
	var GuId =  pageUrl.substring(pageUrl.indexOf('#')+1);
    $("js_vtop_logo").setAttribute("target", "_self");
    // 根据设备获取相应的app下载链接
    var getAppUrl = function () {
      return 'http://api.3g.ifeng.com/ifengvideo_tg20?vt=5';
    };
    var getCookie = function (name) {
      var cStrArr = document.cookie.split(';');
      for (var i = 0, l = cStrArr.length; i < l; i++) {
        var cStr = cStrArr[i];
        var index = cStr.indexOf('=');
        var cname = cStr.substring(0, index).replace(/[ ]/g, "");
        var value = cStr.substring(index + 1);
        if (cname === name) {
          return decodeURIComponent(value);
        }
      }
      return '';
    };
    var setCookie = function (name, value) {
      var cStrArr = [];
      cStrArr.push(name + '=' + encodeURIComponent(value));
      var date = new Date();
      date.setTime(date.getTime() + 24 * 60 * 1000 * 60);
      cStrArr.push('; expires=' + date.toGMTString());
      cStrArr.push('; path=/');
      document.cookie = cStrArr.join('');
    };
	var public_client_auto = function (host) {
            var ifr = document.createElement('iframe');
            ifr.src = host;
            ifr.style.display = 'none';
            document.body.appendChild(ifr);
            window.setTimeout(function () {
                document.body.removeChild(ifr);
            }, 3000);			
     };
	 var showClientSpared= function(elementId, cookieId, closeId){
             if ($(elementId))
              {
                 if ( (getCookie(cookieId) !== 'hide' || document.cookie === '')) {
                  $(elementId).style.display = 'block';
                 }
                     $ (elementId).onclick=function(){  
                      if (navigator.userAgent.indexOf("Linux")>-1){
                                setTimeout(function () {
                                    public_client_auto("ifengVideoPlayer://video/"+GuId+"/h5");
                                  }, 200);
                                setTimeout(function () {
                                    if (document.hasFocus()) {
                                      window.open('http://api.3g.ifeng.com/ifengvideo_tg20?vt=5', 'target=_blank', '');
                                    }
                                  }, 1000);   

                                }else{
                                    window.open('http://api.3g.ifeng.com/ifengvideo_tg20?vt=5', 'target=_blank', '');
                                     }
                        }
			$(closeId).onclick = function (e) {
			  setCookie(cookieId, 'hide');
			  $(elementId).style.display = 'none';
			  if (e.stopPropagation) {
				e.stopPropagation();
			  } else {
				e.cancelBubble = true;
			  }
			};
		  } else {
			$(elementId).style.display = 'none';
		  }
      }  
/*客户端上下banner拉起 
 *函数变量名称pullAd
 *安卓下先尝试拉起客户端，再跳到下载链接；IOS直接跳转至下载链接
*/           
	var pullAd=function(elementId, cookieId, closeId,col){   
		if ($(elementId)) {
			if ((device.config.os.android || device.config.os.ios) && (getCookie(cookieId) !== 'hide' || document.cookie === '')) {
					$(elementId).style.display = 'block';//banner显示
                    $(elementId).onclick = function() {  
                        //alert("navigator.userAgent" + navigator.userAgent);
						if (navigator.userAgent.indexOf("Linux")>-1){
                            setTimeout(function () {
								//alert("up:"+"ifengVideoPlayer://video/"+GuId+"/h5");
								//public_client_auto("ifengVideoPlayer://video/"+window['videoinfo']['id']+"/h5");
								public_client_auto("ifengVideoPlayer://video/"+GuId+"/h5");
								//alert("end");
								}, 200);      
                            setTimeout(function () {                             
                                      if(document.hasFocus() ) {                                                         
                                          window.open('http://api.3g.ifeng.com/ifengvideo_tg20?vt=5', 'target=_blank', '');
                                         }
                            }, 1000); 
                        }else{//if not android
                                window.open('http://api.3g.ifeng.com/ifengvideo_tg20?vt=5', 'target=_blank', '');
                              }
                        }
                        $(closeId).onclick = function(e) {
							setCookie(cookieId, 'hide');
							$(elementId).style.display = 'none';
							if (e.stopPropagation) {
								e.stopPropagation()
							} else {
								e.cancelBubble = true
							}
                    }
                } 
                else 
                {// not android or ios
                  $(elementId).style.display = 'none'
                }
         }
     };
	var pullDownload=function(elementId){ 
        $(elementId).style.display = 'block';
        $(elementId).onclick = function() {  
            if (navigator.userAgent.indexOf("Linux")>-1){
                  setTimeout(function () {public_client_auto("ifengVideoPlayer://video/"+GuId+"/h5");
                                                }, 200);
                                     
                  setTimeout(function () {
                       if(document.hasFocus()){                                             
                            window.open('http://api.3g.ifeng.com/ifengvideo_tg20?vt=5', 'target=_blank', '');
                       }
                   }, 1000); 
            }else{//if not android
                  window.open('http://api.3g.ifeng.com/ifengvideo_tg20?vt=5', 'target=_blank', '');
            }
        }
    }  
    pullAd("ad_top", "app_ad_top", "ad_close1");//顶通
	if(device.type === "pad"){
		//pullDownload("pad_download");//IPAD下载观看
		showClientSpared("client-spread", "client-ad-spread", "client-spread-close");//悬浮广告
	}else if(device.type==="mobile"){
		pullAd("footAd", "app_ad_bot", 'ad_close2');//低通
        //pullDownload("m_download");//下载观看
		if (navigator.userAgent.indexOf("UCBrowser")>-1||navigator.userAgent.indexOf("Linux")>-1) {
                showClientSpared("client-spread", "client-ad-spread", "client-spread-close");//悬浮广告
              }
	}	
  }
})();

//============================= 1. picLazyMobile.js ==================================
var Zepto = Zepto || null;
var jQuery = jQuery || null;
(function (doc, win, $) {
  "use strict";
  var wHeight = $(win).height();

  // 图片懒加载
  var picLazy = function () {
    var pics = document.getElementsByTagName("img");
    var one;
    var scrollTop = $(win).scrollTop();
    var iTop;
    var height;

    for (var i = 0, iLen = pics.length; i < iLen; i++) {
      one = pics[i];
      if (one.className === "lazy_img") {
        iTop = $(one).offset().top;
        height = $(one).height();
        if (height !== 0 && iTop > scrollTop - height && iTop < (scrollTop + wHeight)) {
          one.src = one.getAttribute("data-src");
          one.className = "";
        }
      }
    }
  };

  // 替换链接中的 target="_blank"，使链接在当前页面打开
  var replaceLinkTarget = function () {
    var links = document.getElementsByTagName("a");
    var link;
    for (var i = 0, iLen = links.length; i < iLen; i++) {
      link = links[i];
      if (link.target === "_blank" || link.target === "video") {
        link.target = "_self";
      }
    }
  };

  $(win).on("scroll", picLazy);

  // 显示隐藏返回顶部按钮
  $(win).on("scroll", function () {
    if ($(win).scrollTop() > wHeight) {
      $("#v_code").show();
    } else {
      $("#v_code").hide();
    }
  });

  // 点击返回顶部
  $(".backtop").on("mousedown", function () {
    doc.body.scrollTop = 0;
    return false;
  });

  // 页面尺寸变化，其实就是屏幕翻转的时候，重新计算屏幕高度
  $(win).on("resize", function () {
    wHeight = $(win).height();
  });

  picLazy();
  replaceLinkTarget();
}(document, window, Zepto || jQuery));


/**
 * @description : 该文件用于控制视频首页手机端(焦点图切换、
 * 头部相关功能[推广位，回到顶，修改连接打开形式，导航动画]、
 * 图片滚动加载)
 * 
 * @version     : 1.0.1
 *
 * @import: 
 *           
 *        (1) zepto.js
 *        windows phone下面加载
 *        (1) jquery1.9.1
 *        
 *
 * @createTime : 2013-07-04
 * 
 * @updateTime : 2013-07-04
 *
 * @updateTime : 2013-12-09
 * 
 * @updateTime : 2014-07-11
 *
 * @updateLog : 
 *
 *        1.0.1 - 合并文件
 *        1.0.2 - 修改客户端下载跳转地址统一为 http://api.3g.ifeng.com/ifengvideo_tg20?vt=5
 *		  1.0.3 - 修改了客户端拉起的部分（"1.headMobile.js"）


/******************************** 合并顺序：************************************
    1. focusMobile.js   - 焦点图切换
    2. headMobile.js    - 头部功能
    3. picLazyMobile.js - 图片滚动加载

*******************************************************************************/