define(["jquery", "mymap", "customevent", "websocket", "URL"], function (
	$,
	MyMap,
	CustomEvent,
	wsClient,
	URL
) {
	/*
    信息窗体
    */
	var infoWindow;
	var equipmentsInfo = {};
	/*
    图标路径    
    */
	var con = allConfig.baseDirectory + "Resource/icon/icon_shexiangtou.png";
	var coff =
		allConfig.baseDirectory + "Resource/icon/icon_shexiangtou_lixian.png";
	var caon = allConfig.baseDirectory + "Resource/icon/icon_daoza.png";
	var caoff = allConfig.baseDirectory + "Resource/icon/icon_daoza_lixian.png";
	var jiayouji = allConfig.baseDirectory + "Resource/icon/icon_jiayouji.png";
	var jiayouji_lixian =
		allConfig.baseDirectory + "Resource/icon/icon_jiayouji_lixian.png";
	var chongdianzhuang =
		allConfig.baseDirectory + "Resource/icon/icon_chongdianzhuang.png";
	var chongdianzhuang_lixian =
		allConfig.baseDirectory + "Resource/icon/icon_chongdianzhuang_lixian.png";
	var ledpingmu = allConfig.baseDirectory + "Resource/icon/icon_ledpingmu.png";
	var ledpingmu_lixian =
		allConfig.baseDirectory + "Resource/icon/icon_ledpingmu_lixian.png";
	var bataiji = allConfig.baseDirectory + "Resource/icon/icon_bataiji.png";
	var bataiji_lixian =
		allConfig.baseDirectory + "Resource/icon/icon_bataiji_lixian.png";
	var dizhongheng =
		allConfig.baseDirectory + "Resource/icon/icon_dizhongheng.png";
	var dizhongheng_lixian =
		allConfig.baseDirectory + "Resource/icon/icon_dizhongheng_lixian.png";
	var qixiangzhan =
		allConfig.baseDirectory + "Resource/icon/icon_qixiangzhan.png";
	var qixiangzhan_lixian =
		allConfig.baseDirectory + "Resource/icon/icon_qixiangzhan_lixian.png";
	var longmendiao =
		allConfig.baseDirectory + "Resource/icon/icon_longmendiao.png";
	var longmendiao_lixian =
		allConfig.baseDirectory + "Resource/icon/icon_longmendiao_lixian.png";
	var qita = allConfig.baseDirectory + "Resource/icon/icon_qita.png";
	var qita_lixian =
		allConfig.baseDirectory + "Resource/icon/icon_qita_lixian.png";
	//判断设备图标
	function getEquipmentsstate(val, item) {
		if (val === 1 && item === 1) {
			return con;
		} else if (val === 1 && item === 2) {
			return coff;
		} else if (val === 2 && item === 1) {
			return caon;
		} else if (val === 2 && item === 2) {
			return caoff;
		} else if (val == 3 && item === 1) {
			return jiayouji;
		} else if (val == 3 && item === 2) {
			return jiayouji_lixian;
		} else if (val == 4 && item === 1) {
			return chongdianzhuang;
		} else if (val == 4 && item === 2) {
			return chongdianzhuang_lixian;
		} else if (val == 5 && item === 1) {
			return ledpingmu;
		} else if (val == 5 && item === 2) {
			return ledpingmu_lixian;
		} else if (val == 6 && item === 1) {
			return longmendiao;
		} else if (val == 6 && item === 2) {
			return longmendiao_lixian;
		} else if (val == 7 && item === 1) {
			return bataiji;
		} else if (val == 7 && item === 2) {
			return bataiji_lixian;
		} else if (val == 8 && item === 1) {
			return dizhongheng;
		} else if (val == 8 && item === 2) {
			return dizhongheng_lixian;
		} else if (val == 9 && item === 1) {
			return qixiangzhan;
		} else if (val == 9 && item === 2) {
			return qixiangzhan_lixian;
		} else if (val == 10 && item === 1) {
			return qita;
		} else if (val == 10 && item === 2) {
			return qita_lixian;
		}
	}
	/**
	 * 监控设备列表对象
	 */
	var PositionedEquipment = new CustomEvent();

	//初始化监控数据的小窗口
	function initInfoWindow(key) {
		allConfig["show"] = false;
		var equip = equipmentsInfo[key];
		var infoWindowData = {
			width: "700px",
			title: "设备信息",
			content: "",
			//   icon: "i-icon-carinfo",

			offset: {
				x: 0,
				y: -30,
			},
		};
		if (equip.equipInfo.equipmentType == 1) {
			(infoWindowData.rbar = [
				{
					//   iconCls: "i-icon-white-computer",
					text: "视频监控",
					handler: function () {
						if (layer.index) layer.close(layer.index);
						// var carid = carMarkers[key].carinfo.id;
						// var carno = carMarkers[key].carinfo.carno;
						var tabLayerIndex = layer.tab({
							area: ["80%", "80%"],
							tab: [
								{
									title: "视频监控",
									content: `<iframe id='iframeVideo' name='iframeVideo' frameborder='0' src='videoMonitoring.html?id=${equip.equipInfo.equipmentCode}'  style='width:100%; height:100%; display:block;'></iframe>`,
								},
							],
						});
						// layer.full(tabLayerIndex);
					},
				},
			]),
				(infoWindowData.show = true),
				(infoWindowData.content = [
					{ label: "设备名称：", value: equip.equipInfo.equipmentName || "" },
					{
						label: "设备类型：",
						value: equip.equipInfo.equipmentSpecification || "",
					},
				]);
		} else {
			(infoWindowData.sw = [{}]),
				(infoWindowData.show = true),
				(infoWindowData.content = [
					{ label: "设备名称：", value: equip.equipInfo.equipmentName || "" },
					{
						label: "设备类型：",
						value: equip.equipInfo.equipmentSpecification || "",
					},
				]);
		}
		infoWindow = MyMap.createInfoWindow(infoWindowData);
		infoWindow.on("close", function () {});
	}

	/**
	 * 添加监控车辆,但是未定位,Marker不存在
	 * @param {(String|Array)} cars - 车辆信息或数组
	 */
	PositionedEquipment.adds = function (equipments) {
		if (equipments instanceof Array) {
			var markers = [];
			equipments.forEach((v) => {
				var marker = createMarker(v);
				markers.push(marker);
			});
		}
		MyMap._map.add(markers);
	};
	/**
	 * 设置设备Marker位置
	 */
	PositionedEquipment.setPosition = function (opt) {};

	/**
	 * 设置设备Marker图标
	 */
	//   PositionedEquipment.setIcon = function(icon) {};

	/**
	 * 创建Marker对象
	 */
	function createMarker(opt) {
		var marker = new AMap.Marker({
			icon: getEquipmentsstate(opt.equipmentType, opt.workState),
			position: [opt.longitude, opt.latitude],
		});
		marker.key = opt.equipmentCode;
		equipmentsInfo[marker.key] = {
			equipInfo: opt,
		};
		marker.on("click", function () {
			var that = this;
			var key = that.key;
			var zoom = MyMap.getZoom();
			MyMap.setZoomAndCenter(zoom < 17 ? 17 : zoom, this.getPosition());
			initInfoWindow(key);
			if (infoWindow.key == key && infoWindow.getIsOpen()) {
				infoWindow.close();
				return;
			}
			infoWindow.key = key;
			infoWindow.open(that.getPosition());
		});
		return marker;
	}
	return PositionedEquipment;
});
