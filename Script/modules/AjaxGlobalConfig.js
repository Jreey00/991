require(["jquery"], function ($) {
	var gobalAjaxConfig = {
		complete: function (XMLHttpRequest) {
			if (
				XMLHttpRequest.status == "302" ||
				XMLHttpRequest.status == "401" ||
				XMLHttpRequest.status == "404"
			) {
				top.location.href = allConfig.webBase;
			}
			try {
				var result = JSON.parse(XMLHttpRequest.responseText);
				if (result["status"] == 401) top.location.href = allConfig.webBase;
			} catch (ex) {
				console.log(ex);
				console.log(XMLHttpRequest.responseText);
			}
		},
	};
	//配置跨域
	if (allConfig.CrossDomain) {
		//解决跨域带cookie
		gobalAjaxConfig["xhrFields"] = { withCredentials: true }; //支持附带cookie等详细信息
		gobalAjaxConfig["crossDomain"] = true; //跨域
	}
	$.ajaxSetup(gobalAjaxConfig);
});
