(function () {
	require([
		"jquery",
		"layui",
		"imap",
		"carmarker",
		"URL",
		"iadvancedsearch",
		"websocket",
		"gpsconvert",
		"ajaxglobalconfig",
	], function (
		$,
		layui,
		iMap,
		CarMarker,
		URL,
		iAdvancedSearch,
		wsClient,
		Convert,
		ajaxglobal
	) {
		//引入css
		layui.link("Style/MultiScreenMap.css?v=" + allConfig.urlArgs);

		//九个地图
		var mapArray = [];
		//现在的地图的index
		var nowMapIndex = null;
		//总共有几个地图
		var sumMap = 4;
		var map = {};
		var ifgundong = false;
		var delta = 0;
		//加载html
		function loadTemplateHtml() {
			var template =
				'<div id="maptable" style="width: 100%;height: 100%;">' +
				"{{# for(var i = 0 ; i < d; i++){ }}" +
				"{{# if(d == 2){ }}" +
				"{{# if(i == 2){ }}" +
				"</div>" +
				"{{# } }}" +
				"{{# if(i == 0){ }}" +
				'<div class="layui-row" style="height: 100%;">' +
				"{{# } }}" +
				"{{# } else if(d == 4){ }}" +
				"{{# if(i == 2||i == 4){ }}" +
				"</div>" +
				"{{# } }}" +
				"{{# if(i == 0||i == 2){ }}" +
				'<div class="layui-row" style="height: 50%;">' +
				"{{# } }}" +
				"{{# } else if(d == 9){ }}" +
				"{{# if(i == 3 || i == 6 || i == 9){ }}" +
				"</div>" +
				"{{# } }}" +
				"{{# if(i == 0 || i == 3 || i == 6){ }}" +
				'<div class="layui-row" style="height: 33.33%;">' +
				"{{# } }}" +
				"{{# } }}" +
				"{{# if(d == 2 || d == 4 ){ }}" +
				'<div class="layui-col-xs6" style="height:100%;">' +
				"{{# } }}" +
				"{{# if(d == 9 ){ }}" +
				'<div class="layui-col-xs4" style="height:100%;">' +
				"{{# } }}" +
				'<div id="map_index{{ i }}" class="map_index"></div>' +
				'<button class="layui-btn layui-btn-normal map_btn" onclick="btnSearchCar(\'{{ i }}\')">选择车辆</button>' +
				'<div class="map_div">分屏：{{ i + 1 }}</div>' +
				"</div>" +
				"{{# } }}" +
				"</div>";
			var html = layui.laytpl(template).render(sumMap);
			$("#body").prepend(html);
			loadMap();
		}

		//加载地图
		function loadMap() {
			for (var i = 0; i < sumMap; i++) {
				map = new iMap(document.getElementById("map_index" + i), {
					center: { lng: 116.397531, lat: 39.907704 },
					zoom: 4,
					expandZoomRange: true,
					zooms: [3, 20],
					/*  resizeEnable: true,
					scrollWheel: true, */
				});

				mapArray.push({
					//终端编号
					terminalcode: null,
					//地图对象
					map: map,
					//车辆marker对象
					marker: null,
					//监控数据小窗口对象
					infoWindow: null,
					//车辆数据
					carinfo: null,
					//车辆全部实时数据
					carfullinfo: null,
				});
			}
		}

		//兼容性写法，该函数也是网上别人写的，不过找不到出处了，蛮好的，所有我也没有必要修改了
		//判断鼠标滚轮滚动方向
		if (window.addEventListener)
			//FF,火狐浏览器会识别该方法
			window.addEventListener("DOMMouseScroll", wheel, false);
		window.onmousewheel = document.onmousewheel = wheel; //W3C
		//统一处理滚轮滚动事件
		function wheel(event, zoom) {
			ifgundong = true;
			if (!event) event = window.event;
			if (event.wheelDelta) {
				//IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
				delta = event.wheelDelta / 120;
				if (window.opera) delta = -delta; //因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
			} else if (event.detail) {
				//FF浏览器使用的是detail,其值为“正负3”
				delta = -event.detail / 3;
			}
			if (delta) {
				handle(delta, zoom, ifgundong);
			}
		}
		//上下滚动时的具体处理函数
		function handle(delta, zoom, ifgundong) {
			if (delta < 0) {
				//向下滚动
				if (2 < zoom < 20 && ifgundong) {
					zoom + 1;
				}
			} else {
				//向上滚动
				if (2 < zoom < 20 && ifgundong) {
					zoom - 1;
				}
			}
			return zoom;
		}

		//按钮事件
		function btnEvent() {
			//点击地图上的选择车辆按钮
			btnSearchCar = function (index) {
				nowMapIndex = index;
				layer.open({
					type: 2,
					title: "选择车辆",
					//content: 'SearchCar.html?BottomBtnShow=true&SingleOrMultiple=single',
					content:
						"SearchCar.html?BottomBtnShow=true&SingleOrMultiple=multiple",
					area: ["1000px", "625px"],
					closeBtn: 1,
					shade: 0.5,
					anim: 5,
					resize: false,
				});
			};
		}

		//搜索车辆（SearchCar.html）子页面回调的方法
		function SearchCarPageFunction() {
			//完成选择车辆
			SearchCarPage_Complete = function (data) {
				for (var i = 0; i < data.length; i++) {
					if (nowMapIndex != null) {
						if (mapArray[nowMapIndex].terminalcode) {
							//如果这个地图之前有监控的车辆，先取消监控
							wsClient.send("13#" + mapArray[nowMapIndex].terminalcode);
						}
						var terminalcode = data[i].terminalcode;
						mapArray[nowMapIndex].terminalcode = terminalcode;
						mapArray[nowMapIndex].carinfo = data[i];
						wsClient.send("4#" + terminalcode);
						layer.close(layer.index);
					}
				}
			};
			//关闭
			SearchCarPage_Close = function () {
				layer.close(layer.index);
			};
		}

		//WebSocket触发的事件
		function WebSocketFireEvent() {
			//WebSocket开启
			wsClient.on("open", function (e) {
				if (mapArray) {
					mapArray.forEach(function (item) {
						var terminalCode = item.terminalcode;
						if (typeof terminalCode != "undefined" && terminalCode != null)
							wsClient.send("4#" + terminalCode);
					});
				}
			});
			//WebSocket收到消息
			wsClient.on("message", function (data) {
				var dataJson = JSON.parse(data);
				var dataType = dataJson.t;
				switch (dataType) {
					//基础数据（多个）
					case 6:
					//第一帧数据（多个）
					case 7:
						var resultData = dataJson.d;
						for (var i = 0; i < mapArray.length; i++) {
							for (var k = 0; k < resultData.length; k++) {
								if (mapArray[i].terminalcode == resultData[k].TerminalCode) {
									mapArray[i].carfullinfo = resultData[k];
									InfoWindow.RefreshInfoWindow(i);
									//在这里设置每次鼠标滚轮滑动放缩并且重新设置
									if (!ifgundong) {
										mapArray[i].map.setFitView();
									} else {
										var zoom = handle(
											delta,
											mapArray[i].map.getZoom(),
											ifgundong
										);
										mapArray[i].map.setFitView();
										mapArray[i].map.setZoom(zoom);
									}

									Marker.SetPosition(i);
								}
							}
						}
						break;
				}
			});
		}

		function changeZoom(map) {
			return map.getZoom();
		}

		//车辆Marker方法
		var Marker = {
			//创建Marker对象
			CreateMarker: function (index) {
				var map = mapArray[index].map;
				var opt = mapArray[index].carfullinfo;
				var marker = map.createMarker({
					auto: true,
					lat: opt.Lat,
					lng: opt.Lon,

					isCustom: true, //自定义Marker
					constructor: CarMarker,
					status: {
						isOnline: opt.IsOnline,
						angle: opt.Angle,
						isRunning: opt.IsDriving,
					},
					offset: {
						x: -19,
						y: -19,
					},
				});
				marker.on("click", function () {
					var infoWindow = mapArray[index].infoWindow;
					infoWindow || InfoWindow.InitInfoWindow(index);
					if (infoWindow.getIsOpen()) return;
					InfoWindow.RefreshInfoWindow(index);
					infoWindow.open(map.getProtogenesis(), this.getPosition());

					mapArray[index].map.setFitView();
					mapArray[index].map.setZoom(14);
				});
				return marker;
			},
			//设置车辆Marker位置
			SetPosition: function (index) {
				var opt = mapArray[index].carfullinfo;
				if (opt) {
					if (mapArray[index].marker) {
						mapArray[index].marker.setPosition({
							lat: opt.Lat,
							lng: opt.Lon,
						});
						mapArray[index].marker.setStatus({
							isOnline: opt.IsOnline,
							angle: opt.Angle,
							isRunning: opt.IsDriving,
						});
					} else {
						mapArray[index].marker = this.CreateMarker(index);
					}
				}
			},
		};

		//监控数据的小窗口
		var InfoWindow = {
			//内容模板
			Template:
				"{{# layui.each(d.content, function(index, rowItem){ }}" +
				'<div style="height: 20px;line-height: 20px;margin-left: 10px;">' +
				"{{ rowItem.label }}{{ rowItem.value }}" +
				"</div>" +
				"{{# }); }}",
			//初始化监控数据的小窗口
			InitInfoWindow: function (index) {
				var content = [
					{ label: "车辆编码：", value: mapArray[index].carinfo.carno || "" },
					{ label: "车辆识别码：", value: mapArray[index].carinfo.vin || "" },
					{ label: "终端编号：", value: mapArray[index].terminalcode || "" },
					{ label: "数据时间：", value: "" },
					{ label: "GPS车速：", value: "0km/h" },
					{ label: "GPS里程：", value: "0km" },
				];
				mapArray[index].infoWindow = new AMap.InfoWindow({
					autoMove: true,
					closeWhenClickMap: true,
					size: new AMap.Size(240, 120),
					content: layui.laytpl(this.Template).render({ content: content }),
					offset: new AMap.Pixel(0, -30),
				});
			},
			//刷新监控数据的小窗口
			RefreshInfoWindow: function (index) {
				var infoWindow = mapArray[index].infoWindow;
				if (infoWindow) {
					var content = [
						{ label: "车辆编码：", value: mapArray[index].carinfo.carno || "" },
						{ label: "车辆识别码：", value: mapArray[index].carinfo.vin || "" },
						{ label: "终端编号：", value: mapArray[index].terminalcode || "" },
					];
					var carFullData = mapArray[index].carfullinfo;
					if (carFullData) {
						content.push({
							label: "数据时间：",
							value: carFullData.TravelTime || "",
						});
						content.push({
							label: "GPS车速：",
							value: (carFullData.Speed.toFixed(2) || "0") + "km/h",
						});
						content.push({
							label: "GPS里程：",
							value: (carFullData.Mileage.toFixed(2) || "0") + "km",
						});
					}
					infoWindow.setContent(
						layui.laytpl(this.Template).render({ content: content })
					);
					infoWindow.setPosition(gpsConvert(carFullData));
				} else {
					this.InitInfoWindow(index);
				}
			},
		};

		//经纬度纠偏
		function gpsConvert(data) {
			var newPoint = Convert({ lat: data.Lat, lng: data.Lon });
			return [newPoint.lng, newPoint.lat];
		}

		//分屏单选框
		layui.form.on("radio(fenping)", function (data) {
			sumMap = data.value;
			clear();
			loadTemplateHtml();
		});

		function clear() {
			for (var i = 0; i < mapArray.length; i++) {
				mapArray[i].map.getProtogenesis().clearMap();
				mapArray[i].map.getProtogenesis().destroy();
				delete mapArray[i];
			}
			mapArray.splice(0, mapArray.length);
			$(".maptable").remove();
		}

		$(function () {
			loadTemplateHtml();
			btnEvent();
			SearchCarPageFunction();
			WebSocketFireEvent();
		});
	});
})();
