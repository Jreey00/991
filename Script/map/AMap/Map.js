/**
 * @module 地图
 */
define(["jquery", "customevent", "async!mapurl", "gpsconvert"], function ($, CustomEvent, _mapurl, Convert) {
    /**
     * <p>基于高德地图的Map对象,可直接操作原始AMap对象</p>
     * <p>不直接实例化,iMap的基类</p>
     * @class Map
     * @constructor
     * @extends CustomEvent
     * @param {String} container - 用于装载地图控件dom元素的id
     * @param {Object} opt
     * @param {Number} opt.level - 地图级别
     * @param {Position} opt.center - 地图中心点
     * @param {String} opt.mapStyle - 地图类型
     * @param {Object} opt.ToolBar - 地图工具栏
     */
    var Map = function (container, opt) {
        CustomEvent.call(this);
        this._init(container, opt);
    };
    Map.prototype = {
        _init: function (container, opt) {
            var that = this;
           
            if (opt.center) {
                Convert(opt.center);
              var lnglat = [opt.center.lng, opt.center.lat];
                opt.center = lnglat;
                opt.showIndoorMap=false;
                opt.zooms=[16,20];
                opt.rotation=58;
                    

                //  opt.zoom=16,
                // opt.pitch=75; // 地图俯仰角度，有效范围 0 度- 83 度
        //     opt.viewMode='3D'; // 地图模式
        opt.resizeEnable=true;//是否监控地图容器尺寸变化
            }
            var map = new AMap.Map(container, opt);
            // map.on('moveend', ()=>{
            //  console.log( map.getCenter(),'1111111111111');  
            // });
            // map.setLimitBounds([125.043513,44.00625],[125.015146,43.987449]);
     		if(opt.ToolBar){
                       map.plugin(["AMap.ToolBar"], function () {
													map.addControl(
														new AMap.ToolBar({
															direction: false
														})
													);
												});
                var myBounds=new AMap.Bounds([125.001905,43.978075],[125.058639,44.015678]);
			// map.setBounds(myBounds);
            map.setLimitBounds(myBounds);
               }
            /**
             * 地图加载完成事件
             * @event complete
             */
            map.on("complete", function () {
                that.fire("complete");
            });
            /**
             * 地图点击事件
             * @event click
             * @param {Object} event
             */
            map.on("click", function (e) {
                var event = {
                    type: "click",
                    pixel: e.pixel,
                    point: e.lnglat,
                    target: that
                };
                that.fire("click", event);
            });
            /**
             * 地图右击事件
             * @event rightclick
             * @param {Object} event
             */
            map.on("rightclick", function (e) {
                var event = {
                    type: "rightclick",
                    pixel: e.pixel,
                    position: e.lnglat,
                    target: that
                };
                that.fire("rightclick", event);
            });
            this._map = map;
        },
        /**
         * 设置地图中心点
         * @method setCenter
         * @param {Object} opt
         * @param {Number} opt.lat - 纬度
         * @param {Number} opt.lng - 经度
         */
        setCenter: function (opt) {
            Convert(opt);
            var lnglat = [opt.lng, opt.lat];
            this._map.setCenter(lnglat);
        },
        /**
         * 获取地图中心点
         * @method getCenter
         * @return {Position} position
         */
        getCenter: function () {
            var position = this._map.getCenter();
            position.needcorrect = false;
            return position;
        },
        /**
         * 设置地图等级
         * @method setZoom
         * @param {Number} level - 等级
         */
        setZoom: function (level) {
            this._map.setZoom(level);
        },
        /**
         * 获取地图等级
         * @method getZoom
         * @return {Number} level
         */
        getZoom: function () {
            return this._map.getZoom();
        },
        /**
         * 设置地图等级和中心点
         * @method setZoomAndCenter
         * @param {Number} level - 等级
         * @param {Position} center - 经纬度
         */
        setZoomAndCenter: function (level, center) {
            Convert(center);
            var lnglat = [center.lng, center.lat];
            this._map.setZoomAndCenter(level, lnglat);
        },
        /**
         * 设置城市
         * @method setCity
         * @param {String} city - 城市
         * @param {Function} callback - 设置成功回调
         */
        setCity: function (city, callback) {
            this._map.setCity(city, callback);
        },
        /**
         * 删除地图上所有的覆盖物
         * @method clearMap
         */
        clearMap: function () {
            this._map.clearMap();
        },
        /**
         * 删除覆盖物
         * @param {(AMap.Marker|AMap.Icon|AMap.Polyline|AMap.Polygon|AMap.Circle|AMap.GroundImage|Array)} overlayers - 一个或多个覆盖物
         */
        _remove: function (overlayers) {
            this._map.remove(overlayers);
        },
        _setFitView: function (overlayList) {
            this._map.setFitView(overlayList);
        },
        /**
         * 设置地图类型
         * @method setLayers
         * @param {String} type - 地图类型：TileLayer（默认）或 Satellite（卫星）
         */
        setLayers: function (type) {
            var arr = [];
            if (type == "Satellite") {
                arr = [new AMap.TileLayer.RoadNet(), new AMap.TileLayer.Satellite()];
            } else {
                arr = [new AMap.TileLayer()];
            }
            if (arr.length) {
                this._map.setLayers(arr);
            }
        },
        getBounds: function () {
            return this._map.getBounds();
        },
        panTo: function (opt) {
            Convert(opt);
            var lnglat = [opt.lng, opt.lat];
            this.map.panTo(lnglat);
        },
        /**
         * 获取原生对象
         * @method getProtogenesis
         * @returns {AMap} 原生地图AMap对象
         */
        getProtogenesis: function () {
            return this._map;
        }
    };
    $.extend(Map.prototype, new CustomEvent());
    Map.prototype.constructor = Map;
    Map.prototype.base = {
        on: Map.prototype.on,
        off: Map.prototype.off
    };
    var mapEvents = ["movestart", "moveend", "zoomchange", "zoomstart", "zoomend"];
    Map.prototype.on = function (event, fn) {
        if (mapEvents.indexOf(event) > -1) {
            this._map.on(event, fn);
        } else {
            this.base.on.call(this, event, fn);
        }
    };
    Map.prototype.off = function (event, fn) {
        if (mapEvents.indexOf(event) > -1) {
            this._map.off(event, fn);
        } else {
            this.base.off.call(this, event, fn);
        }
    };
    return Map;
});