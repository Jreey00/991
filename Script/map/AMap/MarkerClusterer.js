/**
 * @module 聚合
 */
define(["jquery", "customevent"], function ($, CustomEvent) {
    var defaults = {
        minClusterSize: 2,
        maxZoom: 14,
        averageCenter: true
    };
    /**
     * 构造一个聚合对象
     * @class MarkerClusterer
     * @constructor
     * @extends CustomEventy
     * @param {AMap} map - 地图对象
     * @param {Object} opt
     * @param {Number} [opt.minClusterSize] - 聚合的最小数量。默认值为2，即小于2个点则不能成为一个聚合
     * @param {Number} [opt.maxZoom] - 最大地图等级,超过该等级不聚合
     * @param {Array} [opt.styles] - 图标样式,数组
     * @param {String} opt.styles.url - 图标url
     * @param {Size} opt.styles.size - 图标尺寸
     * @param {Pixel} [opt.styles.offset] - 偏移
     * @param {String} [opt.styles.textColor] - 文字颜色,如#ffffff
     * @param {Number} [opt.styles.textSize] - 文字大小
     */
    var MarkerClusterer = function (map, opt) {
        CustomEvent.call(this);
        this._map = map;
        var config = $.extend(true, {}, defaults, opt);
        if (config.styles && config.styles.length) {
            config.styles.forEach(function (style) {
                style.size = new AMap.Size(style.size.width, style.size.height);
                if (style.offset) {
                    style.offset = new AMap.Pixel(style.offset.x, style.offset.y);
                }
                if (style.imageOffset) {
                    style.imageOffset = new AMap.Pixel(style.imageOffset.x, style.imageOffset.y);
                }
            });
        }
        this._init(config);
    };
    MarkerClusterer.prototype = {
        _init: function (opt) {
            var that = this;
            var map = this._map;
            var cluster;
            map.plugin(["AMap.MarkerClusterer"], function () {
                cluster = new AMap.MarkerClusterer(map, [], opt);
                that._cluster = cluster;
            });
        },
        /**
         * 设置单个聚合的最小数量
         * @method setMinClusterSize
         * @param {Number} size - 数量
         */
        setMinClusterSize: function (size) {
            this._cluster.setMinClusterSize(size);
        },
        /**
         * 添加一个需进行聚合的点标记
         * @method addMarker
         * @param {Marker} marker - 点标记
         */
        addMarker: function (marker) {
            this._cluster.addMarker(marker.getProtogenesis());
        },
        /**
         * 添加一组需进行聚合的点标记
         * @method addMarkers
         * @param {Marker[]} markers - 点标记数组
         */
        addMarkers: function (markers) {
            var markersProtogenesis = [];
            for (var i = 0; i < markers.length; i++) {
                markersProtogenesis.push(markers[i].getProtogenesis());
            }
            this._cluster.addMarkers(markersProtogenesis);
        },
        /**
         * 移除点标记
         * @method removeMarker
         * @param {Marker} markers - 点标记
         */
        removeMarker: function (marker) {
            this._cluster.removeMarker(marker.getProtogenesis());
        },
        /**
         * 移除点标记
         * @method removeMarkers
         * @param {Marker[]} markers - 点标记数组
         */
        removeMarkers: function (markers) {
            this._cluster.removeMarkers(markers.map(function (m) { return m.getProtogenesis() }));
        },
        /**
         * 清除所有点标记
         * @method clearMarkers
         */
        clearMarkers: function () {
            this._cluster.clearMarkers();
        },
        /**
         * 设置地图中点标记的最大聚合级别
         * @method setMaxZoom
         * @param {Number} zoom - 级别
         */
        setMaxZoom: function (zoom) {
            this._cluster.setMaxZoom(zoom);
        },
        /**
         * 获取原生对象
         * @returns {AMap.MarkerClusterer} 原生地图MarkerClusterer对象
         */
        getProtogenesis: function () {
            return this._cluster;
        }
    };
    $.extend(MarkerClusterer.prototype, new CustomEvent());
    MarkerClusterer.prototype.constructor = MarkerClusterer;
    return MarkerClusterer;
});