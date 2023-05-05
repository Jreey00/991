define(["jquery", "layui"], function ($, layui) {
	/**
	 * hoverTips
	 * @class hoverTips
	 * @param {Object} opt
	 * @param {(String)} opt.id - 渲染对象ID
	 * @param {(String)} opt.content - 内容
	 */
	var hoverTips = function (opt) {
		this._init(opt);
	};
	hoverTips.prototype = {
		_init: function (opt) {
			if (opt.id) {
				var optElement;
				if (opt.id.nodeType && opt.id.nodeType == 1) optElement = opt.id;
				else optElement = $("#" + opt.id);
				var index;
				if (optElement instanceof HTMLElement) optElement = $(optElement);
				optElement.hover(
					function () {
						index = layer.tips(opt.content, "#" + opt.id);
					},
					function () {
						// if (index)
						//     layer.close(index);
						layer.close(layer.index);
					}
				);
			}
		},
	};
	return hoverTips;
});
