/**
 * @module 地图
 */
define(["jquery", "customevent", "gpsconvert"], function ($, CustomEvent, Convert) {
    var defaultStyle = {
        strokeColor: "#00A", //线颜色
        strokeOpacity: 1,       //线透明度
        strokeWeight: 2,        //线宽
        strokeStyle: "solid",   //线样式
        strokeDasharray: [0, 0, 0] //补充线样式
    };
    var defaults = {
        auto: true, //是否自动添加到地图
        lineStyle: defaultStyle,
        content: null,
        offset: {
            x: 0,
            y: 0
        }
    };
    /**
     * 构造一个Marker对象
     * @class Marker
     * @requires jquery
     * @requires customevent
     * @requires gpsconvert
     * @extends CustomEvent
     * @constructor
     * @param {AMap} map - 地图对象
     * @param {Object} opt
     * @param {Number} opt.lng
     * @param {Number} opt.lat
     * @parma {Boolean} [opt.auto=true] - 自动添加到地图
     * @param {(Object|String)} [opt.icon] - 图标
     * @param {Object} [opt.offset] - 偏移量,如:{x:-10,y:-34}
     * @param {Boolean} [opt.trace] - 是否跟踪,为true时会在Marker经过的地方绘制一条折线
     * @param {LineStyle} [opt.lineStyle] - 折线样式,跟踪时有效,参考Polyline参数
     */
    var Marker = function (map, opt) {
        CustomEvent.call(this);
        this._map = map;
        var config = $.extend(true, {}, defaults, opt)
        this._lineStyle = config.lineStyle;
        this._init(config);
    };
    Marker.prototype = {
        _trace: false,
        _init: function (opt) {
            var that = this;
            Convert(opt);
            var markerOptions = {
                position: [opt.lng, opt.lat],
                offset: new AMap.Pixel(opt.offset.x, opt.offset.y),
                content: opt.content,
                visible: (opt.visible == null || typeof (opt.visible) == "undefined") ? true : opt.visible,
                autoRotation: (opt.autoRotation == null || typeof (opt.autoRotation) == "undefined") ? false : opt.autoRotation
            }
            if (opt.auto) {
                markerOptions.map = that._map;
            }
            if (opt.icon) {
                markerOptions.icon = opt.icon;
            }
            var marker = new AMap.Marker(markerOptions);
            /**
             * 点击事件
             * @event click
             * @param {Object} event
             */
            marker.on("click", function (e) {
                var event = {
                    type: "click",
                    pixel: e.pixel,
                    position: e.lnglat,
                    target: that
                };
                that.fire("click", event);
            });
            /**
             * 右击事件
             * @event rightclick
             * @param {Object} event
             */
            marker.on("rightclick", function (e) {
                var event = {
                    type: "rightclick",
                    pixel: e.pixel,
                    position: e.lnglat,
                    target: that
                };
                that.fire("rightclick", event);
            });
            /**
             * 点标记执行moveTo动画结束时触发事件，也可以由moveAlong方法触发
             * @event moveend
             */
            marker.on("moveend", function () {
                that.fire("moveend");
            });
            /**
             * 点标记执行moveAlong动画一次后触发事件
             * @event moveend
             */
            marker.on("movealong", function () {
                that.fire("movealong");
            });
            this._marker = marker;
            this.setTrace(!!opt.trace);
        },
        _initTraceLine: function () {
            var position = this._marker.getPosition();
            var lineArr = [position];
            var polyline = new AMap.Polyline({
                map: this._map,
                path: lineArr,
                strokeColor: this._lineStyle.strokeColor,  //线颜色
                strokeOpacity: this._lineStyle.strokeOpacity,     //线透明度
                strokeWeight: this._lineStyle.strokeWeight,      //线宽
                strokeStyle: this._lineStyle.strokeStyle,
                strokeDasharray: this._lineStyle.strokeDasharray
            });
            this._traceLineArr = lineArr;
            this._tracePolyline = polyline;
        },
        _destroyTraceLine: function () {
            if (this._traceLineArr) {
                this._map.remove(this._tracePolyline);
                delete this._traceLineArr;
                delete this._tracePolyline;
            }
        },
        _drawTraceLine: function (lnglat) {
            if (this._trace) {
                this._traceLineArr.push(lnglat);
                this._tracePolyline.setPath(this._traceLineArr);
            }
        },
        /**
         * 获取跟踪状态
         * @method getTrace
         * @returns {Boolean} 返回当前标记是否处于跟踪状态
         */
        getTrace: function () {
            return this._trace;
        },
        /**
         * 设置跟踪状态
         * @method setTrace
         * @param {Boolean} trace - 设置点标记跟踪状态
         */
        setTrace: function (trace) {
            if (this._trace != !!trace) {
                this._trace = !!trace;
                if (this._trace) {
                    this._initTraceLine();
                } else {
                    this._destroyTraceLine();
                }
            }
        },
        /**
         * 设置点标记坐标
         * @method setPosition
         * @param {Position} opt - 经纬度
         */
        setPosition: function (opt) {
            Convert(opt);
            var lnglat = [opt.lng, opt.lat];
            this._drawTraceLine(lnglat);
            this._marker.setPosition(lnglat);
        },
        /**
         * 获取点标记坐标
         * @method getPosition
         * @returns {Position} position - 经纬度
         */
        getPosition: function () {
            var position = this._marker.getPosition();
            return position;
        },
        getMap: function () {
            if (this._marker.getMap()) {
                return this._map;
            } else {
                return null;
            }
        },
        /**
         * 设置点标记的旋转角度
         * @method setAngle
         * @param {Number} angle - 旋转角度
         */
        setAngle: function (angle) {
            this._marker.setAngle(angle);
        },
        setIcon: function (icon) {
            this._marker.setIcon(icon);
        },
        setContent: function (content) {
            this._marker.setContent(content);
        },
        getContent: function () {
            this._marker.getContent();
        },
        getContentDom: function () {
            this._marker.getContentDom();
        },
        /**
         * 隐藏
         * @method hide
         */
        hide: function () {
            this._marker.hide();
        },
        /**
         * 显示
         * @method show
         */
        show: function () {
            this._marker.show();
        },
        /**
         * 设置点的动画效果
         * @method setAnimation
         * @param {String} animate - 动画名称.NONE:无效果;DROP:掉落效果;BOUNCE:弹跳效果
         */
        setAnimation: function (animate) {
            this._marker.setAnimation("AMAP_ANIMATION_" + animate);
        },
        /**
         * 从地图上移除
         * @method remove
         */
        remove: function () {
            this.setTrace(false);
            this._map.remove(this._marker);
        },
        /**
         * 以给定速度移动点标记到指定位置
         * @method moveTo
         * @param {Object} opt - 配置参数
         * @param {Number} opt.lng - 经度
         * @param {Number} opt.lat - 纬度
         * @param {Number} [opt.speed] - 指定速度,单位:千米/小时,默认为0
         */
        moveTo: function (opt) {
            Convert(opt);
            var lnglat = [opt.lng, opt.lat];
            this._drawTraceLine(lnglat);
            this._marker.moveTo(lnglat, opt.speed || 0);
        },
        /**
         * 以指定的速度，点标记沿指定的路径移动
         * @method moveAlong
         * @param {Object} opt - 配置参数
         * @param {Position[]} opt.path - 路径坐标数组
         * @param {Number} [opt.speed] - 指定速度,单位:千米/小时
         */
        moveAlong: function (opt) {
            this._path = opt.path.map(function (p) {
                Convert(p);
                return [p.lng, p.lat];
            });
            this._marker.moveTo(this._path, opt.speed || 0);
        },
        /**
         * 暂停移动
         * @method pauseMove
         */
        pauseMove: function () {
            this._marker.pauseMove();
        },
        /**
         * 继续移动
         * @method resumeMove
         */
        resumeMove: function () {
            this._marker.resumeMove();
        },
        /**
         * 停止移动
         * @method stopMove
         */
        stopMove: function () {
            this._marker.stopMove();
        },
        /**
         * 触发click事件
         * @method click
         */
        click: function () {
            this.fire("click");
        },
        /**
         * 获取原生对象
         * @returns {AMap.Marker} 原生地图Marker对象
         */
        getProtogenesis: function () {
            return this._marker;
        }
    };
    $.extend(Marker.prototype, new CustomEvent());
    Marker.prototype.constructor = Marker;
    return Marker;
});