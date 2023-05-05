define(function () {
	var webHttpApiBase = allConfig.webHttpApiBase;
	var URL = {
		car: {
			// paginationTable: webHttpApiBase + "/getcarinfopagination",  //获取车辆信息（查询车辆表格分页数据）
			paginationTable:
				"http://roads.fawjiefang.com.cn/mapwebapi/pgms/getcarinfopagination", //获取车辆信息（查询车辆表格分页数据）
			bindTerminalList:
				"http://roads.fawjiefang.com.cn/mapwebapi/pgms/getbindcarinfolist", //获取绑定终端的车辆信息
			getCarInfoModelByCarID: webHttpApiBase + "/getcarinfomodelbycarid", //根据车辆ID获取一个车辆信息
			getCarCanListByMd5: webHttpApiBase + "/getcarcanlistbymd5", //根据md5获取通道
			getCarAllStatus: webHttpApiBase + "/getcarallstatus", //获取状态信息（多少在线车辆，多少离线车辆）
		},
		weather: {
			getWeather:
				"http://pgms.fawjiefang.com.cn/fullscreenmap/stationWeather/getCurrentWeather", //获取天气信息
			getWea:
				"https://restapi.amap.com/v3/weather/weatherInfo?city=220122&key=1db1cd41b2565973e2cd5352acfcfe69&extensions=base", //获取天气信息
		},
		driver: {
			getDriverInfoByCardid: webHttpApiBase + "/getdriverinfobycardid", //根据ic卡号获取司机信息
			getDriverPhotoByCardid: webHttpApiBase + "/getdriverphotobycardid", //根据ic卡号获取司机照片
			getDriverInfo: webHttpApiBase + "/getDriverInfo", //根据ic卡号获取司机信息
		},
		carAlarm: {
			getCarAlarmInfo: webHttpApiBase + "/getCarWarn", //获取车辆报警
		},
		carFault: {
			getCarAlarmFault: webHttpApiBase + "/getcaralarmfault", //获取车辆故障
		},
		testSite: {
			getTestSite: webHttpApiBase + "/gettestsite", //获取试验场信息
		},
		historicalTrack: {
			historicalTrackGetDBC: webHttpApiBase + "/historicaltrackgetdbc", //历史轨迹回放查询获取DBC
			historicalTrackPlayback: webHttpApiBase + "/gethistoricaltrack", //历史轨迹回放查询历史轨迹接口
		},
		user: {
			getDriverInfoByCardID: webHttpApiBase + "/getdriverinfobycardid", //根据卡ID获取驾驶员信息
		},
		amapApi: {
			getCityID:
				"http://restapi.amap.com/v3/geocode/regeo?key=" +
				allConfig.amapWebServiceKey, //根据经纬度获取城市ID
			getWeather:
				"http://restapi.amap.com/v3/weather/weatherInfo?key=" +
				allConfig.amapWebServiceKey, //根据城市ID获取天气
		},
		carGroup: {
			getCarGroup: webHttpApiBase + "/getcargroup", //获取车辆分组
			addEditCarGroup: webHttpApiBase + "/addeditcargroup", //添加或修改车辆分组
			removeCarGroup: webHttpApiBase + "/removecargroup", //删除车辆分组
			getCarGroupCar: webHttpApiBase + "/getcargroupcar", //获取车辆分组内的车辆
			addCarGroupCar: webHttpApiBase + "/addcargroupcar", //添加车辆分组内的车辆
			removeCarGroupCar: webHttpApiBase + "/removecargroupcar", //删除车辆分组内的车辆
			getUserCarGroupCarInfo: webHttpApiBase + "/getusercargroupcarinfo", //获取用户车辆分组信息
		},
	};
	return URL;
});
