﻿/**
 * @module 地图
 */
define(["jquery", "customevent", "map", "marker", "infowindow", "polyline", "maphistory", "markerclusterer", "contextmenu"],
    function ($, CustomEvent, Map, Marker, InfoWindow, Polyline, MapHistory, MarkerClusterer, ContextMenu) {
        /**
         * 构造一个iMap对象,继承至Map,扩展常用方法,不直接操作原始map对象
         * @class iMap
         * @extends Map
         * @constructor
         * @demo imap/imap.html
         * @param {String} container - 用于装载地图控件dom元素的id
         * @param {Object} opt
         * @param {Number} opt.level - 地图级别
         * @param {Position} opt.center - 地图中心点
         * @param {String} opt.mapStyle - 地图类型
         * @param {Object} opt.ToolBar - 地图工具栏
         */
        var iMap = function (container, opt) {
            Map.call(this, container, opt);
            if (opt && opt.listeners) {
                for (var event in opt.listeners) {
                    this.on(event, opt.listeners[event]);
                }
            }
        };

        inheritPrototype(iMap, Map);

        /**
         * 创建一个Marker点标记
         * @method createMarker
         * @demo imap/imap-marker.html
         * @param {Object} opt
         * @param {Boolean} opt.isCustom - 是否为自定义Marker
         * @param {Class} [opt.constructor] - 使用自定义Marker时需指定构造函数
         * @return {Marker}
         */
        iMap.prototype.createMarker = function (opt) {
            var marker;
            if (opt.isCustom) {
                marker = new opt.constructor(this.getProtogenesis(), opt);
            } else {
                marker = new Marker(this.getProtogenesis(), opt);
            }
            return marker;
        };

        /**
         * 创建一个InfoWindow信息窗口
         * @method createInfoWindow
         * @param {InfoWindowOptions} opt
         * @return {InfoWindow} InfoWindow
         */
        iMap.prototype.createInfoWindow = function (opt) {
            return new InfoWindow(this.getProtogenesis(), opt);
        };

        /**
         * 创建一个Polyline折线
         * @method createPolyline
         * @param {Object} opt
         * @return {Polyline} Polyline
         */
        iMap.prototype.createPolyline = function (opt) {
            return new Polyline(this.getProtogenesis(), opt);
        };

        /**
         * 创建一个MapHistory地图轨迹
         * @method createMapHistory
         * @param {Object} opt
         * @return {MapHistory}
         */
        iMap.prototype.createMapHistory = function (opt) {
            return new MapHistory(this.getProtogenesis(), opt);
        };

        /**
         * 创建一个MarkerClusterer聚合
         * @method createMarkerClusterer
         * @param {Object} opt
         * @return {MarkerClusterer}
         */
        iMap.prototype.createMarkerClusterer = function (opt) {
            return new MarkerClusterer(this.getProtogenesis(), opt);
        };

        /**
         * 创建一个ContextMenu右键菜单
         * @method createContextMenu
         * @return {ContextMenu}
         */
        iMap.prototype.createContextMenu = function (opt) {
            return new ContextMenu(this.getProtogenesis(), opt);
        };

        /**
         * 删除覆盖物
         * @method remove
         * @param {(Marker|Polyline|Array)} overlayers - 一个或多个覆盖物
         */
        iMap.prototype.remove = function (overlayers) {
            if (overlayers instanceof Array) {
                overlayers.length && this._remove(overlayers.map(function (o) {
                    o instanceof Marker && o.setTrace(false);
                    return o.getProtogenesis();
                }));
            } else {
                overlayers instanceof Marker && overlayers.setTrace(false);
                this._remove(overlayers.getProtogenesis());
            }
        };

        /**
         * 根据地图上添加的覆盖物分布情况，自动缩放地图到合适的视野级别，参数overlayList默认为当前地图上添加的所有覆盖物图层
         * @method setFitView
         * @param {Array} [overlayers] - 覆盖物集合
         */
        iMap.prototype.setFitView = function (overlayers) {
            if (overlayers) {
                if (overlayers instanceof Array) {
                    overlayers.length && this._setFitView(overlayers.map(function (o) {
                        return o.getProtogenesis();
                    }));
                } else {
                    this._setFitView(overlayers.getProtogenesis());
                }
            } else {
                this._setFitView();
            }
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
            var prototype = Object(superType.prototype);
            prototype.constructor = subType;
            subType.prototype = prototype;
        }

        return iMap;
    });