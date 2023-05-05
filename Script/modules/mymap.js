define(["imap"], function (iMap) {
	var bodyMap = document.getElementById("map");
	var map = new iMap(bodyMap, {
		ToolBar: {
			position: "RT",
			offset: {
				x: 40,
				y: 130,
			},
		},
		// 125.027456,43.996525
		center: { lng: 125.02103666666669, lat: 43.993828333333339 },
		zoom: 16,
		expandZoomRange: true,
		zooms: [16, 20],
		mapStyle: "amap://styles/blue",
	});
	return map;
});
