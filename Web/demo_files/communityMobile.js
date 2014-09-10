/* global columnNav, columnCon, device */
var Zepto = Zepto || null;
var jQuery = jQuery || null;
// 生成html代码
(function (doc, win, device, $) {
  "use strict";

  var init = function () {
    creatNav();
    creatList();
    creatDot();
  };

  var creatNav = function () {
    var htmls = ['<ul>'];
    for (var i = 0, iLen = columnNav.length; i < iLen; i++) {
      if (i === 0) {
        htmls.push('<li class="current">' + columnNav[i].name + '</li>');
      } else {
        htmls.push('<li>' + columnNav[i].name + '</li>');
      }
    }
    htmls.push('</ul>');
    $("#tvpro_tab").html(htmls.join(""));
  };

  var creatList = function () {
    var htmls = ['<div class="tvpro_view" id="tvpro_view">'];
    htmls.push(creatOneList(columnNav[columnNav.length - 1].index));
    for (var i = 0, iLen = columnNav.length; i < iLen; i++) {
      htmls.push(creatOneList(columnNav[i].index));
    }
    htmls.push(creatOneList(columnNav[0].index));
    htmls.push('</div>');
    $("#js_community").html(htmls.join(""));
  };

  var creatOneList = function (name) {
    var list = columnCon[name];
    var htmls = ['<div class="js_tvpro_item"><ul>'];
    var temp;
    for (var i = 0, iLen = list.length; i < iLen; i++) {
      temp = list[i];
      htmls.push('<li><a href="' + temp.url + '" class="tvpro_view_link"><em>' + temp.title + '</em></a></li>');
    }
    htmls.push('</ul></div>');
    return htmls.join("");
  };

  var creatDot = function () {
    var htmls = ['<ul class="tab_btn">'];
    for (var i = 0, iLen = columnNav.length; i < iLen; i++) {
      if (i === 0) {
        htmls.push('<li class="current"></li>');
      } else {
        htmls.push('<li></li>');
      }
    }
    htmls.push('</ul>');
    $("#js_community").after(htmls.join(""));
  };

  init();
}(document, window, device, (Zepto || jQuery)));

(function (doc, win, device, $) {
  "use strict";

  // 非window phone手机的社区交互脚本
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
  var itemCount = columnNav.length;
  // 动画的容器
  var $box = $("#js_community");
  // 容器宽度
  var boxWidth = $box.width();
  // 动画移动的容器
  var $movBox = $("#tvpro_view");

  // 社区导航相关数据获取
  var $nav = $("#tvpro_tab");
  var $movNav = $nav.find("ul");
  var $navItem = $nav.find("li");
  var navWidth = $nav.width();
  var navItemWidth = $nav.find("li").width();
  // 计算能够显示出来的导航数量
  var viewNavCount = Math.round(navWidth / navItemWidth);
  $movNav.addClass("anim");

  // 自动播放timer
  var autoMoveTimer = null;

  var beginX = 0;
  var beginY = 0;

  var init = function () {
    initStyle();
    initEvent();
    initAutoPlay();
  };

  var initStyle = function () {
    addCssTransform("-" + boxWidth + "px");
  };

  var initEvent = function () {

    // 当屏幕发生旋转时，重新获取容器宽度，并且重新设置动画容器的位置。
    // 重新计算导航部分的单元宽度和显示数量
    $(win).on("resize", function () {
      boxWidth = $box.width();
      navWidth = $nav.width();
      navItemWidth = $nav.find("li").width();
      viewNavCount = Math.round(navWidth / navItemWidth);
      $movBox.removeClass("anim");
      addCssTransform("-" + boxWidth * index + "px", index);
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
        // document.title = beginX - ev.touches[0].pageX + ":" + index;
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
      if (beginX - ev.changedTouches[0].pageX > 50) {
        addCssTransform("-" + ((index + 1) * boxWidth) + "px", index + 1);
        index++;
      } else if (beginX - ev.changedTouches[0].pageX < -50) {
        addCssTransform("-" + ((index - 1) * boxWidth) + "px", index - 1);
        index--;
      } else {
        addCssTransform("-" + ((index - 0) * boxWidth) + "px", index - 0);
      }
      canMove = "uncertain";
      touched = false;
      // console.log("*********>>", index);
      autoMove();
    });

    $navItem.on("touchend", function () {

      if (!$(this).hasClass("current")) {
        $movBox.addClass("anim");
        $navItem.removeClass("current");
        $(this).addClass("current");
        index = $navItem.index(this) + 1;
        addCssTransform("-" + (index) * boxWidth + "px", index);
        autoMove();
      }

    });

  };

  var initAutoPlay = function () {
    autoMove();
  };

  // 修改特定样式
  var addCssTransform = function (value, index) {
    var prefixs = ["-moz-", "-webkit-", "-ms-", "-o-", ""];
    var tempIndex;
    for (var i = 0, iLen = prefixs.length; i < iLen; i++) {
      $movBox.css(prefixs[i] + "transform", "translate3d(" + value + ", 0, 0)");
    }
    // 修改样式的同时，调整对应导航的状态以及将可视范围外的导航移动到其内部。
    // 这里计算的原因是因为index比实际数量前后各多一个，需要进行一下转换。
    if (typeof index !== "undefined") {
      $navItem.removeClass("current");
      if (index > itemCount) {
        tempIndex = index - itemCount;
      } else if (index === 0) {
        tempIndex = itemCount;
      } else {
        tempIndex = index;
      }
      addNavCssTransform(tempIndex);
      $navItem.get(tempIndex - 1).className = "current";
      $(".tab_btn li").removeClass("current");
      $(".tab_btn li").get(tempIndex - 1).className = "current";
    }
  };

  // 根据导航位置移动导航条
  var addNavCssTransform = function (index) {
    var prefixs = ["-moz-", "-webkit-", "-ms-", "-o-", ""];
    var count = 0;
    // console.log(index);
    if (index > viewNavCount) {
      count = index - viewNavCount;
    }
    for (var i = 0, iLen = prefixs.length; i < iLen; i++) {
      $movNav.css(prefixs[i] + "transform", "translate3d(-" + count * navItemWidth + "px, 0, 0)");
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
      addCssTransform("-" + ((index + 1) * boxWidth) + "px", index + 1);
      index++;
    }, 100);

  };

  // var movePrev = function () {
  //   if (touched) {
  //     return;
  //   }
  //   if (index <= 0) {
  //     $movBox.removeClass("anim");
  //     addCssTransform("-" + itemCount * boxWidth + "px");
  //     index = itemCount;
  //   }

  //   setTimeout(function () {
  //     $movBox.addClass("anim");
  //     addCssTransform("-" + ((index - 1) * boxWidth) + "px", index - 1);
  //     index--;
  //   }, 100);
  // };

  // var moveTo = function (index) {

  // };

  var autoMove = function () {
    clearInterval(autoMoveTimer);
    autoMoveTimer = setInterval(moveNext, INTERVALTIME);
  };

  init();

}(document, window, device, Zepto || jQuery));

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
  var itemCount = columnNav.length;
  // 动画的容器
  var $box = $("#js_community");
  // 容器宽度
  var boxWidth = $box.width();
  // 动画移动的容器
  var $movBox = $("#tvpro_view");

  var $nav = $("#tvpro_tab");
  var $movNav = $nav.find("ul");
  var $navItem = $nav.find("li");
  var navWidth = $nav.width();
  var navItemWidth = $nav.find("li").width();
  var viewNavCount = Math.round(navWidth / navItemWidth) - 1;

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
    $movBox.width(boxWidth * (itemCount + 2));
    $movBox.find(".js_tvpro_item").width(boxWidth);
    navItemWidth = $nav.find("li").width();
    viewNavCount = Math.round(navWidth / navItemWidth) - 1;

  };

  var initEvent = function () {

    // 当屏幕发生旋转时，重新获取容器宽度，并且重新设置动画容器的位置。
    $(win).on("resize", function () {
      boxWidth = $box.width();
      $movBox.width(boxWidth * (itemCount + 2));
      $movBox.find(".js_tvpro_item").width(boxWidth);
      navWidth = $nav.width();
      navItemWidth = $nav.find("li").width();
      viewNavCount = Math.round(navWidth / navItemWidth) - 1;
      addCssMargin("-" + boxWidth * index + "px", index);
    });

    $navItem.on("mousedown", function () {

      if (!$(this).hasClass("current")) {
        $movBox.addClass("anim");
        $navItem.removeClass("current");
        $(this).addClass("current");
        index = $navItem.index(this) + 1;
        addNavCssMargin(index);
        $movBox.animate({
          "margin-left": "-" + (index * boxWidth) + "px"
        }, 300);
        autoMove();
      }

    });

  };

  var initAutoPlay = function () {
    autoMove();
  };

  // 修改特定样式
  var addCssMargin = function (value, index) {
    $movBox.css("margin-left", value);
    if (typeof index !== "undefined") {
      addNavCssMargin(index);
    }

  };

  // 修改导航的位置样式
  var addNavCssMargin = function (index) {
    var tempIndex;

    if (index > itemCount) {
      tempIndex = index - itemCount;
    } else if (index === 0) {
      tempIndex = 1;
    } else {
      tempIndex = index;
    }
    var count = 0;
    if (tempIndex > viewNavCount) {
      count = tempIndex - viewNavCount;
    }
    $movNav.css("-ms-transform", "translate(-" + count * navItemWidth + "px, 0)");
    $navItem.removeClass("current");
    $navItem.get(tempIndex - 1).className = "current";
    $(".tab_btn li").removeClass("current");
    $(".tab_btn li").get(tempIndex - 1).className = "current";

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
      addCssMargin("-" + boxWidth + "px", 2);
      index = 1;
    } else {
      addNavCssMargin(index + 1);
    }

    $movBox.animate({
      "margin-left": "-" + ((index + 1) * boxWidth) + "px"
    }, 300, function () {
      index++;
    });

  };

  // var movePrev = function () {
  //   if (touched) {
  //     return;
  //   }

  //   if (index <= 0) {
  //     addCssMargin("-" + itemCount * boxWidth + "px");
  //     index = itemCount;
  //   }

  //   $movBox.animate({
  //     "margin-left": "-" + ((index - 1) * boxWidth) + "px"
  //   }, 300, function () {
  //     index--;
  //   });

  // };

  init();

}(document, window, device, Zepto || jQuery));