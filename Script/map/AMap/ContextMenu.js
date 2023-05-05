/**
 * iMap地图组件
 * @module 地图
 * @requires CustomEvent
 */
define(["jquery", "customevent", "gpsconvert"], function ($, CustomEvent, Convert) {
    /**
     * 右键菜单对象
     * @class ContextMenu
     * @constructor
     * @extends CustomEvent
     * @param {AMap} map - 地图对象
     */
    var ContextMenu = function (map) {
        CustomEvent.call(this);
        this._map = map;
        this._init();
    };
    ContextMenu.prototype = {
        _trace: false,
        _init: function () {
            var that = this;
            var contextMenu = new AMap.ContextMenu();
            this._contextmenu = contextMenu;
        },
        _createText: function (config) {
            var htmlStr = '<a class="i-menu-item"><i class="i-icon ' + config.iconCls + '"></i>' + config.text + '</a>';
            return htmlStr;
        },
        /**
         * 打开,触发open事件
         * @method open
         * @param {Position} opt - 经纬度
         */
        open: function (opt) {
            var that = this;
            Convert(opt);
            /**
             * 菜单打开事件
             * @event open
             */
            this._contextmenu.open(this._map, [opt.lng, opt.lat]);
            that.fire("open");
        },
        /**
         * 关闭,触发close事件
         * @method close
         */
        close: function () {
            var that = this;
            this._contextmenu.close();
            /**
             * 菜单关闭事件
             * @event close
             */
            that.fire("close");
        },
        /**
         * 添加子项
         * @method addItem
         * @param {ContextMenuItem} config - 子项配置
         */
        addItem: function (config) {
            this._contextmenu.addItem(this._createText(config), config.fn, config.num);
        },
        /**
         * 移除子项
         * @method removeItem
         * @param {ContextMenuItem} config - 子项配置
         */
        removeItem: function (config) {
            this._contextmenu.addItem(this._createText(config), config.fn);
        },
        /**
         * 获取原生对象
         * @returns {AMap.ContextMenu} 原生地图ContextMenu对象
         */
        getProtogenesis: function () {
            return this._contextmenu;
        }
    };
    $.extend(ContextMenu.prototype, new CustomEvent());
    ContextMenu.prototype.constructor = ContextMenu;
    return ContextMenu;
});