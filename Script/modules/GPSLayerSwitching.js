//街道模式、卫星模式切换模块
define(["jquery", "layui", "mymap"], function ($, layui, MyMap) {
	//引入css
	layui.link("Style/modules/GPSLayerSwitching.css?v=" + allConfig.urlArgs);

	var form = layui.form;

	//地图图层
	var maplayer = {
		//普通图层
		tilelayer: new AMap.TileLayer(),
		//卫星图层
		satellite: new AMap.TileLayer.Satellite(),
		//路网图层
		roadnet: new AMap.TileLayer.RoadNet(),
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

	//加载选择图层模块
	function loadLayerSwitching() {
		MyMap.getProtogenesis().add(maplayer.tilelayer);
		MyMap.getProtogenesis().add(maplayer.mapping);
		//更新渲染
		form.render(null, "formLayerSwitching");
		//监听主题样式
		form.on("select(cbLayerStyle)", function (data) {
			var map = MyMap.getProtogenesis();
			var styleName = "amap://styles/" + "dark";
			map.setMapStyle(styleName);
		});
		//监听图层模式选择
		form.on("select(cbLayerSwitching)", function (data) {
			var map = MyMap.getProtogenesis();
			if (data.value == 0) {
				map.remove([maplayer.roadnet, maplayer.satellite]);
				map.add(maplayer.tilelayer);
			} else {
				map.remove(maplayer.tilelayer);
				map.add([maplayer.roadnet, maplayer.satellite]);
			}
		});
	}

	loadLayerSwitching();
});
