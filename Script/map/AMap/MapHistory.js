/**
 * @module 地图
 */
define(["jquery", "customevent", "marker", "polyline", "infowindow"], function ($, CustomEvent, Marker, Polyline, InfoWindow) {
    var speed = 500;
    /**
     * MapHistory对象
     * @class MapHistory
     * @constructor
     * @extends CustomEvent
     * @param {AMap} map - 地图对象
     * @param {Object} opt
     * @param {(Object|String)} [opt.icon] - 点标记图标
     * @param {Object[]} [opt.path] - 经纬度数组,例:[{lat:lat, lng: lng}]
     * @param {LineStyle} [opt.lineStyle] - 折线样式
     */
    var History = function (map, opt) {
        CustomEvent.call(this);
        this._map = map;
        this._init(opt);
    };
    History.prototype = {
        _init: function (opt) {
            this.speed = 1000;
            this._opt = opt;
            this._path = opt.path || [];
            this._running = false;
            this._pause = true;
            this._progress = 0;
            this._max = this._path.length;
            this._initPolyline();
            this._initMarker();
        },
        _initMarker: function () {
            var me = this;
            var opt = me._opt;
            var path = me._path;
            if (path.length) {
                var first = path[0];
                if (!me._marker) {
                    var marker = opt.marker || new Marker(me._map, {
                        lat: first.lat,
                        lng: first.lng,
                        icon: opt.icon,
                        offset: opt.offset
                    });
                    me._marker = marker;
                }
                me._marker.setPosition(first);
            }
        },
        _initPolyline: function () {
             var opt = this._opt;
            var path = this._path;
            var cache = this._opt.cacheData
            var polyline = null;
            this._polyline = [];
            if (path != null && path.length > 0) {
             for(var i=0;i<path.length;i++){
             if(cache[i].speed>=0&&cache[i].speed<=30){
                 opt.lineStyle.strokeColor = "#42E5E3"
                polyline = new Polyline(this._map, {
                    lineStyle: opt.lineStyle,
                    path: [path[i],path[i+1]]
                });
             }else if(cache[i].speed>30&&cache[i].speed<=60){
                opt.lineStyle.strokeColor = "#30ACFF"
               polyline = new Polyline(this._map, {
                   lineStyle: opt.lineStyle,
                   path: [path[i],path[i+1]]
               });
            }else if(cache[i].speed>60&&cache[i].speed<=90){
                opt.lineStyle.strokeColor = "#BA70FF"
               polyline = new Polyline(this._map, {
                   lineStyle: opt.lineStyle,
                   path: [path[i],path[i+1]]
               });
            }else if(cache[i].speed>90&&cache[i].speed<=120){
                opt.lineStyle.strokeColor = "#FFBF50"
               polyline = new Polyline(this._map, {
                   lineStyle: opt.lineStyle,
                   path: [path[i],path[i+1]]
               });
            }else{
                opt.lineStyle.strokeColor = "#FF6464"
                polyline = new Polyline(this._map, {
                    lineStyle: opt.lineStyle,
                    path: [path[i],path[i+1]]
                });
            }
            this._polyline.push(polyline);
            }
        }
        },
        //销毁折线
        _clearPolyline: function () {
              if (this._polyline) {
                this._polyline.forEach((item)=>{
                item.remove();
                delete item;
                })
            }
        },
        /**
         * 移动到下一个点
         * @param {Number} index 当前点的索引.
         */
        _moveNext: function () {
            var me = this;
            if (me._progress < me._max - 1) {
                me._progress++;
                me._marker.setPosition(me._path[me._progress]);
                me._marker.setAngle(me._path[me._progress].angle);
                me.fire("running", me._progress + 1, me._max);
                me._timeoutFlag = setTimeout(function () {
                    me._moveNext();
                }, me.speed);
            } else {
                this._running = false;
                this.fire("end");
            }
        },
        //销毁
        _clearTimeout: function () {
            clearTimeout(this._timeoutFlag);
        },
        setSpeed: function (value) {
            this.speed = value;
        },
        draw: function (path) {
            this.clear();
            this._path = path || [];
            this._max = this._path.length;
            this._clearPolyline();
            this._initPolyline();
            this._initMarker();
        },
        clear: function () {
            this._path = [];
            this._max = 0;
            this._clearPolyline();
            this._clearTimeout();
        },
        start: function () {
            if (!this._running) {
                this._progress = 0;
                this._marker.setPosition(this._path[this._progress]);
                this._marker.setAngle(this._path[this._progress].angle);
                this._moveNext();
                this._running = true;
                this._pause = false;
                this.fire("start");
            }
        },
        pause: function () {
            if (this._running) {
                this._clearTimeout();
                this._pause = true;
                this.fire("pause", this._progress);
            }
        },
        resume: function () {
            if (this._running) {
                this._pause = false;
                this._moveNext();
                this.fire("resume");
            }
        },
        stop: function () {
            if (this._running) {
                this._running = false;
                this._clearTimeout();
                this._marker.setPosition(this._path[0]);
                this._marker.setAngle(this._path[0].angle);
            }
        },
        /**
         * 设置轨迹回放进度
         * @method setProgress
         * @param {Number} i - 进度,范围:[0,path.length(路径长度)-1]
         */
        setProgress: function (i) {
            i = ~~i;//强制转换成整数
            i = i < 0 ? 0 : i;
            i = i >= this._max ? (this._max - 1) : i;
            this._progress = i;
            this._marker.setPosition(this._path[this._progress]);
            this._marker.setAngle(this._path[this._progress].angle);
            i > 0;
        },
        /**
         * 获取轨迹回放进度
         * @method getProgress
         * @returns {Number} 当前进度
         */
        getProgress: function () {
            return this._progress;
        },
        getMax: function () {
            return this._max;
        },
        /**
         * 销毁
         * @method destroy
         */
        destroy: function () {
            this._clearTimeout();
            this._clearPolyline();
        }
    };
    $.extend(History.prototype, new CustomEvent());
    History.prototype.constructor = History;
    return History;
});