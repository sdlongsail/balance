/** Code by www.labsmedia.com */
function addEvtListener(c, b, a) {
	if (document.addEventListener) {
		if (c) {
			c.addEventListener(b, a, false)
		} else {
			addEventListener(b, a, false)
		}
	} else {
		if (attachEvent) {
			if (c) {
				c.attachEvent("on" + b, a)
			} else {
				attachEvent("on" + b, a)
			}
		}
	}
}
var clickHeatGroup = "", clickHeatSite = "", clickHeatServer = "", clickHeatLastIframe = -1, clickHeatTime = 0, clickHeatQuota = -1, clickHeatBrowser = "", clickHeatDocument = "", clickHeatWait = 5, clickHeatLocalWait = 0, clickHeatDebug = (document.location.href
		.indexOf("debugclickheat") !== -1);sim_news = "http://news.ifeng.com/"
function showClickHeatDebug(a) {
	if (clickHeatDebug === true) {
		document.getElementById("clickHeatDebuggerSpan").innerHTML = a;
		document.getElementById("clickHeatDebuggerDiv").style.display = "block"
	}
}
function catchClickHeat(o) {
	var p, d, j, i, k, n, m, b, a, v, s, f, r, q, u = false, z = false;
	try {
		showClickHeatDebug("Gathering click data...");
		if (clickHeatQuota === 0) {
			showClickHeatDebug("Click not logged: quota reached");
			return true
		}
		if (clickHeatGroup === "") {
			showClickHeatDebug("Click not logged: group name empty (clickHeatGroup)");
			return true
		}
		if (!o) {
			o = window.event
		}
		p = o.which || o.button;
		d = o.srcElement || null;
		if (p === 0) {
			showClickHeatDebug("Click not logged: no button pressed");
			return true
		}
		if (d !== null && d.tagName.toLowerCase() === "iframe") {
			if (d.sourceIndex === clickHeatLastIframe) {
				showClickHeatDebug("Click not logged: same iframe (a click on iframe opens a popup and popup is closed => iframe gets the focus again)");
				return true
			}
			clickHeatLastIframe = d.sourceIndex
		} else {
			clickHeatLastIframe = -1
		}
		j = o.clientX;
		i = o.clientY;
		k = clickHeatDocument.clientWidth || window.innerWidth;
		n = clickHeatDocument.clientHeight || window.innerHeight;
		a = window.pageXOffset || clickHeatDocument.scrollLeft;
		v = window.pageYOffset || clickHeatDocument.scrollTop;
		m = Math.max(clickHeatDocument.scrollWidth,
				clickHeatDocument.offsetWidth, k);
		b = Math.max(clickHeatDocument.scrollHeight,
				clickHeatDocument.offsetHeight, n);
		if (j > k || i > n) {
			showClickHeatDebug("Click not logged: out of document (should be a click on scrollbars)");
			return true
		}
		j += a;
		i += v;
		if (j < 0 || i < 0 || j > m || i > b) {
			showClickHeatDebug("Click not logged: out of document (should be a click out of the document's body)");
			return true
		}
		s = new Date();
		if (s.getTime() - clickHeatTime < 1000) {
			showClickHeatDebug("Click not logged: at least 1 second between clicks");
			return true
		}
		clickHeatTime = s.getTime();
		if (clickHeatQuota > 0) {
			clickHeatQuota = clickHeatQuota - 1
		}
		q = "s=" + clickHeatSite + "&g=" + clickHeatGroup + "&x=" + j + "&y="
				+ i + "&w=" + k + "&b=" + clickHeatBrowser + "&c=" + p
				+ "&random=" + Date();
		showClickHeatDebug("Ready to send click data...");
		if (clickHeatServer.indexOf("http") !== 0) {
			try {
				z = new ActiveXObject("Msxml2.XMLHTTP")
			} catch (t) {
				try {
					z = new ActiveXObject("Microsoft.XMLHTTP")
				} catch (l) {
					z = null
				}
			}
			if (!z && typeof(XMLHttpRequest) !== "undefined") {
				z = new XMLHttpRequest()
			}
			if (z) {
				if (clickHeatDebug === true) {
					z.onreadystatechange = function() {
						if (z.readyState === 4) {
							if (z.status === 200) {
								showClickHeatDebug("Click recorded at "
										+ clickHeatServer
										+ " with the following parameters:<br/>x = "
										+ j
										+ " ("
										+ (j - a)
										+ "px from left + "
										+ a
										+ "px of horizontal scrolling, max width = "
										+ m
										+ ")<br/>y = "
										+ i
										+ " ("
										+ (i - v)
										+ "px from top + "
										+ v
										+ "px of vertical scrolling, max height = "
										+ b + ")<br/>width = " + k
										+ "<br/>browser = " + clickHeatBrowser
										+ "<br/>click = " + p + "<br/>site = "
										+ clickHeatSite + "<br/>group = "
										+ clickHeatGroup
										+ "<br/><br/>Server answer: "
										+ z.responseText)
							} else {
								if (z.status === 404) {
									showClickHeatDebug("click.php was not found at: "
											+ (clickHeatServer !== ""
													? clickHeatServer
													: "/clickheat/click.php")
											+ " please set clickHeatServer value")
								} else {
									showClickHeatDebug("click.php returned a status code "
											+ z.status
											+ " with the following error: "
											+ z.responseText)
								}
							}
							clickHeatLocalWait = 0;
						}
					}
				}
				//sim = Math.floor(Math.random()*10);
				sim = location.hostname.indexOf('www.ifeng.com')===0?parseInt(Math.random()*100):parseInt(Math.random()*10);
				if (sim === 5)
				{
					z.open("GET", clickHeatServer + "?" + q, true);
					z.send(null);
					
					u = true;					
				}
/*
				z.open("GET", clickHeatServer + "?" + q, true);
				z.send(null);
				u = true
*/
			}
		}
		if (u === false) {
			if (clickHeatDebug === true) {
				showClickHeatDebug("Click recorded at " + clickHeatServer
						+ " with the following parameters:<br/>x = " + (j + a)
						+ " (" + j + "px from left + " + a
						+ "px of horizontal scrolling)<br/>y = " + (i + v)
						+ " (" + i + "px from top + " + v
						+ "px of vertical scrolling)<br/>width = " + k
						+ "<br/>browser = " + clickHeatBrowser
						+ "<br/>click = " + p + "<br/>site = " + clickHeatSite
						+ "<br/>group = " + clickHeatGroup
						+ '<br/><br/>Server answer:<br/><iframe src="'
						+ clickHeatServer + "?" + q
						+ '" width="700" height="60"></iframe>')
			} else {
//				sim = parseInt(Math.random()*10)
				sim = location.hostname.indexOf('www.ifeng.com')===0?parseInt(Math.random()*100):parseInt(Math.random()*10);
				r = new Image();
				if (sim === 5)
				{
					r.src = clickHeatServer + "?" + q;
				}
				
				
			}
		}
		f = new Date();
		clickHeatLocalWait = f.getTime() + clickHeatWait;
		while (clickHeatLocalWait > f.getTime()) {
			f = new Date()
		}
	} catch (g) {
		showClickHeatDebug("An error occurred while processing click (Javascript error): "
				+ g.message)
	}
	return true
}
function initClickHeat() {
	var d, f, a, c, e, g;
	if (clickHeatDebug === true) {
		g = document.createElement("div");
		g.id = "clickHeatDebuggerDiv";
		g.style.padding = "5px";
		g.style.display = "none";
		g.style.position = "absolute";
		g.style.top = "100px";
		g.style.left = "100px";
		g.style.border = "1px solid #888";
		g.style.backgroundColor = "#eee";
		g.style.color = "#a00";
		g.style.zIndex = 99;
		g.innerHTML = '<a href="#" onmouseover="document.getElementById(\'clickHeatDebuggerDiv\').style.display = \'none\'; return false" style="float:right">Rollover to close</a><strong>ClickHeat debug:</strong><br/><br/><span id="clickHeatDebuggerSpan"></span>';
		document.body.appendChild(g)
	}
	if (clickHeatGroup === "" || clickHeatServer === "") {
		showClickHeatDebug("ClickHeat NOT initialised: either clickHeatGroup or clickHeatServer is empty");
		return false
	}
	e = document.location.protocol + "//" + document.location.host;
	if (clickHeatServer.indexOf(e) === 0) {
		clickHeatServer = clickHeatServer.substring(e.length,
				clickHeatServer.length)
	}
	addEvtListener(document, "mousedown", catchClickHeat);
	f = document.getElementsByTagName("iframe");
	for (d = 0; d < f.length; d += 1) {
		addEvtListener(f[d], "focus", catchClickHeat)
	}
	clickHeatDocument = document.documentElement
			&& document.documentElement.clientHeight !== 0
			? document.documentElement
			: document.body;
	a = navigator.userAgent ? navigator.userAgent.toLowerCase().replace(/-/g,
			"") : "";
	c = ["chrome", "firefox", "safari", "msie", "opera"];
	clickHeatBrowser = "unknown";
	for (d = 0; d < c.length; d += 1) {
		if (a.indexOf(c[d]) !== -1) {
			clickHeatBrowser = c[d];
			break
		}
	}
	showClickHeatDebug("ClickHeat initialised with:<br/>site = "
			+ clickHeatSite
			+ "<br/>group = "
			+ clickHeatGroup
			+ "<br/>server = "
			+ clickHeatServer
			+ "<br/>quota = "
			+ (clickHeatQuota === -1 ? "unlimited" : clickHeatQuota)
			+ "<br/>browser = "
			+ clickHeatBrowser
			+ "<br/><br/><strong>Click in a blank area (not on a link) to test ClickHeat</strong>")
};