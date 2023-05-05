define(["jquery", "layui", "carsposition"], function ($, layui, CarsPosition) {
	layui.link("Style/modules/SelectCarIcon.css?v=" + allConfig.urlArgs);

	var template =
		"<!-- 选择车辆图标窗口 -->" +
		'<div id="module_SelectCarIcon" class="layui-fluid" style="display: none;">' +
		'<div class="layui-row">' +
		'<div class="layui-col-md12"  style="margin-bottom:10px;margin-top:10px;background: #F3F6FA;padding:5px">' +
		'<img src="{{ d.zhuangtai }}"  style="margin-right:10px">' +
		'<span class="title" style="color:#565D67">车辆状态颜色说明</span>' +
		"</div>" +
		"</div>" +
		'<div class="layui-row carststuecolor" style="display:flex;justify-content:space-around;width:100%">' +
		'<div style="text-align:center;width:56px;height:69px">' +
		'<img src="{{ d.kache1 }}">' +
		'<span ></span><p style="color:#0299FF">行驶</p>' +
		"</div>" +
		'<div style="text-align:center;width:70px;height:69px">' +
		'<img src="{{ d.kache4 }}">' +
		'<p ></p><p style="color:#16C8C6">数据传输</p>' +
		"</div>" +
		'<div style="text-align:center;width:70px;height:69px">' +
		'<img src="{{ d.kache5 }}">' +
		'<p ></p><p style="color:#FF8929">怠数</p>' +
		"</div>" +
		'<div style="text-align:center;width:71px;height:69px">' +
		'<img src="{{ d.kache6 }}">' +
		'<p ></p><p style="color:#056BD4">ON档停车</p>' +
		"</div>" +
		'<div style="text-align:center;width:70px;height:69px">' +
		'<img src="{{ d.kache2 }}">' +
		'<p ></p><p style="color:#F65E5E">停止</p>' +
		"</div>" +
		'<div style="text-align:center;width:70px;height:69px">' +
		'<img src="{{ d.kache7 }}">' +
		'<p ></p><p style="color:#EAC530">设备掉电</p>' +
		"</div>" +
		'<div style="text-align:center;width:70px;height:69px">' +
		'<img src="{{ d.kache8 }}">' +
		'<p ></p><p style="color:#7F55E0">断电</p>' +
		"</div>" +
		'<div style="text-align:center;width:70px;height:69px">' +
		'<img src="{{ d.kache9 }}">' +
		'<p ></p><p style="color:#3F63D9">休眠</p>' +
		"</div>" +
		'<div style="text-align:center;width:70px;height:69px">' +
		'<img src="{{ d.kache3 }}">' +
		'<p ></p><p style="color:#959FB2">离线</p>' +
		"</div>" +
		"</div>" +
		'<div class="layui-row block2">' +
		'<div class="layui-col-md12"  style="margin-bottom:10px;margin-top:10px;background: #F3F6FA;padding:5px">' +
		'<img src="{{ d.tubiao }}" style="margin-right:10px">' +
		'<span class="title" style="color:#565D67">车辆图标</span>' +
		"</div>" +
		"</div>" +
		'<div class="layui-row layui-form cariconbox" style="display:flex;justify-content:space-around;width:100%">' +
		'<div style="display:flex">' +
		'<input type="radio" name="caricon" value="kache1" lay-filter="caricon" checked>' +
		'<div  style="text-align:center">' +
		'<img src="{{ d.kache1 }}">' +
		'<p style="text-align:center;padding-right:3px;color:#0299FF">牵引车</p>' +
		"</div>" +
		"</div>" +
		'<div style="display:flex">' +
		'<input type="radio" name="caricon" value="car1" lay-filter="caricon">' +
		'<div  style="text-align:center">' +
		'<img src="{{ d.car001 }}">' +
		'<p style="text-align:center;padding-right:3px;color:#0299FF">轿车</p>' +
		"</div>" +
		"</div>" +
		'<div  style="display:flex">' +
		'<input type="radio" name="caricon" value="car2" lay-filter="caricon">' +
		'<div  style="text-align:center">' +
		'<img src="{{ d.car0001 }}">' +
		'<p style="text-align:center;padding-right:3px;color:#0299FF">客车</p>' +
		"</div>" +
		"</div>" +
		'<div style="display:flex">' +
		'<input type="radio" name="caricon" value="car3" lay-filter="caricon">' +
		'<div  style="text-align:center">' +
		'<img src="{{ d.car1 }}">' +
		'<p style="text-align:center;padding-right:3px;color:#0299FF">载货车</p>' +
		"</div>" +
		"</div>" +
		'<div style="display:flex">' +
		'<input type="radio" name="caricon" value="sanjiao" lay-filter="caricon">' +
		'<div style="text-align:center">' +
		'<img src="{{ d.car01 }}" style="height:50px">' +
		'<p style="text-align:center;padding-right:3px;color:#0299FF">待定</p>' +
		"</div>" +
		"</div>" +
		"</div>" +
		"</div>";

	var form = layui.form;
	function loadSelectCarIcon() {
		var templateHtml = layui.laytpl(template).render({
			car01:
				allConfig.baseDirectory + "Resource/carIcons/icon_yunxing_xingshi.png",
			car001:
				allConfig.baseDirectory + "Resource/carIcons/icon_jiaoche_xingshi.png",
			car1:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_xiehuoche_xingshi.png",
			car0001:
				allConfig.baseDirectory + "Resource/carIcons/icon_keche_xingshi.png",
			kache1:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_qianyinche_xingshi.png",
			kache2:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_qianyinche_tingzhi.png",
			kache3:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_qianyinche_lixian.png",
			kache4:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_qianyinche_shujuchuanshu.png",
			kache5:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_qianyinche_daishu.png",
			kache6:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_qianyinche_ondang.png",
			kache7:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_qianyinche_shebeidiaodian.png",
			kache8:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_qianyinche_duandian.png",
			kache9:
				allConfig.baseDirectory +
				"Resource/carIcons/icon_qianyinche_xiumian.png",
			tubiao:
				allConfig.baseDirectory + "Resource/images/carIcon/cheliangtubiao.png",
			zhuangtai:
				allConfig.baseDirectory +
				"Resource/images/carIcon/cheliangzhuangtai.png",
		});
		$("body").append(templateHtml);
		form.render("radio");
		form.on("radio(caricon)", function (data) {
			sessionStorage.removeItem("key");
			sessionStorage.setItem("key", data.value);
			CarsPosition.setIcon(data.value);
		});
	}

	loadSelectCarIcon();
});
