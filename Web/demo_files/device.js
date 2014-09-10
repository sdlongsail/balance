var device = (function (doc, win, device) {
  "use strict";

  device = {type : "pc"};
  var detect = function (ua) {

    // 一大批基于ua进行判断的正则。
    var oTemp = {};
    var os = oTemp.os = {};
    var browser = oTemp.browser = {};
    var webkit = ua.match(/WebKit\/([\d.]+)/);
    var android = ua.match(/(Android)\s+([\d.]+)/);
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
    var webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/);
    var touchpad = webos && ua.match(/TouchPad/);
    var kindle = ua.match(/Kindle\/([\d.]+)/);
    var silk = ua.match(/Silk\/([\d._]+)/);
    var blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
    var bb10 = ua.match(/(BB10).*Version\/([\d.]+)/);
    var rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/);
    var playbook = ua.match(/PlayBook/);
    var chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/);
    var firefox = ua.match(/Firefox\/([\d.]+)/);
    var bIsWM = ua.match(/Windows Phone/);

    // Todo: clean this up with a better OS/browser seperation:
    // - discern (more) between multiple browsers on android
    // - decide if kindle fire in silk mode is android or not
    // - Firefox on Android doesn't specify the Android version
    // - possibly devide in os, device and browser hashes

    browser.webkit = !!webkit;

    if (browser.webkit) {
      browser.version = webkit[1];
    }

    // 是否是windows phone
    if (bIsWM) {
      os.wphone = true;
    }

    if (android) {
      os.android = true;
      os.version = android[2];
    }

    if (iphone) {
      os.ios = true;
      os.iphone = true;
      os.version = iphone[2].replace(/_/g, '.');
    }

    if (ipad) {
      os.ios = true;
      os.ipad = true;
      os.version = ipad[2].replace(/_/g, '.');
    }

    if (webos) {
      os.webos = true;
      os.version = webos[2];
    }

    if (touchpad) {
      os.touchpad = true;
    }

    if (blackberry) {
      os.blackberry = true;
      os.version = blackberry[2];
    }

    if (bb10) {
      os.bb10 = true;
      os.version = bb10[2];
    }

    if (rimtabletos) {
      os.rimtabletos = true;
      os.version = rimtabletos[2];
    }

    if (playbook) {
      browser.playbook = true;
    }

    if (kindle) {
      os.kindle = true;
      os.version = kindle[1];
    }

    if (silk) {
      browser.silk = true;
      browser.version = silk[1];
    }

    if (!silk && os.android && ua.match(/Kindle Fire/)) {
      browser.silk = true;
    }

    if (chrome) {
      browser.chrome = true;
      browser.version = chrome[1];
    }

    if (firefox) {
      browser.firefox = true;
      browser.version = firefox[1];
    }

    os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
        (firefox && ua.match(/Tablet/)));
    os.phone  = !!(!os.tablet && (android || iphone || webos || blackberry || bb10 ||
        (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
        (firefox && ua.match(/Mobile/))) || bIsWM);

    return oTemp;
  };

  var deviceConfig = detect(navigator.userAgent);
  device.config = deviceConfig;

  // 此部分通过使用媒体查询的方法，来判断设备的宽度和高度
  // var matchMedia = (function () {

  //   var bool;
  //   var docElem = doc.documentElement;
  //   var refNode = docElem.firstElementChild || docElem.firstChild;
  //   // fakeBody required for <FF4 when executed in <head>
  //   var fakeBody = doc.createElement('body');
  //   var div = doc.createElement('div');

  //   div.id = 'mq-test-1';
  //   div.style.cssText = "position:absolute;top:-100em";
  //   fakeBody.style.background = "none";
  //   fakeBody.appendChild(div);

  //   return function (q) {

  //     div.innerHTML = '&shy;<style media="' + q + '"> #mq-test-1 { width: 42px; }</style>';

  //     docElem.insertBefore(fakeBody, refNode);
  //     bool = div.offsetWidth === 42;
  //     docElem.removeChild(fakeBody);

  //     return { matches: bool, media: q };
  //   };

  // }());

  // var weighing = 0;
  // if (matchMedia('only screen and (max-height: 768px)').matches) {
  //   weighing++;
  //   alert("height");
  // }

  // if (matchMedia('only screen and (max-width: 768px)').matches) {
  //   alert("width");
  //   weighing++;
  // }

  if (deviceConfig.os.tablet) {
    device.type = "pad";
  }

  // @puzzle 这里还需要使用matchMedia进行判断么？如果不需要就去掉好了。
  // 暂时先去掉，回头有问题再加上，这样比较好。
  if (/* weighing === 2 || */deviceConfig.os.phone) {
    device.type = "mobile";
  }

  var screenW = win.screen.width;
  var screenH = win.screen.height;
  var innerW = win.innerWidth;
  var innerH = win.innerHeight;

  // 获取设备的宽度和高度，
  // 在安卓设备中，device-width和device-height无法准确获取，
  // 这里使用通过一个取巧的方式来通过计算点密度反推设备宽高，
  // 不过这里还是不能证明能够获取正确的设备宽高。
  if (deviceConfig.os.ios || device.type === "pc") {
    device.width = screenW;
    device.height = screenH;
  } else {
    var ratioW = screenW / innerW;
    var ratioH = screenH / innerH;
    var ratio = ratioW < ratioH ? ratioW : ratioH;
    device.width = Math.floor(screenW / ratio);
    device.height = Math.floor(screenH / ratio);
  }

  // doc.title = device.type + ":" + device.width + ":" + device.height;
  return device;

}(document, window));

