(function () {
	//配置信息
	var allConfig = {};
	//是否是调试模式
	allConfig["debug"] = false;
	//版本号
	allConfig["version"] = "2.0.0";
	//请求静态资源附带参数
	allConfig["urlArgs"] = allConfig.debug
		? new Date().getTime()
		: allConfig.version;
	//基目录
	allConfig["baseDirectory"] = "/MapWeb/";
	//web地址
	allConfig["webBase"] = "/";
	//webHTTP接口地址
	allConfig["webHttpApiBase"] = "http://roads.fawjiefang.com.cn/mapwebapi";
	//WebSocket服务网址
	allConfig["wslocation"] = "wss://mapsocker.fawjiefang.com.cn:8803";
	//是否跨域
	allConfig["CrossDomain"] = false;
	//高精度图层
	allConfig["highPrecisionMappingLayer"] =
		"http://roads.fawjiefang.com.cn/mapUri/GetMapPics";
	//驾驶模式字段
	allConfig["filedDrivingMode"] = "autopilot";
	//高德JS API的key
	allConfig["amapJsKey"] = "250b397b215033098f098049cca64bc2";
	//高德Web服务API的key
	allConfig["amapWebServiceKey"] = "db6e89566b834a9d4d76ae8d89a41b63";
	//高德JS API的地址
	allConfig["amapJsSrc"] =
		"http://webapi.amap.com/maps?v=1.4.15&key=" + allConfig.amapJsKey;
	//试验信息列表
	allConfig["index"] = 0;
	//指示器是否显示
	allConfig["show"] = true;
	//指示器显示数量
	allConfig["num"] = 3;
	//把配置信息对象的作用域提升到全局
	window.allConfig = allConfig;

	//如果页面引入了requireJS，就添加require配置
	if (typeof require != "undefined") {
		//require配置信息
		require.config({
			baseUrl: allConfig.baseDirectory,
			urlArgs: allConfig.urlArgs,
			//超时时间(s)
			waitSeconds: 30,
			paths: {
				jquery: "Src/jquery/jquery.min",
				layui: "Src/layui/layui/layui.all",
				echarts: "Src/echarts/echarts.min",
				moment: "Src/moment/moment-with-locales.min",
				customevent: "Src/customevent",
				async: "Src/async",
				URL: "Script/requestUrls",
				mapurl: allConfig.amapJsSrc,

				imap: "Script/map/iMap",
				gpsconvert: "Script/map/AMap/GpsCoodCorrect",
				map: "Script/map/AMap/Map",
				marker: "Script/map/AMap/Marker",
				polyline: "Script/map/AMap/Polyline",
				maphistory: "Script/map/AMap/MapHistory",
				infowindow: "Script/map/AMap/InfoWindow",
				markerclusterer: "Script/map/AMap/MarkerClusterer",
				contextmenu: "Script/map/AMap/ContextMenu",

				mymap: "Script/modules/mymap",
				hovertips: "Script/modules/hoverTips",
				iadvancedsearch: "Script/modules/iAdvancedSearch",
				websocket: "Script/modules/WebSocket",
				gpslayerswitching: "Script/modules/GPSLayerSwitching",
				carstatuestatistics: "Script/modules/CarStatueStatistics",
				caralarm: "Script/modules/CarAlarm",
				savecheckstatus: "Script/modules/SaveCheckStatus",
				selectcaricon: "Script/modules/SelectCarIcon",
				ajaxglobalconfig: "Script/modules/AjaxGlobalConfig",
				cargroup: "Script/modules/CarGroup",

				carmarker: "Script/modules/positions/carmarker",
				carsposition: "Script/modules/positions/carsposition",
				equipmentposition: "Script/modules/positions/equipmentposition",
			},
			/**
			 * 手动指定依赖关系
			 */
			shim: {
				layui: {
					deps: ["jquery"],
					exports: "layui",
				},
			},
		});
	}
})();
