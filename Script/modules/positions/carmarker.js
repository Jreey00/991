define(["jquery", "marker"], function ($, Marker) {
	var iconUrls = {
		car1: {
			offline:
				allConfig.baseDirectory + "Resource/carIcons/icon_jiaoche_lixian.png",
			running:
				allConfig.baseDirectory + "Resource/carIcons/icon_jiaoche_xingshi.png",
			stop:
				allConfig.baseDirectory + "Resource/carIcons/icon_jiaoche_tingzhi.png",
			dataTransfer:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_jiaoche_shujuchuanshu.png", //数据传输
			OND:
				allConfig.baseDirectory + "Resource/carIcons/icon_jiaoche_ondang.png", //ON档停车
			idle:
				allConfig.baseDirectory + "Resource/carIcons/icon_jiaoche_daishu.png", //怠数
			Equipment:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_jiaoche_shebeidiaodian.png", //设备掉电
			outages:
				allConfig.baseDirectory + "Resource/carIcons/icon_jiaoche_duandian.png", //断电
			dormancy:
				allConfig.baseDirectory + "Resource/carIcons/icon_jiaoche_xiumian.png", //休眠
		},
		car2: {
			offline:
				allConfig.baseDirectory + "Resource/carIcons/icon_keche_lixian.png",
			running:
				allConfig.baseDirectory + "Resource/carIcons/icon_keche_xingshi.png",
			stop:
				allConfig.baseDirectory + "Resource/carIcons/icon_keche_tingzhi.png",
			dataTransfer:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_keche_shujuchuanshu.png", //数据传输
			OND: allConfig.baseDirectory + "Resource/carIcons/icon_keche_ondang.png", //ON档停车
			idle: allConfig.baseDirectory + "Resource/carIcons/icon_keche_daishu.png", //怠数
			Equipment:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_keche_shebeidiaodian.png", //设备掉电
			outages:
				allConfig.baseDirectory + "Resource/carIcons/icon_keche_duandian.png", //断电
			dormancy:
				allConfig.baseDirectory + "Resource/carIcons/icon_keche_xiumian.png", //休眠
		},
		car3: {
			offline:
				allConfig.baseDirectory + "Resource/carIcons/icon_xiehuoche_lixian.png",
			running:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_xiehuoche_xingshi.png",
			stop:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_xiehuoche_tingzhi.png",
			dataTransfer:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_xiehuoche_shujuchuanshu.png", //数据传输
			OND:
				allConfig.baseDirectory + "Resource/carIcons/icon_xiehuoche_ondang.png", //ON档停车
			idle:
				allConfig.baseDirectory + "Resource/carIcons/icon_xiehuoche_daishu.png", //怠数
			Equipment:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_xiehuoche_shebeidiaodian.png", //设备掉电
			outages:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_xiehuoche_duandian.png", //断电
			dormancy:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_xiehuoche_xiumian.png", //休眠
		},
		sanjiao: {
			offline:
				allConfig.baseDirectory + "Resource/carIcons/icon_yunxing_lixian.png",
			running:
				allConfig.baseDirectory + "Resource/carIcons/icon_yunxing_xingshi.png",
			stop:
				allConfig.baseDirectory + "Resource/carIcons/icon_yunxing_tingzhi.png",
			dataTransfer:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_yunxing_shujuchuanshu.png", //数据传输
			OND:
				allConfig.baseDirectory + "Resource/carIcons/icon_yunxing_ondang.png", //ON档停车
			idle:
				allConfig.baseDirectory + "Resource/carIcons/icon_yunxing_daishu.png", //怠数
			Equipment:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_yunxing_shebeidiaodian.png", //设备掉电
			outages:
				allConfig.baseDirectory + "Resource/carIcons/icon_yunxing_duandian.png", //断电
			dormancy:
				allConfig.baseDirectory + "Resource/carIcons/icon_yunxing_xiumian.png", //休眠
		},
		kache1: {
			offline:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_qianyinche_lixian.png",
			running:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_qianyinche_xingshi.png",
			stop:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_qianyinche_tingzhi.png",
			dataTransfer:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_qianyinche_shujuchuanshu.png", //数据传输
			OND:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_qianyinche_ondang.png", //ON档停车
			idle:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_qianyinche_daishu.png", //怠数
			Equipment:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_qianyinche_shebeidiaodian.png", //设备掉电
			outages:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_qianyinche_duandian.png", //断电
			dormancy:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_qianyinche_xiumian.png", //休眠
		},
	};
	var template =
		'<div class="i-marker-icon">' +
		'<img class="js-angle js-icon" src="' +
		iconUrls.car1.running +
		'">' +
		'<i class="js-group" style="width:10px;height:10px;border-radius:50%;position: absolute;top:15px;left:14px;background-color:rgba(255, 0, 0, 0);display: inline-block"></i>' +
		"</div>";
	var defaults = {
		status: {
			angle: 0,
			isOnline: true,
			isRunning: true,
		},
	};
	/**
	 * 构造一个CarMarker对象,继承至Marker
	 * @description 车辆图标不是单一图片,比较复杂,车辆方向需要选择内部箭头方向
	 * @constructs
	 * @extends {Marker} 寄生组合式继承
	 */
	var CarMarker = function (map, opt) {
		var config = $.extend(true, {}, defaults, opt);
		Marker.call(this, map, config);
		var $root = $(template);
		this._dom = this._dom || {};
		this._dom._$root = $root;
		this._dom._$angle = $root;
		this._dom._$group = $($root.find(".js-group")[0]);
		this._dom._icon = $root.find(".js-icon")[0];
		this._status = config.status;
		this._icon =
			opt.carType == "牵引车"
				? "kache1"
				: opt.carType == "轿车"
				? "car1"
				: opt.carType == "客车"
				? "car2"
				: opt.carType == "载货车"
				? "car3"
				: opt.carType == "待定"
				? "sanjiao"
				: "kache1";
		this.setStatus();
		this.setContent($root[0]);
	};
	inheritPrototype(CarMarker, Marker);
	CarMarker.prototype._isonline = true;
	/**
	 * 设置图标状态
	 */
	CarMarker.prototype.setStatus = function (status) {
		$.extend(this._status, status);
		if (this._status.isOnline) {
			if (this._status.isRunning) {
				this._dom._icon.src = iconUrls[this._icon].running;
			} else {
				this._dom._icon.src = iconUrls[this._icon].stop;
			}
		} else {
			this._dom._icon.src = iconUrls[this._icon].offline;
		}
		this.setAngle(this._status.angle);
	};
	/**
	 * 设置角度
	 * @description 设置旋转角度,重写默认旋转方法,只旋转内部的箭头
	 * @param {Number} angle - GPS方向
	 */
	CarMarker.prototype.setAngle = function (angle) {
		this._dom._$angle.css("transform", "rotateZ(" + angle + "deg)");
	};
	/**
	 * 设置分组
	 * @param {Number} color - 分组颜色
	 */
	CarMarker.prototype.setGroup = function (color) {
		this._dom._$group.css("background-color", color);
	};
	/**
	 * 切换显示图片
	 */
	CarMarker.prototype.setIcon = function (icon) {
		this._icon = icon;
		this.setStatus(this._status);
	};
	/**
	 * 寄生组合式继承
	 * @description 实现继承
	 * @example
	 * var A = function(){};
	 * var B = function(){A.call(this);};
	 * inheritPrototype(B,A);
	 * @param {class} subType 子类
	 * @param {class} superType 父类
	 */
	function inheritPrototype(subType, superType) {
		//创建父类原型的一个副本 等同于使用Object.create(superType.prototype)
		var prototype = Object.create(superType.prototype);
		//为副本添加constructor属性,弥补重写原型而失去的constructor属性
		prototype.constructor = subType;
		//将创建的对象(副本)赋值给子类的原型
		subType.prototype = prototype;
	}
	return CarMarker;
});
