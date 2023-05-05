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
		"maphistory",
		"ajaxglobalconfig",
		"echarts",
		"carmarker",
	], function (
		$,
		layui,
		iMap,
		URL,
		MapHistory,
		ajaxglobal,
		echarts,
		carmarker
	) {
		layui.link("Style/HistoricalTrack.css?v=" + allConfig.urlArgs);
		layui.link("Resource/icon/iconfont/iconfont.css?v=" + allConfig.urlArgs);
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
		//车辆ID
		var carID = getQueryString("id");
		//车辆编号
		var carno = getQueryString("carno");
		var jieguo;
		var time;
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
		//地图对象
		var map;
		var terminalcode;
		//点标记对象
		var marker;
		var marker2;
		var marker1;
		var carIcon;
		var lineEchart;
		//参数选择can数据显示
		var canData = [];
		var canLengend = [];
		var canid = [];
		var can1 = [];
		var can2 = [];
		var can3 = [];
		var canList = [];
		//点标记上的信息窗体对象
		var infoWindow;
		//轨迹回放对象
		var mapHistory;
		//缓存的数据
		var cacheData = {
			path: null, //坐标数组[{lat:xx,lng:xx,angle:xx}]
			gpsDatas: null, //Gps数据数组[{mileage:xx,speed:xx}]
			data: null, //历史数据
			dbcid: null, //DBCID
			dbcmd5: null, //DBC的MD5
			standardparameter: null, //参数标准化信息
		};
		//滑块对象
		var slider;
		//播放的参数
		var playParameter = {
			playing: false, //是否正在播放
			pause: false, //是否暂停
			playProgress: 0, //播放的进度
		};
		//关闭

		//can数据
		var templateHtml =
			"{{# layui.each(d, function(index, item){ }}" +
			'<div class="layui-row" style="display:flex;justify-content: space-between;border-bottom: 1px solid #000;">' +
			'<div class="layui-col-xs6 label-title label-height" style="color:#7C8590;">' +
			'<label id="lb_title_{{ item.standardparametersid }}" >{{item.name }}：&nbsp;&nbsp;</label>' +
			"</div>" +
			'<div class="layui-col-xs6 label-height" style="text-align:end;color:#44546F;">' +
			'<label id="lb_value_{{ item.standardparametersid }}">{{item.value.toFixed(3)}}&nbsp;</label>' +
			"<label id=\"lb_unit_{{ item.standardparametersid }}\">{{  item.unit==='null' || item.unit===null ? '  ': item.unit }}</label>" +
			"</div>" +
			"</div>" +
			"{{# }); }}";

		//生成Can列表页面元素
		function GeneratePageElements() {
			var html = layui.laytpl(templateHtml).render(canData);

			$("#carcontent").html("");
			$("#carcontent").append(html);
		}

		//设置车辆信息值
		function setCarInfoData() {
			$.ajax({
				type: "POST",
				url: URL.car.getCarInfoModelByCarID,
				cache: false,
				dataType: "json",
				data: { carid: carID },
				success: function (result) {
					if (result.state == 1) {
						var data = result.data;
						terminalcode = data.terminalcode;
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

		function innit() {
			carIcon = sessionStorage.getItem("key");
			console.log(carIcon, "car");
			// 抽屉车辆信息div高度
			var height1;
			// 抽屉视频信息div高度
			var height2;
			// can数据div高度
			var canHeight = $("#canInfo").height();
			// can数据图div高度
			var echartsHeight = $("#canEcharts").height();
			height2 = $("#videoInfo").height();
			height1 = $("#carInfo").height();
			if ($("#carInfo").is(":hidden")) {
				$("#canEcharts").height(echartsHeight + height2 / 2);
				$("#canInfo").height(canHeight + height2 / 2);
			}
			$(".cont").height($("#canEcharts").height() - 29);
			$("#lineecharts").height($("#canEcharts").height() - 29);
		}

		//加载搜索
		function loadSearch() {
			$("#lb_SimpleData_CarNo").html(carno);
			layui.laydate.render({
				elem: "#txt_StartTimeSearch",
				type: "datetime",
				format: "yyyy-MM-dd HH:mm:ss",
				value: GetCurrentDate(),
			});
			layui.laydate.render({
				elem: "#txt_EndTimeSearch",
				type: "datetime",
				format: "yyyy-MM-dd HH:mm:ss",
				value: new Date(),
			});

			// 抽屉车辆信息div高度
			var height1;
			// 抽屉视频信息div高度
			var height2;
			// can数据div高度
			var canHeight = $("#canInfo").height();
			// can数据图div高度
			var echartsHeight = $("#canEcharts").height();
			//$("#closeButton1").on('click', function () {
			//console.log(111111111111111111111111111111)
			//  height1 = $("#carInfo").height()
			//   height2 = $("#videoInfo").height()
			//    $("#carInfo").hide();
			//  if ($("#videoInfo").is(":hidden")) {
			// $("#canEcharts").css("height",echartsHeight+height2);
			//        $("#canEcharts").height(echartsHeight + height2)
			//         $("#canInfo").height(canHeight + height1)
			//     } else {
			//      $("#canEcharts").height(echartsHeight + height1 / 2)
			//          $("#canInfo").height(canHeight + height1 / 2)
			//    }
			//   $(".cont").height($("#canEcharts").height() - 29)
			//      $("#lineecharts").height($("#canEcharts").height() - 29)
			//    loadEcharts()
			//   })
			$("#closeButton2").on("click", function () {
				height2 = $("#videoInfo").height();
				// height1 = $("#carInfo").height()
				$("#videoInfo").hide();
				$(".but").css({ display: "flex" });
				//    if ($("#carInfo").is(":hidden")) {
				// $("#canEcharts").height(echartsHeight + height2)
				//  $("#canInfo").height(canHeight + height1)
				//  } else {
				$("#canEcharts").height(echartsHeight + height2 / 2);
				$("#canInfo").height(canHeight + height2 / 2);
				$("#carcontent").height($("#canInfo").height() - 29);
				//}

				$(".cont").height($("#canEcharts").height() - 29);
				//$("#lineecharts").height($("#canEcharts").height() - 29)
				if (lineEchart) {
					loadEcharts();
				}
			});

			$(".left").on("click", function () {
				if ($(".leftNav").css("left") != "0px") {
					//console.log($('.imgleft').css('src'))
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
					$(".imgleft").attr("src", "Resource/icon/icon_shouqi.png");
				} else {
					//console.log($('.imgleft').css('src'))
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
					$(".imgleft").attr("src", "Resource/icon/icon_kaizhan.png");
				}
			});

			$(".but").on("click", function () {
				$("#videoInfo").show();
				$(".but").hide();
				$("#canEcharts").height(228);
				$("#canInfo").height(228);
				$("#carcontent").height($("#canInfo").height() - 29);
				$(".cont").height($("#canEcharts").height() - 29);
				$("#lineecharts").height($("#canEcharts").height() - 29);
				if (lineEchart) {
					loadEcharts();
				}
			});

			//搜索
			$("#btn_Search").on("click", function () {
				clearCache();
				filterParams();
				marker.show();
				GeneratePageElements();
			});

			//参数设置
			$("#btn_AdvancedSearch").on("click", function () {
				$.ajax({
					type: "POST",
					url: URL.historicalTrack.historicalTrackGetDBC,
					cache: false,
					dataType: "json",
					data: {
						carid: carID,
						starttime: $("#txt_StartTimeSearch").val(),
						endtime: $("#txt_EndTimeSearch").val(),
					},
					success: function (result) {
						if (result.state === 1) {
							var data = result.data;
							if (data && data.length > 0) {
								selectDBC(data);
								return;
							}
						}
						layer.msg("此时间段内没有使用DBC，只能进行普通查询!", {
							icon: 0,
						});
					},
				});
			});
		}

		//加载图表
		function loadEcharts() {
			//lineEchart = echarts.init(document.getElementById('lineecharts'));
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
						data: canList,
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
						data: can1,
						markLine: {
							symbol: ["none", "none"], //去掉箭头
							itemStyle: {
								normal: {
									lineStyle: {
										type: "solid",
										color: "#000",
									},
									label: {
										show: true,
										position: "middle",
									},
								},
							},
							data: [
								{
									xAxis: "", //这里设置false是隐藏不了的，可以设置为-1
								},
							],
						},
					},
					{
						name: canLengend[1],
						type: "line",
						yAxisIndex: 1,
						data: can2,
					},
					{
						name: canLengend[2],
						type: "line",
						yAxisIndex: 2,
						data: can3,
					},
				],
			};
			lineEchart = echarts.init(document.getElementById("lineecharts"));
			lineEchart.resize();

			lineEchart.setOption(lineEchartOption, true);
			// lineEchart.setOption(lineEchartOption);
		}

		//选择DBC
		function selectDBC(data) {
			// var tplStr = '<div class="layui-form layui-fluid" style="margin-top: 15px;">' +
			//     "<fieldset class='layui-elem-field'>" +
			//     "<legend>选择DBC</legend>" +
			//     "<div class='layui-field-box' style='text-align: center;'>" +
			//     '{{#  layui.each(d, function(index, item){ }}' +
			//     '<div>' +
			//     '<input type="radio" name="radio_dbc" value="{{ item.dbcid }}" title="{{ item.filename }}" {{ index==0 ? "checked":"" }}>' +
			//     '</div>' +
			//     '{{#  }); }}' +
			//     "</div>" +
			//     "</fieldset>" +
			//     '</div>';
			// layer.open({
			//     type: 1,
			//     title: "高级查询",
			//     area: ['440px', '500px'], //宽高
			//     content: layui.laytpl(tplStr).render(data),
			//     closeBtn: 1,
			//     btn: ['确认', '取消'],
			//     btnAlign: 'c',
			//     yes: function (index, layero) {
			// clearCache();
			// var dbcid = $("input[name='radio_dbc']:checked").val();
			var md5 = "";
			// for (var i = 0; i < data.length; i++) {
			// if (dbcid == data[i].dbcid) {
			md5 = data[0].md5;

			// cacheData.dbcid = dbcid;
			cacheData.dbcmd5 = md5;
			// break;
			// }
			// }
			// layer.close(layer.index);
			selectStandardParameters(md5);
			// },
			// btn2: function () {
			//     return true;
			// },
			// cancel: function () {
			//     return true;
			// }
			// });
			// layui.form.render("radio");
		}

		//选择通道
		function selectStandardParameters(md5) {
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
								var getData = layui.transfer.getData("transfer_SelectDataItem");
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
								cacheData.standardparameter = selectData;
								var standardparameterStr = "";
								for (var i = 0; i < selectData.length; i++) {
									standardparameterStr +=
										selectData[i].standardparametersid + ",";
								}
								standardparameterStr = standardparameterStr.substr(
									0,
									standardparameterStr.length - 1
								);
								layer.close(layer.index);
								filterParams(md5, standardparameterStr);
								GeneratePageElements();
								loadEcharts();
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
				error: function () {
					filterParams();
				},
			});
		}

		//筛选参数
		function filterParams(md5, sp) {
			var paramsData = {
				cd: carID,
				bg: $("#txt_StartTimeSearch").val(),
				ed: $("#txt_EndTimeSearch").val(),
			};
			// paramsData["fixedColumns"] = "TRAVELTIME,LATITUDE,LONGITUDE,DIRECTION,MILEAGE,SPEED";
			paramsData["fixedColumns"] = "";
			if (md5 && sp) {
				paramsData["md"] = md5;
				paramsData["standards"] = sp;
				layer.load(2, {
					shade: 0.7,
				});
				getHistoricalTrack(paramsData);
			} else {
				layer.load(2, {
					shade: 0.7,
				});
				getHistoricalTrack(paramsData);
			}
		}

		function analysCanList(result) {
			var arr = Object.keys(result.columns);
			canLengend = [];
			can1 = [];
			can2 = [];
			can3 = [];
			canList = [];
			arr.forEach((item) => {
				canLengend.push(result.columns[item].name);
			});

			result.dataList.forEach((item, index) => {
				can1.push(item.columns[arr[0]]);
				can2.push(item.columns[arr[1]]);
				can3.push(item.columns[arr[2]]);
				canList.push(item.tm);
			});
			//console.log(arr,canLengend,can1,can2,can3)
		}

		//获取历史轨迹
		function getHistoricalTrack(paramsData) {
			$.ajax({
				type: "POST",
				url: URL.historicalTrack.historicalTrackPlayback,
				data: paramsData,
				cache: false,
				timeout: 6 * 60 * 1000, //超时时间：6分钟
				dataType: "json",
				success: function (result) {
					layer.closeAll("loading");
					if (result) {
						if (
							result.resultCode == 0 &&
							result.dataList &&
							result.dataList.length > 0
						) {
							jieguo = result;
							//console.log(result, 'result111')
							$("#lb_SimpleData_minSpeed").html(
								parseInt(result.averageVelocity) + " km/h"
							);
							$("#lb_SimpleData_maxSpeed").html(
								parseInt(result.maxSpeed) + " km/h"
							);
							cacheData.data = result.dataList;
							analysCanData(result);
							analysCanList(result);
							analysisAndCalculateData(result.dataList);
							drawHistoricalTrack();
							refreshInfoWindow();
							loadEcharts();
						}
						if (result.resultCode != 0) {
							layer.msg(result.msg + "！", {
								icon: 0,
							});
						}
						if (result.msg) {
							//console.log("历史轨迹回放查询历史轨迹接口返回的消息：" + result.msg);
						}
					}
				},
				error: function () {
					layer.msg("历史轨迹查询失败！", {
						icon: 0,
					});
					layer.closeAll("loading");
				},
			});
		}

		//解析和计算数据
		function analysisAndCalculateData(data) {
			calculateMileageData(data);
			analysisData(data);
		}

		// 解析can数据
		function analysCanData(data) {
			var colums = Object.keys(data.columns);
			//console.log('colums: ', colums);
			for (var i = 0; i < colums.length; i++) {
				var canColums = {
					name: data.columns[colums[i]].name,
					unit: data.columns[colums[i]].unit,
					value: null,
					column: colums[i],
				};
				canData.push(canColums);
			}
		}

		//绘制历史轨迹
		function drawHistoricalTrack() {
			//console.log('cacheData.gpsDatas',cacheData.gpsDatas);
			var path = [];
			mapHistory = map.createMapHistory({
				marker: marker,
				lineStyle: {
					strokeColor: "#FF6464",
					strokeOpacity: 1,
					strokeWeight: 6,
					strokeStyle: "solid",
					showDir: false,
					lineCap: "round",
				},
				cacheData: cacheData.gpsDatas,
			});
			mapHistory.on("running", function (progress, total) {
				var p = ~~((progress / total) * 100);
				playParameter.playProgress = p;
				slider.setValue(p);
				refreshCanData(progress);
				if (infoWindow) refreshInfoWindow(progress);
				if (
					typeof iframeHistoricalTrackDisplayData != "undefined" &&
					iframeHistoricalTrackDisplayData != null
				) {
					var iframeDisplayData =
						iframeHistoricalTrackDisplayData.window ||
						iframeHistoricalTrackDisplayData.contentWindow;
					if (
						iframeDisplayData &&
						typeof iframeDisplayData.HistoricalTrackDisplayData_SetProgress ==
							"function"
					)
						iframeDisplayData.HistoricalTrackDisplayData_SetProgress(progress);
				}
			});
			mapHistory.on("end", function () {
				playParameter.pause = false;
				playParameter.playing = false;
				pauseChangeIntoStart();
			});
			$.extend(true, path, cacheData.path);
			mapHistory.draw(path);
			map.setZoomAndCenter(15, path[0]);

			marker1 = map.createMarker({
				lat: cacheData.path[cacheData.path.length - 1].lat,
				lng: cacheData.path[cacheData.path.length - 1].lng,
				isCustom: false,
				visible: false,
				icon: allConfig.baseDirectory + "Resource/icon/zhongdian.png",
				offset: {
					x: -13,
					y: -26,
				},
			});

			marker2 = map.createMarker({
				lat: cacheData.path[0].lat,
				lng: cacheData.path[0].lng,
				isCustom: false,
				visible: false,
				icon: allConfig.baseDirectory + "Resource/icon/qidian.png",
				offset: {
					x: -13,
					y: -26,
				},
			});
		}

		//计算并显示里程数据
		function calculateMileageData(data) {
			var minMileage = 0;
			var maxMileage = 0;
			for (var i = 0; i < data.length; i++) {
				if (data[i].mil && data[i].mil != 0) {
					minMileage = data[i].mil;
					break;
				}
			}
			for (var i = data.length - 1; i >= 0; i--) {
				if (data[i].mil && data[i].mil != 0) {
					maxMileage = data[i].mil;
					break;
				}
			}
			var mileage = maxMileage - minMileage;
			$("#lb_SimpleData_Mileage").html(mileage.toFixed(1) + "km");
		}

		//解析数据
		function analysisData(data) {
			var path = [];
			var gpsDatas = [];
			layui.each(data, function (index, item) {
				var pathData = {
					lng: item.lon,
					lat: item.lat,
					angle: item.dt,
				};
				var gpsData = {
					traveltime: item.tm,
					mileage: item.mil,
					speed: item.speed,
				};
				path.push(pathData);
				gpsDatas.push(gpsData);
			});
			cacheData.path = path;
			cacheData.gpsDatas = gpsDatas;
		}

		//初始化地图
		function initMap() {
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
			marker = map.createMarker({
				lat: 39.6733704835841,
				lng: 119.200229835938,
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
			marker.on("click", function () {
				if (infoWindow && mapHistory) {
					var path;
					if (!playParameter.playing && !playParameter.pause)
						path = cacheData.path[0];
					else path = cacheData.path[mapHistory.getProgress()];
					infoWindow.open({
						lat: path.lat,
						lng: path.lng,
					});
				}
			});
			infoWindow = map.createInfoWindow({
				width: "260px",
				title: "车辆信息",
				autoMove: false,
				content: [
					{
						label: "车辆编号：",
						value: carno,
					},
					{
						label: "数据时间：",
						value: "",
					},
					{
						label: "GPS车速：",
						value: "0km/h",
					},
					{
						label: "GPS里程：",
						value: "0km",
					},
				],
				icon: "i-icon-carinfo",
				offset: {
					x: 0,
					y: -30,
				},
			});
			//               mapHistory = map.createMapHistory({
			//                 marker: marker,
			//                lineStyle: {
			//                  strokeColor: '#FF6464',
			//                   strokeOpacity: 1,
			//                  strokeWeight: 6,
			//                   strokeStyle: "solid",
			//                 showDir: false
			//            }
			//           });
			//          mapHistory.on("running", function (progress, total) {
			//             var p = ~~(progress / total * 100);
			//            playParameter.playProgress = p;
			//            slider.setValue(p);
			//             if (infoWindow)
			//                refreshInfoWindow(progress);

			//           if (typeof iframeHistoricalTrackDisplayData != "undefined" &&
			//              iframeHistoricalTrackDisplayData != null) {
			//              var iframeDisplayData = iframeHistoricalTrackDisplayData.window ||
			//                iframeHistoricalTrackDisplayData.contentWindow;
			//           if (iframeDisplayData && typeof iframeDisplayData
			//                .HistoricalTrackDisplayData_SetProgress == "function")
			//             iframeDisplayData.HistoricalTrackDisplayData_SetProgress(progress);
			//      }
			//     });
			//     mapHistory.on("end", function () {
			//        playParameter.pause = false;
			//         playParameter.playing = false;
			//        pauseChangeIntoStart();
			//     });
		}

		//初始化按钮及滑块
		function initBtnAndSlider() {
			//拖动历史轨迹回放进度的滑块
			slider = layui.slider.render({
				elem: "#slider_PlayProgress", //绑定元素
				change: function (val) {
					if (val !== playParameter.playProgress) {
						playParameter.playProgress = val;
						var value = ~~((val * mapHistory.getMax()) / 100);
						if (value >= mapHistory.getMax()) {
							value = mapHistory.getMax() - 1;
						}
						mapHistory.setProgress(value);
					}
				},
			});
			layui.form.on("select(cb_PlaySpeed)", function (element) {
				mapHistory.setSpeed(element.value);
			});
			//进入历史轨迹回放按钮单击事件
			$("#btn_EnterHistoricalTrackPlayback").on("click", function () {
				if (!mapHistory) {
					layer.msg("请先进行查询操作！", {
						icon: 0,
					});
					return;
				}
				if (!mapHistory.getMax()) {
					layer.msg("无历史轨迹数据！", {
						icon: 0,
					});
					return;
				}
				showPlaybackToolbar();
				hideBtnAndSearchToolbar();
				marker.show();
				mapHistory.setSpeed($("#cb_PlaySpeed").val());

				$(".leftNav").css({
					left: "-30%",
					transition: "left 1s",
				});
				$(".left").css({
					left: "0px",
					transition: "left 1s",
				});
				$(".imgleft").attr("src", "Resource/icon/icon_kaizhan.png");
			});
			//退出历史轨迹回放按钮单击事件
			$("#btn_DropOutHistoricalTrackPlayback").on("click", function () {
				hidePlaybackToolbar();
				showBtnAndSearchToolbar();
				historicalTrackStop();

				$(".leftNav").css({
					left: "0",
					transition: "left 1s",
				});
				$(".left").css({
					left: "30%",
					transition: "left 1s",
				});
				$(".imgleft").attr("src", "Resource/icon/icon_shouqi.png");

				//marker.hide();
			});
			//开始或暂停轨迹回放按钮单击事件
			$("#btn_StartOrPause").on("click", function () {
				if (!playParameter.playing && !playParameter.pause) {
					startChangeIntoPause();
					historicalTrackStart();
				} else if (!playParameter.playing && playParameter.pause) {
					startChangeIntoPause();
					historicalTrackContinue();
				} else if (playParameter.playing && !playParameter.pause) {
					pauseChangeIntoStart();
					historicalTrackPause();
				}
			});
			//停止轨迹回放按钮单击事件
			$("#btn_Stop").on("click", function () {
				historicalTrackStop();
				pauseChangeIntoStart();
			});
			//同步回放数据按钮单击事件
			$("#btn_ShowDisplayData").on("click", function () {
				if (!cacheData.data) {
					layer.msg("在此时间段内没有数据！", {
						icon: 2,
					});
					return;
				}
				if (!cacheData.dbcid || !cacheData.dbcmd5) {
					layer.msg("在此时间段内未绑定DBC！", {
						icon: 2,
					});
					return;
				}
				if (
					!cacheData.standardparameter ||
					cacheData.standardparameter.length == 0
				) {
					layer.msg("在此时间段内没有DBC通道！", {
						icon: 2,
					});
					return;
				}
				layer.open({
					type: 1,
					title: "同步回放数据",
					id: "i_Layer_HistoricalTrackDisplayData",
					content:
						"<iframe id='iframeHistoricalTrackDisplayData' name='iframeHistoricalTrackDisplayData' scrolling='auto' frameborder='0' src='HistoricalTrackDisplayData.html' style='width:100%; height:100%; display:block;'></iframe>",
					area: ["650px", "500px"],
					offset: "rt",
					shade: 0,
					closeBtn: 1,
					resize: false,
				});
			});
		}

		//   刷新can数据
		function refreshCanData(progress) {
			var series = lineEchart.getOption().series;
			if (canData) {
				if (
					progress == null ||
					typeof progress == "undefined" ||
					!isNaN(progress)
				) {
					progress = mapHistory.getProgress();
				}
				canData.forEach((item) => {
					series[0].markLine.data[0].xAxis = cacheData.data[progress].tm;
					item.value = cacheData.data[progress].columns[item.column];
				});
				//console.log((series[0].markLine).data[0],'mark')
				lineEchart.setOption({
					series: series,
				});
				GeneratePageElements();
				map.setZoomAndCenter([3, 18], cacheData.path[progress]);

				//console.log('canData',canData)
			}
		}

		//刷新窗体数据及对定位
		function refreshInfoWindow(progress) {
			if (infoWindow && cacheData.gpsDatas) {
				if (
					progress == null ||
					typeof progress == "undefined" ||
					!isNaN(progress)
				)
					progress = mapHistory.getProgress();
				var data = cacheData.gpsDatas[progress];
				var content = [
					{
						label: "车辆编号：",
						value: carno,
					},
					{
						label: "数据时间：",
						value: data.traveltime,
					},
					{
						label: "GPS车速：",
						value: data.speed.toFixed(3) + "km/h",
					},
					{
						label: "GPS里程：",
						value: data.mileage.toFixed(3) + "km",
					},
				];
				infoWindow.setContent({
					content: content,
				});
				var path = cacheData.path[progress];
				infoWindow.setPosition({
					lat: path.lat,
					lng: path.lng,
				});
			}
		}

		//开始历史回放
		function historicalTrackStart() {
			mapHistory.start();
			playParameter.playing = true;
			playParameter.pause = false;
		}

		//暂停历史回放
		function historicalTrackPause() {
			mapHistory.pause();
			playParameter.playing = false;
			playParameter.pause = true;
		}

		//继续历史回放
		function historicalTrackContinue() {
			mapHistory.resume();
			playParameter.playing = true;
			playParameter.pause = false;
		}

		//停止历史回放
		function historicalTrackStop() {
			mapHistory.stop();
			playParameter.playing = false;
			playParameter.pause = false;
			playParameter.playProgress = 0;
			slider.setValue(playParameter.playProgress);
			refreshInfoWindow(0);
		}

		//显示回放工具栏
		function showPlaybackToolbar() {
			$("#i-PlaybackToolbar").show();
			$("#i-Btn-ShowDisplayData").show();
		}

		//隐藏回放工具栏
		function hidePlaybackToolbar() {
			$("#i-PlaybackToolbar").hide();
			$("#i-Btn-ShowDisplayData").hide();
		}

		//显示搜索历史轨迹工具栏和进入历史轨迹回放按钮
		function showBtnAndSearchToolbar() {
			$("#i-SearchTrackToolbar").show();
			$("#i-Btn-EnterPlayback").show();
		}

		//隐藏搜索历史轨迹工具栏和进入历史轨迹回放按钮
		function hideBtnAndSearchToolbar() {
			$("#i-SearchTrackToolbar").hide();
			$("#i-Btn-EnterPlayback").hide();
		}

		//暂停按钮变成开始按钮
		function pauseChangeIntoStart() {
			$("#btn_StartOrPause")
				.removeClass("icon-tingzhi")
				.addClass("icon-bofang1");
			$("#btn_StartOrPause").attr("title", "开始");
		}

		//开始按钮变成暂停按钮
		function startChangeIntoPause() {
			$("#btn_StartOrPause")
				.removeClass("icon-bofang1")
				.addClass("icon-tingzhi");
			$("#btn_StartOrPause").attr("title", "暂停");
		}

		//销毁轨迹回放
		function mapHistoryDestroy() {
			mapHistory.destroy();
			delete mapHistory;
			mapHistory = null;
		}

		//获取当前日期，格式为：yyyy-MM-dd HH:mm:ss
		function GetCurrentDate() {
			var nowDateTime = new Date();
			var yearStr = nowDateTime.getFullYear().toString();
			var month = (nowDateTime.getMonth() + 1).toString();
			var monthStr = month.length > 1 ? month : "0" + month;
			var date = nowDateTime.getDate().toString();
			var dateStr = date.length > 1 ? date : "0" + date;
			return yearStr + "-" + monthStr + "-" + dateStr + " 00:00:00";
		}

		//清空缓存的数据
		function clearCache() {
			cacheData.path = null;
			cacheData.gpsDatas = null;
			cacheData.data = null;
			cacheData.dbcid = null;
			cacheData.dbcmd5 = null;
			cacheData.standardparameter = null;
		}

		//获取历史数据（HistoricalTrackDisplayData页面用）
		GetHistoryData = function () {
			return {
				data: cacheData.data,
				dbcid: cacheData.dbcid,
				dbcmd5: cacheData.dbcmd5,
				standardparameter: cacheData.standardparameter,
			};
		};

		$(function () {
			innit();
			initMap();
			setCarInfoData();

			AddIfreamVideo(terminalcode);
			loadSearch();
			initBtnAndSlider();
			loadEcharts();
		});
	});
})();
