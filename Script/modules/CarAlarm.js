//车辆报警
define(["jquery", "layui", "URL"], function ($, layui, URL) {
	//引入css
	layui.link("Style/modules/CarAlarm.css?v=" + allConfig.urlArgs);

	var template =
		'<div id="module_ViewCarAlarm" style="display: none;">' +
		'<div class="layui-tab layui-tab-brief" lay-filter="CarAlarm_AlarmTab_Filter">' +
		'<ul class="layui-tab-title">' +
		'<li class="layui-this">平台自定义报警</li>' +
		"<li>终端自定义报警</li>" +
		"<li>电子围栏报警</li>" +
		"</ul>" +
		'<div class="layui-tab-content CarAlarm_TabContent">' +
		'<div class="layui-tab-item layui-show">' +
		'<div id="CarAlarm_tbWebCustomizeAlarm" lay-filter="CarAlarm_tbWebCustomizeAlarm_Filter" style="margin: 0px;">' +
		"</div>" +
		"</div>" +
		'<div class="layui-tab-item">' +
		'<div id="CarAlarm_tbTerminalCustomizeAlarm" lay-filter="CarAlarm_tbTerminalCustomizeAlarm_Filter"></div>' +
		"</div>" +
		'<div class="layui-tab-item">' +
		'<div id="CarAlarm_tbElectricFenceAlarm" lay-filter="CarAlarm_tbElectricFenceAlarm_Filter"></div>' +
		"</div>" +
		"</div>" +
		"</div>" +
		"</div>";

	var tableWebCustomizeAlarm = null;
	var tableTerminalCustomizeAlarm = null;
	var tableElectricFenceAlarm = null;

	//加载表格
	function loadTable() {
		//平台自定义报警表格
		tableWebCustomizeAlarm = layui.table.render({
			elem: "#CarAlarm_tbWebCustomizeAlarm",
			id: "CarAlarm_tbWebCustomizeAlarm",
			// height: 500,
			skin: "line",
			data: [],
			cols: [
				[
					{ field: "id", title: "ID", hide: true },
					{ field: "carno", title: "车辆编码", align: "center" },
					{ field: "rulename", title: "报警规则", align: "center" },
					{ field: "begin", title: "开始时间", align: "center" },
					{ field: "end", title: "结束时间", align: "center" },
				],
			],
		});
		//终端自定义报警表格
		tableTerminalCustomizeAlarm = layui.table.render({
			elem: "#CarAlarm_tbTerminalCustomizeAlarm",
			id: "CarAlarm_tbTerminalCustomizeAlarm",
			// height: 500,
			skin: "line",
			data: [],
			cols: [
				[
					{ field: "id", title: "ID", hide: true },
					{ field: "carno", title: "车辆编码", align: "center" },
					{ field: "rulename", title: "规则名称", align: "center" },
					{ field: "starttime", title: "开始时间", align: "center" },
					{ field: "endtime", title: "结束时间", align: "center" },
				],
			],
		});
		//电子围栏报警表格
		tableElectricFenceAlarm = layui.table.render({
			elem: "#CarAlarm_tbElectricFenceAlarm",
			id: "CarAlarm_tbElectricFenceAlarm",
			// height: 500,
			skin: "line",
			data: [],
			cols: [
				[
					{ field: "id", title: "ID", hide: true },
					{ field: "carno", title: "车辆编码", align: "center" },
					{ field: "railname", title: "围栏名称", align: "center" },
					{
						title: "触发类型",
						align: "center",
						templet: function (d) {
							var txt = "";
							switch (d.type) {
								case 1:
									txt = "离开";
									break;
								case 2:
									txt = "进入";
									break;
							}
							return txt;
						},
					},
					{ field: "begin", title: "开始时间", align: "center" },
					{ field: "end", title: "结束时间", align: "center" },
				],
			],
		});
	}

	function RefreshTable() {
		window.setTimeout(function () {
			$.ajax({
				type: "POST",
				url: URL.carAlarm.getCarAlarmInfo,
				cache: false,
				dataType: "json",
				success: function (result) {
					if (result && result.state == 1) {
						var data = result.data;
						$("#d1").text = data.TerminalCustomizeAlarm[0].carno;
						tableWebCustomizeAlarm.reload({ data: data.WebCustomizeAlarm });
						tableTerminalCustomizeAlarm.reload({
							data: data.TerminalCustomizeAlarm,
						});
						tableElectricFenceAlarm.reload({ data: data.ElectricFenceAlarm });
					} else {
						layer.msg(result.msg, { icon: 2 });
					}
					RefreshTable();
				},
			});
		}, 60000);
	}

	function loadCarAlarmModule() {
		$("body").append(template);
		layui.element.render("tab", "CarAlarm_AlarmTab_Filter");

		loadTable();
		RefreshTable();
	}

	$(function () {
		loadCarAlarmModule();
	});
});
