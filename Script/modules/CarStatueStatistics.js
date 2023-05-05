//展示统计在线车辆、离线车辆模块
define(["jquery", "layui", "URL"], function ($, layui, URL) {
	//引入css
	layui.link("Style/modules/CarStatueStatistics.css?v=" + allConfig.urlArgs);

	function load() {
		loadCarStatistics();
		window.setInterval(loadCarStatistics, 60 * 1000);
	}

	function loadCarStatistics() {
		$.ajax({
			type: "POST",
			url: URL.car.getCarAllStatus,
			cache: false,
			dataType: "json",
			success: function (result) {
				if (result && result.state == 1) {
					var data = result.data;
					$("#i_Layer_CarStatisticsValueOnline").html(data.onlinenum);
					$("#i_Layer_CarStatisticsValueOutline").html(data.outlinenum);
				}
			},
		});
	}

	load();
});
