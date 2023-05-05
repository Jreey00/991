/**
 * Circle 圆环进度条
 *
 */
 ;
 (function($, window, document, undefined) {
     'use strict';
     // 默认参数
     var Data = {
         defaults: {
             type: 'circle', //进度条类型，circle（圆环），level（水平）
             bgColor: '#F8F8F8', // 背景颜色#F8F8F8
             cirColor: '#FFAF24', // 进度条颜色
             value: 0, // 百分比值
             total:0,//总数
             textColor: '#0D1F3E', // 字体颜色
             textSize: 20, // 百分比字体大小
             textLeft: 30,  // 水平进度条百分比距离左边的值
             lineCap: 'round', // 进度条末端类型 [可填] 默认:butt (平滑);round (圆形线帽)
             size: 90, // 圆环进度条半径,水平进度条宽度
             lineWidth: 24, // 进度条(圆环：宽度，水平：高度)
             open: 'top', // 进度条开始点 [可填] 默认: top 可选 bottom 、top 、between
             schedule: 0, // 当前动画进度
             speed: 1, //速度
             shadow: false, // 阴影
             centerX: 0, // 中心X
             centerY: 0, // 中心Y
             position: 'center', // 进度条在画布显示位置 (top,center,bottom)
             gradient: false, // 是否开启线性渐变
             startColor: '#ff6600', // 线性渐变开始颜色
             endColor: '#ffd708', // 线性渐变结束颜色
             tips: true, // 是否显示提示文字
             tipsColor: '#f37b1d', // 提示文字颜色
             tipsSize: '24', // 提示文字大小
             tipsText: 0, // 提示文字
             tipsUnit: true, // 是否显示提示文字的单位
             tipsPosition: 'center', //提示文字定位 （top,center,bottom）
             tipsPositionFill: 0, //提示文字位置补位
         }
     };
     // 保存动画，下次重置时，用于清除上一次动画
     var window_raf = {};
     // 插件引擎
     var Engine = {
         // 获取属性设置
         getAttrSettings: function($original) {
             let circle = Data.defaults;
             var data = {};
             $.each(circle, (key, val) => {
                 if ($original.is('[data-' + key + ']')) {
                     var elAttr = $original.attr('data-' + key);
                     if (elAttr === "") { elAttr = circle[key]; }
                     if (elAttr === 'true' || elAttr === 'false') { elAttr = elAttr === 'true'; }
                     if (key === "size") { elAttr = parseInt(elAttr) }
                     if (key === "textSize") { elAttr = parseInt(elAttr) }
                     if (key === "lineWidth") { elAttr = parseInt(elAttr) }
                     data[key] = elAttr;
                 }
             })
             data.id = $($original).attr('id');
             data.canvas = document.getElementById(data.id);
             data.ctx = data.canvas.getContext("2d");
             data.schedule = 0;
             return data;
         },
         // 初始化
         initialize: function($original, userSettings) {
             let self = this;
             var settings = $.extend(true, {}, userSettings),
                 attrSettings = self.getAttrSettings($original);
             settings = $.extend(settings, attrSettings);
             // 如果是水平进度条，计算宽度(解决圆角的兼容问题)
             if (settings.type == 'level') {
                 if (settings.lineCap == 'round') {
                     settings.size = settings.size + settings.textSize * 4 + settings.textLeft;
                     settings.size = settings.size > settings.canvas.width ? settings.size - (settings.size - settings.canvas.width) - settings.lineWidth - settings.textSize * 4 - settings.textLeft : settings.size - settings.lineWidth - settings.textSize * 4 - settings.textLeft
                 }
             }
             // 计算定位信息
             var level_round_num = settings.lineCap == 'round' ? 10 : 0,
                 level_round_width = settings.size + settings.textLeft + settings.textSize * 4 + parseInt(settings.lineCap == 'round' ? settings.lineWidth : 0),
                 level_round_position = (settings.canvas.width - level_round_width) / 2 + level_round_num;
             settings.centerX = settings.type == 'circle' ? settings.canvas.width / 2 : level_round_position;
             switch (settings.position) {
                 case 'top':
                     settings.centerY = settings.type == 'circle' ? settings.size + settings.lineWidth / 2 : settings.lineWidth / 2;
                     break;
                 case 'bottom':
                     settings.centerY = settings.type == 'circle' ? settings.canvas.height - settings.size - settings.lineWidth / 2 : settings.canvas.height - settings.lineWidth / 2;
                     break;
                 default:
                     settings.centerY = settings.canvas.height / 2;
             }
 
             // 防止速度超出最大数值限制
             if (settings.speed >= settings.value) {
                 settings.speed = settings.value / 2;
             }
 
             window.cancelAnimationFrame(window_raf[settings.id])
             var $plutinHtml = Build.build(settings);
             return $plutinHtml;
         },
         // 检查目标
         controlTarget: function($target, controls) {
             // 初始化时是否是canvas
             if ($.inArray('isCanvas', controls) !== -1 && !$target.is('canvas')) {
                 console.error('Circle | initialization failed，Invalid canvas element');
                 console.log($target[0]);
                 return false;
             }
             return true;
         }
     }
     // 创建
     var Build = {
         // 初始化HTML
         build: function(settings) {
             let self = this;
             settings.ctx.clearRect(0, 0, settings.canvas.width, settings.canvas.height);
             // 背景
             self.backdropCircle(settings);
             // 进度条
             if (settings.value !== 0) {
                 self.start(settings);
             }
             // 文字
             self.whiteText(settings);
         },
         // 加载进度条
         start: function(settings) {
             let self = this;
             window.RAF = (function() {
                 return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
                     window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                         window.setTimeout(callback, 1000 / 60);
                     };
             })();
             self.peripheryCircle(settings);
             window_raf[settings.id] = RAF(function() {
                 self.build(settings)
             })
             if (settings.schedule >= settings.value) {
                 window.cancelAnimationFrame(window_raf[settings.id])
                 return
             } else {
                 settings.schedule += parseInt(settings.speed);
                 if (settings.schedule >= settings.value) {
                     settings.schedule = settings.value;
                 }
             }
         },
         // 文字
         whiteText: function(settings) {
             let self = this;
             settings.ctx.save();
             settings.ctx.textAlign = "center";
             settings.ctx.textBaseline = "middle";
             settings.ctx.font = settings.textSize + 'px Arial';
             settings.ctx.fillStyle = settings.textColor;
             if (settings.type == 'circle') {
                 settings.ctx.fillText(settings.total, settings.centerX, settings.centerY +10);
             } else {
                 settings.ctx.fillText(settings.total, settings.size + settings.lineWidth + settings.centerX + settings.textLeft, settings.centerY);
             }
 
             // 是否显示提示文字
             if (settings.tips && settings.type != 'level') {
                 // 设置文字定位信息
                 var tips_position_y = 0;
                 switch (settings.tipsPosition) {
                     case 'top':
                         tips_position_y = settings.centerY - settings.size - settings.tipsPositionFill;
                         break;
                     case 'bottom':
                         tips_position_y = settings.centerY + settings.size + settings.tipsPositionFill;
                         break;
                     default:
                         tips_position_y = settings.centerY -20;
                 }
                 settings.ctx.font = settings.tipsSize + 'px Arial';
                 settings.ctx.fillStyle = settings.tipsColor;
                 settings.ctx.fillText(settings.tipsText, settings.tipsUnit ? settings.centerX - 10 : settings.centerX, tips_position_y+12);
                 // 是否显示提示文字单位
                 if (settings.tipsUnit) {
                     settings.ctx.font = '14px Arial';
                     settings.ctx.fillStyle = '#0D1F3E';
                     settings.ctx.fillText("", settings.centerX + settings.tipsText.toString().length * 6 + 2, tips_position_y );
                 }
             }
             settings.ctx.restore();
         },
         // 背景
         backdropCircle: function(settings) {
             let self = this;
             settings.ctx.save();
             settings.ctx.beginPath();
             settings.ctx.fillStyle = settings.bgColor;
             settings.ctx.strokeStyle = settings.bgColor;
             settings.ctx.lineWidth = settings.lineWidth;
             // 判断进度条类型
             if (settings.type == 'circle') {
                 settings.ctx.arc(settings.centerX, settings.centerY, settings.size, 0, Math.PI * 2, false);
             } else {
                 // 是否添加阴影
                 if (settings.shadow === true) {
                     self.shadow(settings.ctx)
                 }
                 settings.ctx.lineCap = settings.lineCap; // 结束端点样式
                 settings.ctx.moveTo(settings.centerX, settings.centerY);
                 settings.ctx.lineTo(settings.size + settings.centerX, settings.centerY);
             }
             settings.ctx.stroke();
             settings.ctx.closePath();
             settings.ctx.restore();
         },
         // 进度条颜色
         peripheryCircle: function(settings) {
             let self = this;
             settings.ctx.save();
             settings.ctx.beginPath();
             settings.ctx.strokeStyle = settings.cirColor; // 笔触的颜色
             settings.ctx.fillStyle = settings.cirColor; // 绘画的颜色
             settings.ctx.lineWidth = settings.lineWidth; // 线条宽度
             settings.ctx.lineCap = settings.lineCap; // 结束端点样式
             if (settings.type == 'circle') {
                 if (settings.gradient === true) {
                     // 创建线性渐变
                     var vba_grd = settings.ctx.createLinearGradient(settings.centerX - settings.size, settings.centerY - settings.size, settings.centerX + settings.size, settings.centerY + settings.size);
                     vba_grd.addColorStop(0.2, settings.startColor);
                     vba_grd.addColorStop(0.8, settings.endColor);
                     settings.ctx.fillStyle = vba_grd;
                     settings.ctx.strokeStyle = vba_grd;
                     settings.ctx.shadowColor = '#f5f5f5';
                     settings.ctx.shadowBlur = 6;
                     settings.ctx.shadowOffsetX = 2;
                     settings.ctx.shadowOffsetY = 4;
                     settings.ctx.lineWidth = settings.lineWidth;
                 }
                 // 创建弧/曲线
                 settings.ctx.arc(settings.centerX, settings.centerY, settings.size, self.startPiont(settings), self.endPiont(settings), false);
                 // 是否添加阴影
                 if (settings.shadow === true) {
                     self.shadow(settings.ctx)
                 }
             } else {
                 settings.ctx.moveTo(settings.centerX, settings.centerY);
                 settings.ctx.lineTo(parseInt(settings.size) * (settings.schedule * 0.01) + settings.centerX, settings.centerY);
             }
             settings.ctx.stroke();
             settings.ctx.restore();
         },
         // 起始角
         startPiont: function(settings) {
             if (settings.open === 'top') {
                 return -Math.PI * 0.5
             } else if (settings.open === "bottom") {
                 return Math.PI * 0.5
             } else if (settings.open === "between") {
                 return Math.PI * 0.7
             } else {
                 return -Math.PI * 0.5
             }
         },
         // 结束角
         endPiont: function(settings) {
             if (settings.open === 'top') {
                 return Math.PI * (2 * settings.schedule * 0.01) + -Math.PI * 0.5
             } else if (settings.open === "bottom") {
                 return Math.PI * (2 * settings.schedule * 0.01) + Math.PI * 0.5
             } else if (settings.open === "between") {
                 return Math.PI * (2 * settings.schedule * 0.01) + Math.PI * 0.7
             } else {
                 return Math.PI * (2 * settings.schedule * 0.01) + -Math.PI * 0.5
             }
         },
         // 阴影
         shadow: function(ctx) {
             ctx.shadowColor = '#f5f5f5';
             ctx.shadowBlur = 6;
             ctx.shadowOffsetX = 4;
             ctx.shadowOffsetY = 8;
         },
     }
     // 方法操作
     var Methods = {
         // 初始化
         init: function(options) {
             var settings = $.extend(true, {}, Data.defaults, options);
             return this.each(function() {
                 var $original = $(this);
                 if (Engine.controlTarget($original, ['isCanvas'])) {
                     Engine.initialize($original, settings);
                 }
             });
         }
     }
     // 使用插件
     $.fn.Circle = function(options) {
         if (this.length < 1) { return; }
         // 判断是什么操作
         if (Methods[options]) {
             // 传入进来的具有length属性的第一个参数arguments转换为数组，再调用它的slice（截取）方法
             var slicedArguments = Array.prototype.slice.call(arguments, 1);
             return Methods[options].apply(this, slicedArguments);
         } else if (typeof options === 'object' || !options) {
             return Methods.init.apply(this, arguments);
         } else {
             console.error('Circle | Call error');
             console.log(this);
         }
     };
 
 })(jQuery, window, document);