define(["jquery", "customevent", "gpsconvert"], function ($, CustomEvent, Convert) {
    var defaultStyle = {
        strokeColor: "#3366FF",
        strokeOpacity: 1,
        strokeWeight: 5,
        strokeStyle: "solid",
        strokeDasharray: [0, 0, 0]
    };
    /**
     * 构造一个Polyline对象
     * @constructs
     * @param {AMap} map - 地图对象
     * @param {Object} opt
     * @param {Object[]} opt.path - 经纬度数组,例:[{lat:lat, lng: lng}]
     * @param {Object} opt.lineStyle - 折线样式
     * @param {String} opt.lineStyle.strokeColor - 线条颜色
     * @param {String} opt.lineStyle.strokeOpacity - 线条透明度
     * @param {String} opt.lineStyle.strokeWeight - 线条宽
     * @param {String} opt.lineStyle.strokeStyle - 线条样式
     * @param {Number[]} opt.lineStyle.strokeDasharray - 勾勒形状轮廓的虚线和间隙的样式，此属性在strokeStyle 为dashed 时有效
     */
    var Polyline = function (map, opt) {
        this._map = map;
        var config = {};
        $.extend(true, config, opt)
        this._init(config);
    };
    Polyline.prototype = {
        _init: function (opt) {
            var that = this;
            var style = $.extend({}, defaultStyle, opt.lineStyle);
            var lineArr = opt.path.map(function (o) {
                Convert(o);
                return [o.lng, o.lat];
            });
            var polyline = new AMap.Polyline({
                map: this._map,
                path: lineArr,
                strokeColor: style.strokeColor,
                strokeOpacity: style.strokeOpacity,
                strokeWeight: style.strokeWeight,
                strokeStyle: style.strokeStyle,
                strokeDasharray: style.strokeDasharray,
                showDir: style.showDir || false
            });
            this._polyline = polyline;
        },
        setPath: function (path) {
            var lineArr = path.map(function (o) {
                Convert(o);
                return [o.lng, o.lat];
            });
            this._polyline.setPath(lineArr);
        },
        hide: function () {
            this._polyline.hide();
        },
        show: function () {
            this._polyline.show();
        },
        remove: function () {
            this._map.remove(this._polyline);
        },
        /**
         * 获取原生对象
         * @returns {AMap.Polyline} 原生地图Polyline对象
         */
        getProtogenesis: function () {
            return this._polyline;
        }
    };
    return Polyline;
});