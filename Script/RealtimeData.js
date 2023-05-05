(function () {
	//获取URL里的参数
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return decodeURIComponent(r[2]);
		return null;
	}

	require([
		"jquery",
		"layui",
		"imap",
		"URL",
		"ajaxglobalconfig",
		"echarts",
		"websocket",
	], function ($, layui, iMap, URL, ajaxglobal, echarts, wsClient) {
		layui.link("Style/HistoricalTrack.css?v=" + allConfig.urlArgs);
		layui.link("Resource/icon/iconfont/iconfont.css?v=" + allConfig.urlArgs);
		//车辆ID
		var carID = getQueryString("id");
		//终端编号
		var terminalcode;
		var setCarInfoDriverID;
		//驾驶员ID
		var DriverID;
		//车辆编号
		var carno = getQueryString("carno");
		//地图对象
		var maplayer = {
			//高精度测绘图层
			mapping: new AMap.TileLayer({
				zIndex: 5,
				getTileUrl: function (x, y, z) {
					return (
						allConfig.highPrecisionMappingLayer +
						"?x=" +
						x +
						"&y=" +
						y +
						"&z=" +
						z
					);
				},
			}),
		};
		var map;

		//点标记对象
		var marker;
		var canLengend = [];
		//图表
		var myCharts = {
			//速度图表
			speedEchart: null,
			//折线图表
			lineEchart: null,
		};
		var md5 = "";
		// ws返回can数据
		var resultData;
		var canDataList = [];
		var canDataLists = [];
		var can1 = [];
		var can2 = [];
		var can3 = [];
		var canList = [];
		var carIcon;
		var sanjiao =
			allConfig.baseDirectory + "Resource/carIcons/icon_yunxing_xingshi.png";
		var car1 =
			allConfig.baseDirectory + "Resource/carIcons/icon_jiaoche_xingshi.png";
		var car3 =
			allConfig.baseDirectory + "Resource/carIcons/icon_xiehuoche_xingshi.png";
		var car2 =
			allConfig.baseDirectory + "Resource/carIcons/icon_keche_xingshi.png";
		var kache1 =
			allConfig.baseDirectory + "Resource/carIcons/icon_qianyinche_xingshi.png";
		// 行驶轨迹数组
		var Polyline = [];
		// 车辆行驶坐标数组
		var pathList = [];
		var enginee;
		// 图表对象
		var lineEchart;
		//缓存的数据\
		// var cacheData = {
		//     path: null, //坐标数组[{lat:xx,lng:xx,angle:xx}]
		//     gpsDatas: null, //Gps数据数组[{mileage:xx,speed:xx}]
		//     data: null, //历史数据
		//     dbcid: null, //DBCID
		//     dbcmd5: null, //DBC的MD5
		//     standardparameter: null //参数标准化信息
		// };

		//缓存的车辆信息
		var cacheCarInfo = null;
		// 抽屉车辆信息div高度
		var height1 = $("#carInfo").height();
		// 抽屉视频信息div高度
		var height2 = $("#videoInfo").height();
		// can数据div高度
		var canHeight;
		// can数据图div高度
		var echartsHeight;

		//can数据
		var templateHtml =
			"{{# layui.each(d, function(index, item){ }}" +
			'<div class="layui-row" style="display:flex;justify-content: space-between;border-bottom: 1px dashed #eee;">' +
			'<div class="layui-col-xs6 label-title label-height" style="color:#7C8590;">' +
			'<label id="lb_title_{{ item.standardparametersid }}" >{{item.varname||"" }}：&nbsp;&nbsp;</label>' +
			"</div>" +
			'<div class="layui-col-xs6 label-height" style="text-align:end;color:#44546F;">' +
			'<label id="lb_value_{{ item.standardparametersid }}">{{ item.val!=null||item.val!=""?item.val.toFixed(3):""}}&nbsp;</label>' +
			'<label id="lb_unit_{{ item.standardparametersid }}">{{  item.unit !=null||item.unit!="null"||item.unit !=""?item.unit:"" }}</label>' +
			"</div>" +
			"</div>" +
			"{{# }); }}";
		//生成Can列表页面元素
		function GeneratePageElements() {
			var html = layui.laytpl(templateHtml).render(canDataList);
			$("#carcont").html("");
			$("#carcont").append(html);
		}

		function innt() {
			$.ajax({
				type: "POST",
				url: URL.car.getCarCanListByMd5,
				data: {
					md5: md5,
				},
				cache: false,
				dataType: "json",
				success: function (result) {
					if (result.state == 1) {
						var dbcvar = result.data;
						dbcvar.forEach((item) => {
							if (item.varname == "发动机转速") {
								enginee = item.serial;
							}
						});
					}
				},
			});
		}

		//添加视频直播
		function AddIfreamVideo(terminalcode) {
			var parentDom = document.getElementById("div_IfreamVideo");
			if (document.getElementById("iframe_LiveBroadcast")) {
				parentDom.removeChild(document.getElementById("iframe_LiveBroadcast"));
			}
			$("#div_IfreamVideo").prepend(
				"<iframe id='iframe_LiveBroadcast' name='iframe_LiveBroadcast' scrolling='auto' frameborder='0' allowfullscreen='allowfullscreen' mozallowfullscreen='mozallowfullscreen' msallowfullscreen='msallowfullscreen' oallowfullscreen='oallowfullscreen' webkitallowfullscreen='webkitallowfullscreen' src='" +
					allConfig.webBase +
					"videolive/index.html?terminalcode=" +
					terminalcode +
					"' style='width:100%; height:100%; display:block;'></iframe>"
			);
        }
		//    车辆信息抽屉高度设置
		function loadingData() {
			$("#carno").text(carno);

			$("#closeButton1").on("click", function () {
				$("#carInfo").hide();
				if ($("#videoInfo").is(":hidden")) {
					// can数据div高度
					canHeight = $("#canInfo").height();
					// can数据图div高度
					echartsHeight = $("#canEcharts").height();
					// $("#canEcharts").css("height",echartsHeight+height2/2);
					$("#canEcharts").height(echartsHeight + height2 / 2);
					$("#canInfo").height(canHeight + height1 / 2);
					// can数据div高度
					canHeight = $("#canInfo").height();
					// can数据图div高度
					echartsHeight = $("#canEcharts").height();
					$(".but").css({
						display: "flex",
					});
					$(".buts").css({
						display: "flex",
					});
				} else {
					// can数据div高度
					canHeight = $("#canInfo").height();
					// can数据图div高度
					echartsHeight = $("#canEcharts").height();
					$("#canEcharts").height(echartsHeight + height1 / 2);
					$("#canInfo").height(canHeight + height1 / 2);
					// can数据div高度
					canHeight = $("#canInfo").height();
					// can数据图div高度
					echartsHeight = $("#canEcharts").height();
					$(".buts").css({
						display: "flex",
					});
				}
				$("#carcont").height($("#canInfo").height() - 29);
				$(".cont").height($("#canEcharts").height() - 29);
				$("#lineecharts").height($("#canEcharts").height() - 29);
				if (lineEchart) {
					loadEcharts();
				}
			});
			$("#closeButton2").on("click", function () {
				$("#videoInfo").hide();
				if ($("#carInfo").is(":hidden")) {
					// can数据div高度
					canHeight = $("#canInfo").height();
					// can数据图div高度
					echartsHeight = $("#canEcharts").height();
					$("#canEcharts").height(echartsHeight + height2 / 2);
					$("#canInfo").height(canHeight + height1 / 2);
					// can数据div高度
					canHeight = $("#canInfo").height();
					// can数据图div高度
					echartsHeight = $("#canEcharts").height();
					$(".but").css({
						display: "flex",
					});
					$(".buts").css({
						display: "flex",
					});
				} else {
					// can数据div高度
					canHeight = $("#canInfo").height();
					// can数据图div高度
					echartsHeight = $("#canEcharts").height();
					$("#canEcharts").height(echartsHeight + height2 / 2);
					$("#canInfo").height(canHeight + height2 / 2);
					// can数据div高度
					canHeight = $("#canInfo").height();
					// can数据图div高度
					echartsHeight = $("#canEcharts").height();
					$(".but").css({
						display: "flex",
					});
				}
				$("#carcont").height($("#canInfo").height() - 29);
				$(".cont").height($("#canEcharts").height() - 29);
				$("#lineecharts").height($("#canEcharts").height() - 29);
				if (lineEchart) {
					loadEcharts();
				}
			});

			$(".but").on("click", function () {
				$("#videoInfo").show();
				$(".but").hide();

				if ($("#carInfo").is(":hidden")) {
					$("#canEcharts").height(echartsHeight - height2 / 2);
					$("#canInfo").height(canHeight - height2 / 2);
					console.log(canHeight, echartsHeight, "1", height2);
				} else {
					$("#canEcharts").height(height2);
					$("#canInfo").height(height1);
					console.log(canHeight, echartsHeight, "2", height2, height1);
				}
				$("#carcont").height($("#canInfo").height() - 29);
				console.log($("#carcontent").height());
				$(".cont").height($("#canEcharts").height() - 29);
				$("#lineecharts").height($("#canEcharts").height() - 29);
				if (lineEchart) {
					loadEcharts();
				}
			});
			$(".buts").on("click", function () {
				$("#carInfo").show();
				$(".buts").hide();
				if ($("#videoInfo").is(":hidden")) {
					$("#canEcharts").height(echartsHeight - height1 / 2);
					$("#canInfo").height(canHeight - height1 / 2);
				} else {
					$("#canEcharts").height(height2);
					$("#canInfo").height(height1);
				}
				$("#carcont").height($("#canInfo").height() - 29);
				console.log($("#carcont").height());
				$(".cont").height($("#canEcharts").height() - 29);
				$("#lineecharts").height($("#canEcharts").height() - 29);
				if (lineEchart) {
					loadEcharts();
				}
			});
			//参数设置
			$("#infoCar").on("click", function () {
				$.ajax({
					type: "POST",
					url: URL.car.getCarCanListByMd5,
					data: {
						md5: md5,
					},
					cache: false,
					dataType: "json",
					success: function (result) {
						if (result.state == 1) {
							var dbcvar = result.data;

							var tplStr = '<div id="transfer_SelectDataItem"></div>';
							layer.open({
								type: 1,
								title: "选择Can通道",
								area: ["715px", "500px"], //宽高
								content: tplStr,
								closeBtn: 1,
								btn: ["确认", "取消"],
								btnAlign: "c",
								yes: function (index, layero) {
									var getData = layui.transfer.getData(
										"transfer_SelectDataItem"
									);
									if (getData == null || getData.length == 0) {
										layer.msg("请至少选择一项！", {
											icon: 2,
										});
										return;
									}
									var selectData = [];
									for (var i = 0; i < getData.length; i++) {
										var spid = getData[i].value;
										for (let k = 0; k < dbcvar.length; k++) {
											if (dbcvar[k].standardparametersid == spid) {
												selectData.push(dbcvar[k]);
												break;
											}
										}
									}
									console.log(selectData, "select");
									canDataList = [];
									selectData.forEach((item) => {
										var obj = {
											unit: item.unit,
											varname: item.varname,
											val: "",
											serial: item.serial,
										};
										canDataList.push(obj);
									});
									console.log(canDataList, "canDataList");
									layer.close(layer.index);
								},
								btn2: function () {
									return true;
								},
								cancel: function () {
									return true;
								},
							});

							var transferData = [];
							for (var i = 0; i < dbcvar.length; i++) {
								transferData.push({
									value: dbcvar[i].standardparametersid,
									title: dbcvar[i].varname,
								});
							}
							layui.transfer.render({
								elem: "#transfer_SelectDataItem", //绑定元素
								id: "transfer_SelectDataItem", //定义索引
								width: 300,
								title: ["全部", "全部"],
								data: transferData,
								showSearch: true,
								text: {
									none: "无数据", //没有数据时的文案
									searchNone: "无数据", //搜索无匹配数据时的文案
								},
							});
						} else {
							filterParams();
						}
					},
				});
			});

			//参数设置
			$("#echartsCan").on("click", function () {
				$.ajax({
					type: "POST",
					url: URL.car.getCarCanListByMd5,
					data: {
						md5: md5,
					},
					cache: false,
					dataType: "json",
					success: function (result) {
						if (result.state == 1) {
							var dbcvar = result.data;
							var tplStr = '<div id="transfer_SelectDataItem"></div>';
							layer.open({
								type: 1,
								title: "选择Can通道",
								area: ["715px", "500px"], //宽高
								content: tplStr,
								closeBtn: 1,
								btn: ["确认", "取消"],
								btnAlign: "c",
								yes: function (index, layero) {
									var getData = layui.transfer.getData(
										"transfer_SelectDataItem"
									);
									if (getData == null || getData.length == 0) {
										layer.msg("请至少选择一项！", {
											icon: 2,
										});
										return;
									}
									if (getData.length > 3) {
										layer.msg("最多选择三项！", {
											icon: 2,
										});
										return;
									}
									var selectData = [];
									for (var i = 0; i < getData.length; i++) {
										var spid = getData[i].value;
										for (let k = 0; k < dbcvar.length; k++) {
											if (dbcvar[k].standardparametersid == spid) {
												selectData.push(dbcvar[k]);
												break;
											}
										}
									}
									console.log(selectData, "select1111");
									//    can1 = [];
									//   can2 = [];
									//  can3 = [];
									//canList = [];
									canDataLists = [];
									canLengend = [];
									selectData.forEach((item) => {
										var obj = {
											unit: item.unit,
											varname: item.varname,
											val: "",
											serial: item.serial,
										};
										canDataLists.push(obj);
										canLengend.push(item.varname);
									});
									loadEcharts();
									console.log(canDataLists, "canDataLists");
									layer.close(layer.index);
								},
								btn2: function () {
									return true;
								},
								cancel: function () {
									return true;
								},
							});

							var transferData = [];
							for (var i = 0; i < dbcvar.length; i++) {
								transferData.push({
									value: dbcvar[i].standardparametersid,
									title: dbcvar[i].varname,
								});
							}
							layui.transfer.render({
								elem: "#transfer_SelectDataItem", //绑定元素
								id: "transfer_SelectDataItem", //定义索引
								width: 300,
								title: ["全部", "全部"],
								data: transferData,
								showSearch: true,
								text: {
									none: "无数据", //没有数据时的文案
									searchNone: "无数据", //搜索无匹配数据时的文案
								},
							});
						} else {
							filterParams();
						}
					},
				});
			});

			$(".left").on("click", function () {
				if ($(".leftNav").css("left") != "0px") {
					console.log($(".imgleft").css("src"));
					$(".leftNav").css({
						left: "0",
						transition: "left 1s",
					});
					$(".left").css({
						left: "30%",
						transition: "left 1s",
					});
					$(".but").css({
						left: "30%",
						transition: "left 1s",
					});
					$(".buts").css({
						left: "30%",
						transition: "left 1s",
					});
					$(".imgleft").attr("src", "Resource/icon/icon_shouqi.png");
				} else {
					console.log($(".imgleft").css("src"));
					$(".leftNav").css({
						left: "-30%",
						transition: "left 1s",
					});
					$(".left").css({
						left: "0px",
						transition: "left 1s",
					});
					$(".but").css({
						left: "0px",
						transition: "left 1s",
					});
					$(".buts").css({
						left: "0px",
						transition: "left 1s",
					});
					$(".imgleft").attr("src", "Resource/icon/icon_kaizhan.png");
				}
			});
		}

		//设置车辆信息值
		function setCarInfoData() {
			$.ajax({
				type: "POST",
				url: URL.car.getCarInfoModelByCarID,
				cache: false,
				dataType: "json",
				data: {
					carid: carID,
				},
				success: function (result) {
					if (result.state == 1) {
						var data = result.data;
						cacheCarInfo = data;
						terminalcode = cacheCarInfo.terminalcode;

						AddIfreamVideo(terminalcode);
						$("#terminalcode").text(cacheCarInfo.terminalcode);
						$("#info").text(cacheCarInfo.carname);
						cacheCarInfo.can = {
							md5: null,
							dbcvar: null,
						};
						for (var i = 0; i < carInfo.length; i++) {
							var key = carInfo[i].filed;
							var text = data[key];
							if (key == "isonline") {
								continue;
							}
							if (text) $("#lb_value_" + key).html(text);
						}
						wsClient.send("2#" + data.terminalcode);
					}
				},
			});
		}

		setCarInfoDriverID = (function () {
			var run = false;
			return function () {
				if (!run) {
					$.ajax({
						type: "POST",
						url: URL.driver.getDriverInfo,
						cache: false,
						dataType: "json",
						data: {
							driverId: DriverID,
							carid: carID,
						},
						success: function (result) {
							if (result.state == 1) {
								var data = result.data;
								for (let key in data) {
									if (data[key] == null || data[key] == "") {
										data[key] = "----";
									}
								}
								if (data.driverName != null) {
									$("#carName").text(data.driverName);
								}
								if (data.phone != null) {
									$("#carPhone").text(data.phone);
								}
								if (data.photo != null) {
									$("#carPhoto").attr("src", data.photo);
								}
								if (data.carModer != null) {
									$("#vehicleType").text(data.carModer);
								}
								if (data.vin != null) {
									$("#chassis").text(data.vin);
								}
								if (data.engineNumber != null) {
									$("#Engine").text(data.engineNumber);
								}
								if (data.driveType != null) {
									$("#driveForm").text(data.driveType);
								}
								if (data.projectName != null) {
									$("#project").text(data.projectName);
								}
								if (data.dateOfProduction != null) {
									$("#date").text(data.dateOfProduction);
								}
								if (data.manufacturer != null) {
									$("#Manufacturer").text(data.manufacturer);
								}
							}
						},
					});
				}
				run = true;
			};
		})();

		function setCarInfoDriverID() {
			$.ajax({
				type: "POST",
				url: URL.driver.getDriverInfo,
				cache: false,
				dataType: "json",
				data: {
					driverId: DriverID,
				},
				success: function (result) {
					if (result.state == 1) {
						var data = result.data;
						if (data.driverName != null) {
							$("#carName").text(data.driverName);
						}
						if (data.phone != null) {
							$("#carPhone").text(data.phone);
						}
						if (data.photo != null) {
							$("#carPhoto").attr("src", data.photo);
						}
						if (data.carModer != null) {
							$("#vehicleType").text(data.carModer);
						}
						if (data.vin != null) {
							$("#chassis").text(data.vin);
						}
						if (data.engineNumber != null) {
							$("#Engine").text(data.engineNumber);
						}
						if (data.driveType != null) {
							$("#driveForm").text(data.driveType);
						}
						if (data.projectName != null) {
							$("#project").text(data.projectName);
						}
						if (data.dateOfProduction != null) {
							$("#date").text(data.dateOfProduction);
						}
						if (data.manufacturer != null) {
							$("#Manufacturer").text(data.manufacturer);
						}
					}
				},
			});
		}

		//WebSocket事件
		function WebSocketFireEvent() {
			//WebSocket开启
			wsClient.on("open", function (e) {
				if (
					cacheCarInfo &&
					typeof cacheCarInfo.terminalcode != "undefined" &&
					cacheCarInfo.terminalcode != null
				) {
					wsClient.send("2#" + cacheCarInfo.terminalcode);
				}
			});
			//WebSocket收到消息
			wsClient.on("message", function (data) {
				var dataJson = JSON.parse(data);
				// console.log(dataJson);
				var resultData = dataJson.d;
				DriverID = resultData.DriverID;
				setCarInfoDriverID();
				myCharts.speedEchart.setOption({
					series: [
						{
							data: [
								{
									value: Math.round(resultData.Speed * 100) / 100,
									name: "",
								},
							],
						},
					],
				});
				switch (dataJson.t) {
					//全部数据
					case 2:
						var path = {
							lat: resultData.Lat,
							lng: resultData.Lon,
						};
						var latlon = [resultData.Lon, resultData.Lat];
						pathList.push(path);
						marker.setAngle(resultData.Angle);
						marker.moveTo({
							lat: resultData.Lat,
							lng: resultData.Lon,
							speed: 200,
						});
						addPolyline(pathList, resultData.Speed);
						map.setCenter({
							lat: resultData.Lat,
							lng: resultData.Lon,
						});
						map.setZoom([3, 18]);
						canDataList.forEach((item) => {
							item.val = resultData.CanData[item.serial - 1];
						});
						canDataLists.forEach((item) => {
							item.val = resultData.CanData[item.serial - 1];
						});
						if (lineEchart) {
							var series = lineEchart.getOption().series;
							var xAxis = lineEchart.getOption().xAxis;
							if (canDataLists != []) {
								if (canDataLists[0]) {
									series[0].data.push(canDataLists[0].val);
								}
								if (canDataLists[1]) {
									series[1].data.push(canDataLists[1].val);
								}
								if (canDataLists[2]) {
									series[2].data.push(canDataLists[2].val);
								}

								xAxis[0].data.push(resultData.TravelTime);
							}
							lineEchart.setOption({
								series: series,
								xAxis: xAxis,
							});
						}
						if (resultData.CanData[enginee - 1] >= 0) {
							myCharts.lineEchart.setOption({
								series: [
									{
										data: [
											{
												value:
													Math.round(resultData.CanData[enginee - 1]) / 1000,
												name: "",
											},
										],
									},
								],
							});
						}
						if (resultData.X != null) {
							$("#Xaxis").text(resultData.X);
						}
						if (resultData.Y != null) {
							$("#Yaxis").text(resultData.Y);
						}
						if (resultData.Z != null) {
							$("#Zaxis").text(resultData.Z);
						}
						if (resultData.Angle != null) {
							$("#GPSdirection").text(resultData.Angle);
						}
						if (resultData.Altitude != null) {
							$("#GPSelevation").text(resultData.Altitude);
						}
						if (resultData.Mileage != null) {
							$("#GPSmileage").text(resultData.Mileage);
						}
						if (resultData.Speed != null) {
							$("#GPSspeed").text(resultData.Speed);
						}
						if (resultData.Temp != null) {
							$("#terminalAmbientTemperature").text(resultData.Temp);
						}

						if (resultData.TravelTime != null) {
							$("#positioningTime").text(resultData.TravelTime);
						}
						var geocoder;
						AMap.plugin(["AMap.Geocoder"], function () {
							geocoder = new AMap.Geocoder({
								city: "010",
								radius: 500,
							});
						});
						geocoder.getAddress(latlon, function (status, result) {
							//console.log(latlon,status,result)
							if (status === "complete" && result.regeocode) {
								var address = result.regeocode.formattedAddress;
								$("#geographical").text(address);
							} else {
								layer.msg("根据经纬度查询地址失败！", { icon: 2 });
							}
						});
						//console.log('dataList',canDataList)
						//console.log('dataListssss',canDataLists)
						GeneratePageElements();
						//console.log('pathList: ', pathList);
						break;
					//第一帧数据
					case 4:
						addMarker(resultData);
						var path = {
							lat: resultData.Lat,
							lng: resultData.Lon,
						};
						pathList.push(path);
						md5 = resultData.Md5Code;
						innt();
						map.setCenter({
							lat: resultData.Lat,
							lng: resultData.Lon,
						});
						map.setZoom(15);
						break;
					//最后一帧数据
					case 3:
					// if (cacheCarInfo.terminalcode == resultData.TerminalCode)
					//     setCarRealFullData(resultData);
					// break;
				}
			});
		}

		//加载图表
		function loadEchartss() {
			var speedEchart = echarts.init(document.getElementById("speedbiao"));
			var lineEchart = echarts.init(document.getElementById("speeds"));
			var speedEchartOption = {
				series: [
					{
						type: "gauge",
						max: 120,
						axisLine: {
							lineStyle: {
								width: 10,
								color: [
									[0.3, "#67e0e3"],
									[0.7, "#37a2da"],
									[1, "#fd666d"],
								],
							},
						},
						pointer: {
							itemStyle: {
								color: "#30ACFF",
							},
						},
						axisTick: {
							distance: -10,
							length: 8,
							lineStyle: {
								color: "#fff",
								width: 2,
							},
						},
						splitLine: {
							distance: -60,
							length: 10,
							lineStyle: {
								color: "#fff",
								width: 1,
							},
						},
						axisLabel: {
							color: "#30ACFF",
							distance: 5,
							fontSize: 12,
						},
						detail: {
							valueAnimation: true,
							formatter: "{value} km/h",
							color: "#30ACFF",
							fontSize: 12,
						},
						data: [
							{
								value: 0,
								name: "",
							},
						],
					},
				],
			};
			var lineEchartOption = {
				series: [
					{
						type: "gauge",
						max: 50,
						axisLine: {
							lineStyle: {
								width: 10,
								color: [
									[0.3, "#67e0e3"],
									[0.7, "#37a2da"],
									[1, "#fd666d"],
								],
							},
						},
						pointer: {
							itemStyle: {
								color: "#30ACFF",
							},
						},
						axisTick: {
							distance: -10,
							length: 8,
							lineStyle: {
								color: "#fff",
								width: 2,
							},
						},
						splitLine: {
							distance: -60,
							length: 10,
							lineStyle: {
								color: "#fff",
								width: 1,
							},
						},
						axisLabel: {
							color: "#30ACFF",
							distance: 5,
							fontSize: 12,
						},
						detail: {
							valueAnimation: true,
							formatter: "{value}x1000rpm",
							color: "#30ACFF",
							fontSize: 12,
						},
						data: [
							{
								value: 0,
								name: "",
							},
						],
					},
				],
			};
			speedEchart.setOption(speedEchartOption);
			lineEchart.setOption(lineEchartOption);
			myCharts.speedEchart = speedEchart;
			myCharts.lineEchart = lineEchart;
		}

		function addMarker(resultData) {
			marker = map.createMarker({
				lat: resultData.Lat,
				lng: resultData.Lon,
				isCustom: false,
				visible: false,
				icon:
					carIcon == "sanjiao"
						? sanjiao
						: carIcon == "car1"
						? car1
						: carIcon == "car2"
						? car2
						: carIcon == "car3"
						? car3
						: kache1,
				offset: {
					x: -13,
					y: -26,
				},
			});
			marker.setAngle(resultData.Angle);
			marker.show();
		}

		function addPolyline(pathList, speed) {
			//console.log(88888888,speed)
			var strokeColor;
			if (speed != null) {
				if (speed >= 0 && speed <= 30) {
					strokeColor = "#42E5E3";
				} else if (speed > 30 && speed <= 60) {
					strokeColor = "#30ACFF";
				} else if (speed > 60 && speed <= 90) {
					strokeColor = "#BA70FF";
				} else if (speed > 90 && speed <= 120) {
					strokeColor = "#FFBF50";
				} else {
					strokeColor = "#FF6464";
				}
				//console.log('strokeColor',strokeColor)
				polyline = map.createPolyline({
					path: [pathList[pathList.length - 2], pathList[pathList.length - 1]],
					lineStyle: {
						strokeColor: strokeColor,
						strokeOpacity: 1,
						strokeWeight: 6,
						strokeStyle: "solid",
						showDir: false,
					},
				});
				polyline.show();
			}
		}

		//加载图表
		function loadEcharts() {
			console.log("echarts");

			lineEchart = echarts.init(document.getElementById("lineecharts"));
			var colors = ["#5470C6", "#91CC75", "#EE6666"];
			var lineEchartOption = {
				color: colors,

				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "cross",
					},
				},
				grid: {
					left: "4%",
					// right:'0%',
					top: "20%",
					bottom: "0%",
					containLabel: true,
				},
				legend: {
					data: canLengend,
				},
				xAxis: [
					{
						type: "category",
						axisTick: {
							alignWithLabel: true,
						},
						data: [],
					},
				],
				yAxis: [
					{
						type: "value",
						name: "",
						offset: 0,
						position: "left",
						splitLine: {
							show: false,
						},
						axisTick: {
							show: false,
						},
						minorTick: {
							show: false,
						},
						axisLine: {
							show: false,
							lineStyle: {
								color: colors[0],
							},
						},
						// axisLabel: {
						//     formatter: '{value} ml'
						// }
					},
					{
						type: "value",
						name: "",
						offset: 30,
						splitLine: {
							show: false,
						},
						axisTick: {
							show: false,
						},
						minorTick: {
							show: false,
						},
						position: "left",
						axisLine: {
							show: false,
							lineStyle: {
								color: colors[1],
							},
						},
						// axisLabel: {
						//     formatter: '{value} ml'
						// }
					},
					{
						type: "value",
						name: "",
						offset: 60,
						splitLine: {
							show: false,
						},
						axisTick: {
							show: false,
						},
						minorTick: {
							show: false,
						},
						position: "left",
						axisLine: {
							show: false,
							lineStyle: {
								color: colors[2],
							},
						},
						// axisLabel: {
						//     formatter: '{value} °C'
						// }
					},
				],
				series: [
					{
						name: canLengend[0],
						type: "line",
						data: [],
					},
					{
						name: canLengend[1],
						type: "line",
						yAxisIndex: 1,
						data: [],
					},
					{
						name: canLengend[2],
						type: "line",
						yAxisIndex: 2,
						data: [],
					},
				],
			};
			lineEchart = echarts.init(document.getElementById("lineecharts"));
			lineEchart.resize();

			lineEchart.setOption(lineEchartOption, true);
			// lineEchart.setOption(lineEchartOption);
        }
        
		//筛选参数
		// function filterParams(md5, sp) {
		//     var paramsData = {
		//         cd: carID,
		//         bg: $("#txt_StartTimeSearch").val(),
		//         ed: $("#txt_EndTimeSearch").val()
		//     };
		//     // paramsData["fixedColumns"] = "TRAVELTIME,LATITUDE,LONGITUDE,DIRECTION,MILEAGE,SPEED";
		//     paramsData["fixedColumns"] = "";
		//     if (md5 && sp) {

		//         paramsData["md"] = md5;
		//         paramsData["standards"] = sp;
		//         layer.load(2, {
		//             shade: 0.7
		//         });
		//         getHistoricalTrack(paramsData);
		//     } else {
		//         layer.load(2, {
		//             shade: 0.7
		//         });
		//         getHistoricalTrack(paramsData);
		//     }
		// }

		//解析和计算数据
		// function analysisAndCalculateData(data) {
		//     calculateMileageData(data);
		//     analysisData(data);
		// }

		//解析数据
		// function analysisData(data) {
		//     var path = [];
		//     var gpsDatas = [];
		//     layui.each(data, function (index, item) {
		//         var pathData = {
		//             lng: item.lon,
		//             lat: item.lat,
		//             angle: item.dt
		//         };
		//         var gpsData = {
		//             traveltime: item.tm,
		//             mileage: item.mil,
		//             speed: item.speed
		//         };
		//         path.push(pathData);
		//         gpsDatas.push(gpsData);
		//     });
		//     cacheData.path = path;
		//     cacheData.gpsDatas = gpsDatas;
		// }

		//初始化地图
		function initMap() {
			carIcon = sessionStorage.getItem("key");
			console.log(carIcon, "carIcon");
			map = new iMap("map", {
				center: {
					lng: 116.397531,
					lat: 39.907704,
				},
				zoom: 4,
				expandZoomRange: true,
				zooms: [3, 20],
			});
			map.getProtogenesis().add(maplayer.mapping);
			console.log(map);
		}
		//获取当前日期，格式为：yyyy-MM-dd HH:mm:ss
		// function GetCurrentDate() {
		//     var nowDateTime = new Date();
		//     var yearStr = nowDateTime.getFullYear().toString();
		//     var month = (nowDateTime.getMonth() + 1).toString();
		//     var monthStr = month.length > 1 ? month : "0" + month;
		//     var date = nowDateTime.getDate().toString();
		//     var dateStr = date.length > 1 ? date : "0" + date;
		//     return yearStr + "-" + monthStr + "-" + dateStr + " 00:00:00";
		// }

		//清空缓存的数据
		// function clearCache() {
		//     cacheData.path = null;
		//     cacheData.gpsDatas = null;
		//     cacheData.data = null;
		//     cacheData.dbcid = null;
		//     cacheData.dbcmd5 = null;
		//     cacheData.standardparameter = null;
		// }

		$(function () {
			initMap();
			setCarInfoData();
			loadingData();
			WebSocketFireEvent();
			loadEchartss();
		});
	});
})();
