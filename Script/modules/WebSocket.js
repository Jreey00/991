define(["jquery", "layui", "customevent"], function ($, layui, CustomEvent) {
	var ws = function () {
		CustomEvent.call(this);
		this._init(allConfig.wslocation);
	};
	ws.prototype = {
		//浏览器是否支持WebSocket
		isSupport: true,
		_ws: null,
		_init: function (wslocation) {
			var me = this;
			var wsImpl = window.WebSocket || window.MozWebSocket;
			if (!wsImpl) {
				me.isSupport = false;
				layer.msg("您的浏览器不支持WebSocket，请换个浏览器再试！", {
					icon: 2,
					time: 3 * 1000,
				});
				return;
			}
			var ws;
			ws = new wsImpl(wslocation);
			ws.onmessage = function (msgEvent) {
				me.fire("message", msgEvent.data);
			};
			ws.onopen = function (e) {
				me.fire("open", e);
			};
			ws.onclose = function (e) {
				me._init(wslocation);
			};
			me._ws = ws;
		},
		send: function (msg) {
			if (this._ws && this._ws.readyState == WebSocket.OPEN) {
				this._ws.send(msg);
			}
		},
	};
	$.extend(ws.prototype, new CustomEvent());
	return new ws();
});
