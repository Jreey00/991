define(["jquery", "layui", "customevent", "gpsconvert"], function (
  $,
  layui,
  CustomEvent,
  Convert
) {
  layui.link("Style/modules/infoWindow.css?v=" + allConfig.urlArgs);
  var emptyImg =
    "data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
  var btnCls = "js-map-infowindow-btn";
  var btnEventAttr = "data-map-infowindow-btn-event";
  var btnEventId = 1;
  var defaults = {
    autoMove: true,
    offset: {
      x: 0,
      y: 0,
    },
  };
  /**
   * 构造一个InfoWindow对象
   * @class InfoWindow
   * @requires jquery
   * @requires customevent
   * @requires gpsconvert
   * @extends CustomEvent
   * @constructor
   * @param {AMap} map - 地图对象
   * @param {InfoWindowOptions} opt
   */
  var InfoWindow = function (map, opt) {
    CustomEvent.call(this);
    this._map = map;
    this._init($.extend(true, {}, defaults, opt));
  };
  InfoWindow.prototype = {
    _init: function (opt) {
      var that = this;
      Convert(opt);
      var infoWindow = new AMap.InfoWindow({
        isCustom: false,
        autoMove: opt.autoMove,
        content: this._initContent(opt),
        position: [opt.lng, opt.lat],
        offset: new AMap.Pixel(opt.offset.x, opt.offset.y),
      });
      /**
       * 内容改变事件
       * @event change
       */
      infoWindow.on("change", function () {
        that.fire("change");
      });
      /**
       * 打开窗口事件
       * @event open
       */
      infoWindow.on("open", function (e) {
        that.fire("open");
      });
      /**
       * 关闭窗口事件
       * @event close
       */
      infoWindow.on("close", function (e) {
        that.fire("close");
      });
      that._infoWindow = infoWindow;
    },
    _initContent: function (opt) {
      var that = this;
      var dom = document.createElement("div");
      dom.className = "i-panel";
      opt.width && (dom.style.width = opt.width);
      that._dom = dom;
      var domFrag = document.createDocumentFragment();
      var header = document.createElement("header");
      header.className = "i-panel-header";
      if (opt.icon) {
        var img = document.createElement("span");
        img.className = "i-icon " + opt.icon;
        // img.src = emptyImg;
        header.appendChild(img);
      }
      if (opt.tools && opt.tools.length) {
        var tool = document.createElement("div");
        tool.style.float = "right";
        opt.tools.forEach(function (t) {
          var ta = document.createElement("a");
          ta.className =
            "i-icon i-panel-header-tool " + t.iconCls + " " + btnCls;
          ta.title = t.tooltip || "";
          ta.setAttribute(btnEventAttr, "btnevent_" + btnEventId);
          that.on("btnevent_" + btnEventId++, t.handler);
          tool.appendChild(ta);
        });
        header.appendChild(tool);
      }
      var title = document.createTextNode(opt.title || "");
      header.appendChild(title);
      that._title = title;
      that._header = header;
      var con = document.createElement("div");
      con.className = "i-info-content";
      that._con = con;
      if (opt.title) {
        this._setTitle(opt.title);
        domFrag.appendChild(header);
      }
      that._setBody(opt.content);
      domFrag.appendChild(con);
      if (opt.buttons && opt.buttons.length) {
        var footer = document.createElement("footer");
        opt.buttons.forEach(function (btnOpt) {
          var button = document.createElement("input");
          button.type = "button";
          button.value = btnOpt.text;
          button.className = "i-info-btn " + btnCls;
          button.setAttribute(btnEventAttr, "btnevent_" + btnEventId);
          that.on("btnevent_" + btnEventId++, btnOpt.handler);
          footer.appendChild(button);
        });
        domFrag.appendChild(footer);
      }
      if (opt.rbar && opt.rbar.length) {
        var rbar = document.createElement("div");
        rbar.className = "i-info-rbar";
        opt.rbar.forEach(function (btnOpt) {
          var $button = $('<a class="i-info-btn ' + btnCls + '"></a>');
          $button.attr(btnEventAttr, "btnevent_" + btnEventId);
          if (btnOpt.iconCls) {
            $button.append('<i class="i-icon ' + btnOpt.iconCls + '"></i>');
          }
          $button.append(btnOpt.text);
          that.on("btnevent_" + btnEventId++, btnOpt.handler);
          rbar.appendChild($button[0]);
        });
        domFrag.appendChild(rbar);
      }
      // if (opt.sw && opt.sw.length) {
      //   var sw = document.createElement("div");
      //   var inp = document.createElement("input");
      //   inp.type = "checkbox";
      //   inp.checked = "checked";
      //   inp.className = "switch switch-anim";
      //   inp.onchange = function () {
      //     if ($(".switch-anim").prop("checked")) {
      //       console.log("选中");
      //     } else {
      //       console.log("没选中");
      //     }
      //   };
      //   sw.appendChild(inp);
      //   domFrag.appendChild(sw);
      // }
      dom.appendChild(domFrag);
      if (allConfig["show"]) {
        var yuanContent = document.createElement("div");
        yuanContent.className = "yuanContent";
        var yuan1 = document.createElement("div");
        var yuan2 = document.createElement("div");
        var yuan3 = document.createElement("div");
        yuan1.className = "yuan yuanActive";
        yuan2.className = "yuan";
        yuan3.className = "yuan";
        yuan1.id = "yuan1";
        yuan2.id = "yuan2";
        yuan3.id = "yuan3";
        if (allConfig["num"] == 1) {
          yuanContent.appendChild(yuan1);
        }
        if (allConfig["num"] == 2) {
          yuanContent.appendChild(yuan1);
          yuanContent.appendChild(yuan2);
        }
        if (allConfig["num"] == 3) {
          yuanContent.appendChild(yuan1);
          yuanContent.appendChild(yuan2);
          yuanContent.appendChild(yuan3);
        }
        dom.appendChild(yuanContent);
        if (yuan1) {
          $(yuan1).bind("click", function () {
            $("#yuan1").addClass("yuanActive");
            $("#yuan2").removeClass("yuanActive");
            $("#yuan3").removeClass("yuanActive");
            allConfig["index"] = 0;
          });
        }
        if (yuan2) {
          $(yuan2).bind("click", function () {
            $("#yuan1").removeClass("yuanActive");
            $("#yuan2").addClass("yuanActive");
            $("#yuan3").removeClass("yuanActive");
            allConfig["index"] = 1;
          });
        }
        if (yuan3) {
          $(yuan3).bind("click", function () {
            $("#yuan1").removeClass("yuanActive");
            $("#yuan2").removeClass("yuanActive");
            $("#yuan3").addClass("yuanActive");
            allConfig["index"] = 2;
          });
        }
      }

      $(dom).on("click", "." + btnCls, function () {
        that.fire(this.getAttribute(btnEventAttr), this);
      });
      return dom;
    },
    _setTitle: function (str) {
      if (str.nodeType == 1) {
        this._title.appendChild(str);
      } else {
        this._title.innerHTML = str;
      }
    },
    _setBody: function (str) {
      this._con.innerHTML = "";
      if (str.nodeType == 1) {
        this._con.appendChild(str);
      } else if (str instanceof Array) {
        if (str.length > 0 && str[0] instanceof Array) {
          var that = this;
          layui.each(str, function (i, fItem) {
            var ul = document.createElement("div");
            layui.each(fItem, function (k, cItem) {
              var li = document.createElement("div");
              li.className = "layui-col-xs6 layui-col-sm6 layui-col-md6";
              var label = document.createElement("div");
              label.innerHTML = cItem.label;
              var span = document.createElement("div");
              span.id = "map_infowindows_span_" + i + "_" + k;
              span.innerHTML = cItem.value;
              li.appendChild(label);
              li.appendChild(span);
              ul.appendChild(li);
            });
            that._con.appendChild(ul);
          });
        } else {
          var ul = document.createElement("div");
          ul.className = "layui-row layui-col-space10";
          ul.style.padding="6px 20px"
          str.forEach(function (o, i) {
            if (o.label == "计划进展：") {
              let arr = [1, 2, 5, 6, 9, 10];
              var li = document.createElement("div");
              li.className = "layui-col-xs6 layui-col-sm6 layui-col-md6";
              var li1 = document.createElement("div");
              li1.style.display = "flex";
              li1.style.width = "100%";
              li1.style.justifyContent = "space-between";
              if (arr.includes(i + 1)) {
                li1.className = "imgDiv";
              } else {
                li1.className = "";
              }
              var label = document.createElement("div");
              label.style.paddingLeft='10px';
              label.innerHTML = o.label;
              var span = document.createElement("div");
              span.style.paddingRight='10px';
              span.style.marginRight='10px';
              span.className = "spanDiv";
              let div1 = document.createElement("div");
              div1.className = "div1";
              let div2 = document.createElement("div");
              div2.className = "div2";
              
              div2.style.width = `${Number(o.value.split('%')[0])}px`;
              let tip = document.createElement("div");
              tip.className="tip"
              tip.innerHTML = o.value;
              span.appendChild(div1);
              span.appendChild(div2);
              span.appendChild(tip);
              li1.appendChild(label);
              li1.appendChild(span);
              li.appendChild(li1);
              ul.appendChild(li);
            } else {
              let arr = [1, 2, 5, 6, 9, 10];
              var li = document.createElement("div");
              li.className = "layui-col-xs6 layui-col-sm6 layui-col-md6";
              var li1 = document.createElement("div");
              li1.style.display = "flex";
              li1.style.width = "100%";
              li1.style.justifyContent = "space-between";
              if (arr.includes(i + 1)) {
                li1.className = "imgDiv";
              } else {
                li1.className = "";
              }
              var label = document.createElement("div");
              label.style.paddingLeft='10px';
              label.innerHTML = o.label;
              var span = document.createElement("div");
              span.style.paddingRight='10px';
              span.style.color='#FED11D';
              // if (o.value && o.value.length > 12) {
              //   span.innerHTML = o.value.substring(0, 12) + "...";
              //   span.title=o.value;
              // } else {
                span.innerHTML = o.value;
              // }
              li1.appendChild(label);
              li1.appendChild(span);
              li.appendChild(li1);
              ul.appendChild(li);
            }
          });
          this._con.appendChild(ul);
        }
      } else {
        this._con.innerHTML = str;
      }
    },
    /**
     * 设置内容
     * @method setContent
     * @param {Object} opt
     * @param {(String|HTMLElement)} opt.title - 窗口标题
     * @param {(String|HTMLElement|Array)} opt.content - 窗口显示内容,Array时子项为{label: "label", value: "value"}形式
     */
    setContent: function (opt) {
      if (opt.title) {
        this._setTitle(opt.title);
      }
      if (opt.content) {
        this._setBody(opt.content);
      }
    },
    /**
     * 获取内容Dom元素
     * @method getContentDom
     * @returns {HTMLElement} Dom元素
     */
    getContentDom: function () {
      return this._dom;
    },
    /**
     * 设置经纬度
     * @method setPosition
     * @param {Position} opt 经纬度
     */
    setPosition: function (opt) {
      Convert(opt);
      this._infoWindow.setPosition([opt.lng, opt.lat]);
    },
    /**
     * 打开
     * @method open
     * @param {Position} [opt] 经纬度,为空时在上次关闭位置打开
     */
    open: function (opt) {
      Convert(opt);
      var position = opt ? [opt.lng, opt.lat] : this._infoWindow.getPosition();
      if (this.getIsOpen()) {
        this._infoWindow.setPosition(position);
      } else {
        this._infoWindow.open(this._map, position);
      }
    },
    /**
     * 关闭
     * @method close
     */
    close: function () {
      this._infoWindow.close();
    },
    /**
     * 获取打开状态
     * @method getIsOpen
     * @returns {Boolean} 是否打开
     */
    getIsOpen: function () {
      return this._infoWindow.getIsOpen();
    },
    /**
     * 获取原生对象
     * @returns {AMap.InfoWindow} 原生地图InfoWindow对象
     */
    getProtogenesis: function () {
      return this._infoWindow;
    },
  };
  $.extend(InfoWindow.prototype, new CustomEvent());
  InfoWindow.prototype.constructor = InfoWindow;
  return InfoWindow;
});
