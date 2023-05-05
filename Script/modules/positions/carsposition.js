define([
	"jquery",
	"mymap",
	"carmarker",
	"customevent",
	"websocket",
	"URL",
], function ($, MyMap, CarMarker, CustomEvent, wsClient, URL) {
	//监控数据的小窗口
	var infoWindow;
	//车辆定位
	var carMarkers = { length: 0 };
	//车辆聚合
	var cluImgDir = allConfig.baseDirectory + "Resource/icon/Clusterer/";
	var Clusterer = MyMap.createMarkerClusterer({
		maxZoom: 16,
		styles: [
			{
				url: cluImgDir + "m1.png",
				size: { width: 35, height: 35 },
				offset: { x: -18, y: -18 },
				textColor: "#003B90",
			},
			{
				url: cluImgDir + "m2.png",
				size: { width: 45, height: 45 },
				offset: { x: -23, y: -23 },
				textColor: "#003B90",
			},
			{
				url: cluImgDir + "m3.png",
				size: { width: 54, height: 54 },
				offset: { x: -27, y: -27 },
				textColor: "#003B90",
			},
			{
				url: cluImgDir + "m4.png",
				size: { width: 62, height: 62 },
				offset: { x: -31, y: -31 },
				textColor: "#003B90",
			},
			{
				url: cluImgDir + "m5.png",
				size: { width: 76, height: 76 },
				offset: { x: -38, y: -38 },
				textColor: "#003B90",
			},
		],
	});
	//车辆试验信息
	// var resultDatas = [
	// 	{
	// 		accountNum: "2022KKXSY000184",
	// 		state: 48,
	// 		testType: "可靠性试验",
	// 		ground: "强化坏路",
	// 		startTime: "2022-05-02 00:00:00",
	// 		endTime: "2022-06-30 23:59:59",
	// 		applyName: "尤晓明",
	// 		company: "商用车开发院",
	// 		department: null,
	// 		projectName: "新J6L平地板产品开发",
	// 		projectNum: "Z2113",
	// 		carNum: "YS1736",
	// 		carType: null,
	// 		plannedSpeed: "6%",
	// 		testName: "尤晓明",
	// 		driverName: "张洪江",
	// 		name: "强化路可靠性试验",
	// 		roadName: "2号路",
	// 		cardCode: null,
	// 		cardNum: null,
	// 		time: null,
	// 	},
	// 	{
	// 		accountNum: "2022XNSY000376",
	// 		state: 4,
	// 		testType: "性能试验",
	// 		ground: "高速环路",
	// 		startTime: "2022-05-03 09:00:00",
	// 		endTime: "2022-05-03 10:00:00",
	// 		applyName: "尤晓明",
	// 		company: "商用车开发院",
	// 		department: null,
	// 		projectName: "新J6L平地板产品开发",
	// 		projectNum: "Z2113",
	// 		carNum: "YS1736",
	// 		carType: null,
	// 		plannedSpeed: "100%",
	// 		testName: "尤晓明",
	// 		driverName: null,
	// 		name: "里程表校正",
	// 		roadName: "一道",
	// 		cardCode: null,
	// 		cardNum: null,
	// 		time: null,
	// 	},
	// ];
	var resultDatas = [{}, {}, {}];

	//初始化监控数据的小窗口
	function initInfoWindow(key) {
		allConfig["show"] = true;
		var car = carMarkers[key];
		var infoWindowData = {
			width: "700px",
			height: "500px",
			title: "车辆试验信息",
			content: "",
			icon: "i-icon-carinfo",
			// rbar: [
			//     {
			//         iconCls: "i-icon-white-computer",
			//         text: "单车监控",
			//         handler: function () {
			//             if (layer.index)
			//                 layer.close(layer.index);
			//             var key = this.key;
			//             var carid = carMarkers[key].carinfo.id;
			//             var carno = carMarkers[key].carinfo.carno;
			//             var tabLayerIndex = layer.tab({
			//                 // area: ['1000px', '600px'],
			//                 tab: [{
			//                     title: '<i class="iconfont" style="padding:0 10px 0 0;font-size:30px;vertical-align: middle;">&#xe665;</i>车辆监测',
			//                     content: "<iframe id='iframeSelectCar' name='iframeSelectCar' scrolling='auto' frameborder='0' src='RealtimeData.html?id=" + carid+ "&carno=" + carno + "' style='width:100%; height:100%; display:block;'></iframe>"
			//                 }, {
			//                     title: '<i class="iconfont" style="padding:0 10px 0 0;font-size:30px;vertical-align: middle;">&#xe61e;</i>历史轨迹',
			//                     content: "<iframe id='iframeSelectCar' name='iframeSelectCar' scrolling='auto' frameborder='0' src='HistoricalTrack.html?id=" + carid + "&carno=" + carno + "' style='width:100%; height:100%; display:block;'></iframe>"
			//                 }]
			//             });
			//             layer.full(tabLayerIndex);
			//         }
			//     }
			// ],
			offset: {
				x: 0,
				y: 0,
			},
		};
		if (resultDatas.length != 0) {
			let allData = resultDatas[allConfig["index"]];
			allConfig["num"] = resultDatas.length;
			infoWindowData.content = [
				{ label: "样车编号：", value: allData.carNum || car.carinfo.carno },
				{ label: "试验科目：", value: allData.name || "--" },
				{ label: "试验类型：", value: allData.testType || "--" },
				{ label: "试验员：", value: allData.testName || "--" },
				{ label: "单位名称：", value: allData.company || "--" },
				{ label: "部门名称：", value: allData.department || "--" },
				{ label: "驾驶员：", value: allData.driverName || "--" },
				{ label: "计划结束时间：", value: allData.endTime || "--" },
				{ label: "计划进展：", value: allData.plannedSpeed || "--" },
				{ label: "试验道路：", value: allData.roadName || "--" },
			];
			infoWindow = MyMap.createInfoWindow(infoWindowData);
			infoWindow.on("close", function () {
				wsClient.send("11#");
				clearInterval(infoWindow.intervalId); // 清除定时器
			});
		}
		// if (car && car.carinfo) {
		//     if (car.carBaseData) {
		//         infoWindowData.content = [
		//             { label: "车辆编号：", value: car.carinfo.carno || "" },
		//             { label: "V I N 码：", value: car.carinfo.vin || "" },
		//             { label: "终端编号：", value: car.carinfo.terminalcode || "" },
		//             { label: "天   气：", value: car.carinfo.weather || "无" },
		//             { label: "数据时间：", value: car.carBaseData.TravelTime || "" },
		//             { label: "GPS车速：", value: (car.carBaseData.Speed || "0") + "km/h" },
		//             { label: "GPS里程：", value: (car.carBaseData.Mileage || "0") + "km" },
		//             { label: "GPS海拔：", value: (car.carBaseData.Altitude || "0") + "m" },
		//             { label: "GPS方向：", value: (car.carBaseData.Angle || "0") + "°" }
		//         ];
		//     } else {
		//         infoWindowData.content = [
		//             { label: "车辆编号：", value: car.carinfo.carno || "" },
		//             { label: "V I N 码：", value: car.carinfo.vin || "" },
		//             { label: "终端编号：", value: car.carinfo.terminalcode || "" },
		//             { label: "数据时间：", value: "" },
		//             { label: "GPS车速：", value: "0km/h" },
		//             { label: "GPS里程：", value: "0km" },
		//             { label: "GPS海拔：", value: "0m" },
		//             { label: "GPS方向：", value: "0°" }
		//         ];
		//     }
		// } else {
		//     infoWindowData.content = [
		//         { label: "车辆编号：", value: "" },
		//         { label: "V I N 码：", value: "" },
		//         { label: "终端编号：", value: "" },
		//         { label: "数据时间：", value: "" },
		//         { label: "GPS车速：", value: "0km/h" },
		//         { label: "GPS里程：", value: "0km" },
		//         { label: "GPS海拔：", value: "0m" },
		//         { label: "GPS方向：", value: "0°" }
		//     ];
		// }
	}

	//刷新小窗口
	function refreshInfoWindow(key) {
		console.log("刷新小窗口", key, carMarkers[key]);
		var car = carMarkers[key];
		if (resultDatas.length != 0) {
			let allData = resultDatas[allConfig["index"]];
			let content = [
				{ label: "GPS车速：", value: (car.carBaseData.Speed.toFixed(2) || "0") + "km/h" },
				{ label: "GPS方向：", value: (car.carBaseData.Angle.toFixed(2) || "0") + "°" },
				{ label: "样车编号：", value: allData.carNum || car.carinfo.carno },
				{ label: "试验科目：", value: allData.name || "--" },
				{ label: "试验类型：", value: allData.testType || "--" },
				{ label: "试验员：", value: allData.testName || "--" },
				{ label: "单位名称：", value: allData.company || "--" },
				{ label: "部门名称：", value: allData.department || "--" },
				{ label: "驾驶员：", value: allData.driverName || "--" },
				{ label: "计划结束时间：", value: allData.endTime || "--" },
				{ label: "计划进展：", value: allData.plannedSpeed || "--" },
				{ label: "试验道路：", value: allData.roadName || "--" },
			];
			// var content = [
			//     { label: "车辆编号：", value: car.carinfo.carno || "" },
			//     { label: "V I N 码：", value: car.carinfo.vin || "" },
			//     { label: "终端编号：", value: car.carinfo.terminalcode || "" },
			//     { label: "天   气：", value: car.carinfo.weather || "无" }
			// ];
			// if (car.carBaseData) {
			//     content.push({ label: "数据时间：", value: car.carBaseData.TravelTime || "" });
			//     content.push({ label: "GPS车速：", value: (car.carBaseData.Speed.toFixed(2) || "0") + "km/h" });
			//     content.push({ label: "GPS里程：", value: (car.carBaseData.Mileage.toFixed(2) || "0") + "km" });
			//     content.push({ label: "GPS海拔：", value: (car.carBaseData.Altitude.toFixed(2) || "0") + "m" });
			//     content.push({ label: "GPS方向：", value: (car.carBaseData.Angle.toFixed(2) || "0") + "°" });
			//     content.push({ label: "GPS方向：", value: (car.carBaseData.Angle.toFixed(2) || "0") + "°" });
			// }
			infoWindow.setContent({ content: content });
		}
	}

	/**
	 * 关闭infoWindow
	 * @param {Boolean} clusterertrigger - 是否是聚合触发的关闭
	 */
	function closeInfoWindow(clusterertrigger) {
		infoWindow.clusterertrigger = clusterertrigger;
		if (infoWindow.getIsOpen()) {
			infoWindow.close();
		}
	}

	/**
	 * 监控车辆列表对象
	 */
	var PositionedCars = new CustomEvent();

	/**
	 * 添加监控车辆,但是未定位,Marker不存在
	 * @param {(String|Array)} cars - 车辆信息或数组
	 */
	PositionedCars.adds = function (cars) {
		var pushs = [];
		var keys = [];
		if (cars instanceof Array) {
			cars.forEach(function (r) {
				var key = r.terminalcode;
				//过滤已存在和重复key
				if (!carMarkers[key] && !pushs[key]) {
					pushs.push(r);
					keys.push(key);
				}
			});
		}
		if (pushs.length) {
			pushs.forEach(function (r) {
				carMarkers[r.terminalcode] = {
					carinfo: r,
					carPositionData: null,
					carBaseData: null,
					marker: null,
				};
				carMarkers.length++;
			});
			PositionedCars.fire("adds", keys);
		}
	};

	/**
	 * 设置车辆Marker位置
	 */
	PositionedCars.setPosition = function (opt) {
		var car = carMarkers[opt.TerminalCode];
		if (!car) return;
		if (car.marker) {
			car.marker.setPosition({
				lat: opt.Lat,
				lng: opt.Lon,
			});
			car.marker.setStatus({
				isOnline: opt.IsOnline,
				angle: opt.Angle,
				isRunning: opt.IsDriving,
			});
		} else {
			car.marker = createMarker(opt);
			Clusterer.addMarker(car.marker);
		}
		if (
			car &&
			car.marker &&
			infoWindow &&
			infoWindow.key == opt.TerminalCode &&
			infoWindow.getIsOpen()
		) {
			var infoOpt = { lat: opt.Lat, lng: opt.Lon };
			infoWindow.setPosition(infoOpt);
		}
	};

	/**
	 * 设置车辆Marker图标
	 */
	PositionedCars.setIcon = function (icon) {
		for (var key in carMarkers) {
			var marker = carMarkers[key].marker;
			if (marker) marker.setIcon(icon);
		}
	};

	/**
	 * 设置车辆分组
	 */
	PositionedCars.setGroup = function (cars) {
		for (var i = 0; i < cars.length; i++) {
			var tc = cars[i].terminalcode;
			var color = cars[i].color;
			var marker = carMarkers[tc].marker;
			if (marker) marker.setGroup(color);
		}
	};

	/**
	 * 设置车辆分组（未包含的使用默认颜色）
	 */
	PositionedCars.setGroupWithDefault = function (cars) {
		for (var tc in carMarkers) {
			var group = null;
			for (var i = 0; i < cars.length; i++) {
				if (tc == cars[i].terminalcode) {
					group = cars[i];
					break;
				}
			}
			var marker = carMarkers[tc].marker;
			if (marker) {
				if (group) marker.setGroup(group.color);
				else marker.setGroup("rgba(255,0,0,0)");
			}
		}
	};

	/**
	 * 查找车辆,定位车辆
	 * @param {String} key -终端号
	 */
	PositionedCars.find = function (key) {
		var car = carMarkers[key];
		if (car && car.marker) {
			var zoom = MyMap.getZoom();
			var needDelay = true;
			var pos = car.marker.getPosition();
			var center = MyMap.getCenter();
			if (zoom < 17) {
				zoom = 17;
			} else if (pos.lat == center.lat && pos.lng == center.lng) {
				needDelay = false;
			}
			if (needDelay) {
				MyMap.on("moveend", fireClick);
				MyMap.setZoomAndCenter(zoom, pos);
				car.marker.setAnimation("DROP");
				function fireClick() {
					MyMap.off("moveend", fireClick);
					setTimeout(function () {
						car.marker.setAnimation("NONE");
					}, 1000);
					car.marker.click();
				}
			} else {
				car.marker.setAnimation("DROP");
				setTimeout(function () {
					car.marker.setAnimation("NONE");
				}, 1000);
				car.marker.click();
			}
		} else {
			console.log("未找到该车的定位信息");
		}
	};

	/**
	 * websocket事件
	 */
	function websocketEvent() {
		//WebSocket开启
		wsClient.on("open", function (e) {
			wsClient.send("3#");
			wsClient.send("0#");
		});
		//WebSocket收到消息
		wsClient.on("message", function (data) {
			var dataJson = JSON.parse(data);
			// console.debug(dataJson);
			var resultData = dataJson.d;
			if (dataJson.t == 1 || dataJson.t == 3 || dataJson.t == 4) {
				//1：基础数据
				//3：最后一帧数据
				//4：第一帧数据
				if (!infoWindow) return;
				var car = carMarkers[resultData.TerminalCode];
				if (car) {
					car.carBaseData = resultData;
					carKey = resultData.TerminalCode;
					refreshInfoWindow(resultData.TerminalCode);
				}
				if (dataJson.t === 3) PositionedCars.setPosition(resultData);
			} else if (dataJson.t == 0 || dataJson.t == 5) {
				//0：全部车辆坐标数据
				//5：全部绑定了终端车辆的基础数据
				resultData.forEach(function (r) {
					var car = carMarkers[r.TerminalCode];
					if (car) {
						PositionedCars.setPosition(r);
						if (dataJson.t === 0) car.carPositionData = r;
						else car.carBaseData = r;
					} else {
						// console.log(
						//   "定位数据的终端编号：" + r.TerminalCode + "没有找到车辆数据"
						// );
					}
				});
				//  if (dataJson.t == 5) {
				// window.setTimeout(function () {
				//    MyMap.setZoom(16);
				//  }, 2000);
				// }
			}
		});
	}
	websocketEvent();

	function getCarInfo(key) {
		return new Promise((resolve, reject) => { // 返回一个Promise对象
			var car = carMarkers[key];
			$.ajax({
				type: "POST",
				url: "http://pgms.fawjiefang.com.cn/fullscreenmap/testAccount/getPlannedSpeed",
				cache: false,
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify({
					carNum: car.carinfo.carno,
					type: "1",
					pageSize: 3,
					pageNum: 1,
				}),
				success: function (result) {
					resolve(result);
				},
				error: function (e) {
					console.error(e);
					layer.msg("获取车辆信息出错，请刷新页面重试！", { icon: 2 });
				},
			});
		})
	}

	/**
	 * 创建Marker对象
	 */
	function createMarker(opt) {
		var marker = MyMap.createMarker({
			auto: true,
			lat: opt.Lat,
			lng: opt.Lon,
			carType: opt.carType,
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
		marker.key = opt.TerminalCode;
		marker.on("click", function () {
			var that = this;
			var key = that.key;
			// if (infoWindow.getIsOpen()) {
			// 	infoWindow.close();
			// }
			marker.setAnimation("BOUNCE");
			setTimeout(function () {
				marker.setAnimation("NONE");
			}, 1000);
			var zoom = MyMap.getZoom();
			MyMap.setZoomAndCenter(zoom < 17 ? 17 : zoom, this.getPosition());
			getCarInfo(key).then((result) => { 
				if (result.code == 0) {
					if (result.hasOwnProperty("data")) {
						resultDatas = result.data;
						allConfig["num"] = resultDatas.length;
						infoWindow = null;
						initInfoWindow(key);
						if (infoWindow.key == key && infoWindow.getIsOpen()) {
							closeInfoWindow();
							return;
						}
						infoWindow.key = key;
						infoWindow.intervalId = setInterval(() => {
							refreshInfoWindow(key);
						}, 1000);
						infoWindow.open(that.getPosition());
						infoWindow.clusterertrigger = false;
						wsClient.send("1#" + key);
					} else {
						resultDatas = [{}];
						infoWindow = null;
						initInfoWindow(key);
						if (infoWindow.key == key && infoWindow.getIsOpen()) {
							closeInfoWindow();
							return;
						}
						infoWindow.key = key;
						refreshInfoWindow(key);
						infoWindow.open(that.getPosition());
						infoWindow.clusterertrigger = false;
						layer.msg("此车辆未绑定试验单信息！", { icon: 2 });
					}
				} else {
					layer.msg("获取车辆信息出错，请刷新页面重试！", { icon: 2 });
				}
			}).catch(() => { 
				// infoWindow = null;
				initInfoWindow(key);
				if (infoWindow.key == key && infoWindow.getIsOpen()) {
					closeInfoWindow();
					return;
				}
				infoWindow.key = key;
				refreshInfoWindow(key);
				infoWindow.open(that.getPosition());
				infoWindow.clusterertrigger = false;
			})
			//获取天气
			if (carMarkers[key].carBaseData) {
				var getcityidurl =
					URL.amapApi.getCityID +
					"&location=" +
					carMarkers[key].carBaseData.Lon +
					"," +
					carMarkers[key].carBaseData.Lat;
				$.get(
					getcityidurl,
					{},
					function (result) {
						if (result.status == 1) {
							var cityID = result.regeocode.addressComponent.adcode;
							var getweatherurl =
								URL.amapApi.getWeather + "&extensions=base&city=" + cityID;
							$.get(
								getweatherurl,
								{},
								function (weathJson) {
									if (weathJson.status == 1) {
										var weather = weathJson.lives[0].weather;
										carMarkers[key].carinfo.weather = weather;
										refreshInfoWindow(key);
									} else {
										console.error(
											"查询天气API失败，返回状态：" + weathJson.info
										);
									}
								},
								"json"
							);
						} else {
							console.error("查询逆地理编码API失败，返回状态：" + result.info);
						}
					},
					"json"
				);
			}
		});
		return marker;
	}

	return PositionedCars;
});
