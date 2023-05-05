(function () {
	require(["jquery", "layui", "echarts"], function ($, layui, echarts) {
		//引入css
		layui.link("Style/HistoricalTrackDisplayData.css?v=" + allConfig.urlArgs);
		//缓存的历史数据
		var historyData;
		//图表
		var myCharts = {
			//速度图表
			speedEchart: null,
			//折线图表
			lineEchart: null,
		};
		//穿梭框信息
		var transferInfo = {
			transfer: null,
			selected: [],
		};
		var templateHtml =
			'<div class="layui-row">' +
			'<div class="layui-col-xs3 div-canGroupName">' +
			"Can数据" +
			"</div>" +
			'<div class="layui-col-xs9 div-canGroupLine"></div>' +
			"</div>" +
			"{{# layui.each(d, function(index, item){ }}" +
			'<div class="layui-row">' +
			'<div class="layui-col-xs6 label-title label-height">' +
			'<label id="lb_title_{{ item.standardparametersid }}" >{{ item.varname }}：&nbsp;&nbsp;</label>' +
			"</div>" +
			'<div class="layui-col-xs6 label-height">' +
			'<label id="lb_value_{{ item.standardparametersid }}"></label>' +
			'<label id="lb_unit_{{ item.standardparametersid }}">{{ item.unit }}</label>' +
			"</div>" +
			"</div>" +
			"{{# }); }}";

		//获取历史数据
		function GetHistoryData() {
			var parentWindow = parent.window || window.parent;
			historyData = parentWindow.GetHistoryData();
		}

		//生成Can列表页面元素
		function GeneratePageElements() {
			var html = layui
				.laytpl(templateHtml)
				.render(historyData.standardparameter);
			$("#div_CarInfo").after("<div id='div_CarCan'></div>");
			$("#div_CarCan").append(html);
		}

		//加载选择数据项穿梭框
		function loadTransfer() {
			var transferData = [];
			var dbcvar = historyData.standardparameter;
			for (var i = 0; i < dbcvar.length; i++) {
				transferData.push({
					value: dbcvar[i].standardparametersid,
					title: dbcvar[i].varname,
				});
			}

			transferInfo.transfer = layui.transfer.render({
				elem: "#transfer_SelectDataItem", //绑定元素
				id: "transfer_SelectDataItem", //定义索引
				width: 260,
				height: 330,
				title: ["全部", "全部"],
				data: transferData,
				value: transferInfo.selected,
				text: {
					none: "无数据", //没有数据时的文案
					searchNone: "无数据", //搜索无匹配数据时的文案
				},
			});
		}

		//绑定按钮事件
		function loadBtn() {
			//选择数据项按钮
			$("#btnSelectDataItem").on("click", function () {
				layer.open({
					type: 1,
					title: "选择数据项",
					content: $("#layer_SelectDataItem"),
					area: ["100%", "100%"],
					closeBtn: 1,
					shade: 0.3,
					shadeClose: true,
					anim: 5,
					resize: false,
				});
			});

			//确定选择按钮
			$("#btnOK").on("click", function () {
				var data = layui.transfer.getData("transfer_SelectDataItem");
				if (data && data.length > 0) {
					var select = [];
					var legend = [];
					var series = [];
					for (var i = 0; i < data.length; i++) {
						select.push(data[i].value);
						legend.push(data[i].title);
						series.push({
							name: data[i].title,
							type: "line",
							showSymbol: false,
							data: [],
						});
					}
					transferInfo.selected = select;
					var lineEchartOpt = myCharts.lineEchart.getOption();
					lineEchartOpt.legend[0].data = legend;
					lineEchartOpt.series = series;
					myCharts.lineEchart.setOption(lineEchartOpt, true);
				} else {
					transferInfo.selected = [];
					var lineEchartOpt = myCharts.lineEchart.getOption();
					lineEchartOpt.legend[0].data = [];
					lineEchartOpt.series = [];
					myCharts.lineEchart.setOption(lineEchartOpt, true);
				}
				layer.close(layer.index);
			});

			//关闭按钮
			$("#btnClose").on("click", function () {
				layer.close(layer.index);
			});
		}

		//加载图表
		function loadEcharts() {
			var speedEchart = echarts.init(document.getElementById("speedEchart"));
			var lineEchart = echarts.init(document.getElementById("lineEchart"));
			var speedEchartOption = {
				tooltip: {
					formatter: "{a} <br/>{c} {b}",
				},
				series: [
					{
						name: "速度",
						type: "gauge",
						min: 0,
						max: 220,
						splitNumber: 11,
						startAngle: 210,
						endAngle: -30,
						radius: "120%",
						center: ["50%", "65%"],
						axisLine: {
							lineStyle: {
								color: [[1, "#000000"]],
								width: 3,
								shadowColor: "#000000",
								shadowBlur: 5,
							},
						},
						axisLabel: {
							textStyle: {
								fontWeight: "bolder",
								color: "#000000",
								shadowColor: "#000000",
								shadowBlur: 3,
							},
						},
						axisTick: {
							length: 10,
							lineStyle: {
								color: "#000000",
								shadowColor: "#000000",
								shadowBlur: 3,
							},
						},
						splitLine: {
							length: 15,
							lineStyle: {
								width: 2,
								color: "#000000",
								shadowColor: "#000000",
								shadowBlur: 3,
							},
						},
						pointer: {
							shadowColor: "#43ffac",
							shadowBlur: 3,
						},
						title: {
							offsetCenter: [0, "-30%"],
							textStyle: {
								fontWeight: "bolder",
								fontSize: 15,
								fontStyle: "italic",
								color: "#000000",
								shadowColor: "#000000",
								shadowBlur: 3,
							},
						},
						detail: {
							backgroundColor: "#000000",
							borderColor: "#000000",
							shadowColor: "#000000",
							shadowBlur: 3,
							offsetCenter: [0, "40%"],
							formatter: function (data) {
								return data + "km/h";
							},
							textStyle: {
								fontSize: 14,
								lineHeight: 14,
								color: "#ffffff",
							},
						},
						data: [{ value: 0, name: "km/h" }],
					},
				],
			};
			var lineEchartOption = {
				legend: {
					type: "scroll",
					left: "left",
					top: 15,
					data: [],
				},
				tooltip: {
					trigger: "axis",
					confine: true,
					axisPointer: {
						type: "cross",
						label: {
							backgroundColor: "#6a7985",
						},
					},
				},
				grid: {
					top: "22%",
					left: "0%",
					right: "5%",
					bottom: "1%",
					containLabel: true,
				},
				xAxis: {
					type: "time",
					splitLine: {
						show: false,
					},
				},
				yAxis: {
					type: "value",
				},
				series: [],
			};
			speedEchart.setOption(speedEchartOption);
			lineEchart.setOption(lineEchartOption);
			myCharts.speedEchart = speedEchart;
			myCharts.lineEchart = lineEchart;
		}

		/**
		 * 设置回放的进度
		 **/
		HistoricalTrackDisplayData_SetProgress = function (dataIndex) {
			var datas = historyData.data;

			var dbcvar = historyData.standardparameter;
			for (var i = 0; i < dbcvar.length; i++) {
				//设置显示的CAN数据
				var dbcvarid = dbcvar[i].standardparametersid;
				var labelValue = datas[dataIndex]["columns"][dbcvarid];
				if (typeof labelValue != "undefined")
					$("#lb_value_" + dbcvarid).html(labelValue);
			}

			//设置GPS速度图表数据
			myCharts.speedEchart.setOption({
				series: [
					{
						data: [
							{
								value: Math.round(datas[dataIndex].speed * 100) / 100,
								name: "km/h",
							},
						],
					},
				],
			});

			//设置CAN图表数据
			var series = myCharts.lineEchart.getOption().series;
			layui.each(transferInfo.selected, function (index, item) {
				if (series && series.length > 0) {
					var seriesData = series[index].data;
					if (dataIndex == seriesData.length) {
						//没有拖动进度条
						var travelTime = datas[dataIndex].tm;
						var valueData = datas[dataIndex]["columns"][item];
						seriesData.push([travelTime, Math.round(valueData * 100) / 100]);
					} else if (dataIndex > seriesData.length) {
						//往后拖动进度条
						for (var i = seriesData.length; i < dataIndex + 1; i++) {
							var travelTime = datas[i].tm;
							var valueData = datas[i]["columns"][item];
							seriesData.push([travelTime, Math.round(valueData * 100) / 100]);
						}
					} else if (dataIndex < seriesData.length) {
						//往前拖动进度条
						var startIndex = dataIndex + 1;
						var removeLength = seriesData.length - startIndex;
						seriesData.splice(startIndex, removeLength);
					}
				}
			});
			myCharts.lineEchart.setOption({
				series: series,
			});
		};

		$(function () {
			GetHistoryData();
			GeneratePageElements();
			loadTransfer();
			loadEcharts();
			loadBtn();
		});
	});
})();
