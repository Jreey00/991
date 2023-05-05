define([
	"jquery",
	"layui",
	"URL",
	"carsposition",
	"ajaxglobalconfig",
], function ($, layui, URL, CarsPosition, ajaxglobal) {
	var tableCarGroup = null;
	var tableCarGroupCar = null;
	var nowGroup = null;

	function loadTable() {
		tableCarGroup = layui.table.render({
			elem: "#module_SettingCarGroup_TableCarGroup",
			id: "module_SettingCarGroup_TableCarGroup",
			height: 473,
			skin: "line",
			url: URL.carGroup.getCarGroup,
			method: "post",
			response: {
				statusName: "state",
				statusCode: 1,
				msgName: "msg",
				countName: "total",
				dataName: "rows",
			},
			parseData: function (res) {
				if (res["state"] == 1)
					return {
						state: res.state,
						msg: res.msg,
						total: res.data.total,
						rows: res.data.rows,
					};
				else
					return {
						state: 0,
						msg: "查询接口异常",
						total: 0,
						rows: [],
					};
			},
			cols: [
				[
					{ field: "id", title: "ID", hide: true },
					{ field: "name", title: "分组名称", align: "center" },
					{
						title: "分组颜色",
						align: "center",
						width: "30%",
						templet: function (d) {
							var templetHtml =
								"<div>" +
								'<i style="width:80px;height:28px;border-radius:5%;background-color:' +
								d.color +
								';display: inline-block"></i>' +
								"</div>";
							return templetHtml;
						},
					},
					{
						title: "操作",
						align: "center",
						width: "30%",
						templet: function (d) {
							var templetHtml =
								"<div>" +
								// '<button class="layui-btn layui-btn-primary layui-btn-xs" onclick="editGroup(\'' + d.id + '\')">' +
								// '<i class="layui-icon">&#xe642;</i>编辑' +
								// '</button>' +
								'<button class="layui-btn layui-btn-danger layui-btn-xs" style="border-radius: 15px;" onclick="removeGroup(\'' +
								d.id +
								"')\">" +
								'<i class="layui-icon" >&#xe67e;</i>删除' +
								"</button>" +
								"</div>";
							return templetHtml;
						},
					},
				],
			],
		});

		layui.table.on(
			"row(module_SettingCarGroup_TableCarGroupFilter)",
			function (obj) {
				var row = obj.data;
				nowGroup = row.id;
				$("#module_SettingCarGroup_TxtNowGroup").text(row.name);
				loadGroupCarTableData();
			}
		);

		tableCarGroupCar = layui.table.render({
			elem: "#module_SettingCarGroup_TableCarGroupCar",
			id: "module_SettingCarGroup_TableCarGroupCar",
			height: 473,
			skin: "line",
			data: [],
			cols: [
				[
					{ type: "checkbox" },
					{ field: "id", title: "ID", hide: true },
					{ field: "carno", title: "车辆编码", align: "center" },
				],
			],
		});
	}

	function loadBtnEvent() {
		$("#module_SettingCarGroup_BtnGroupAdd").on("click", function () {
			$("#module_SettingCarGroup_TxtGroupAction").val("add");
			addEditGroup();
		});
		$("#module_SettingCarGroup_BtnGroupCarAdd").on("click", function () {
			if (nowGroup == null || nowGroup.length == 0) {
				layer.msg("请先选择分组", { icon: 0 });
				return;
			}
			openSearchResult();
		});
		$("#module_SettingCarGroup_BtnGroupCarRemove").on("click", function () {
			var rows = layui.table.checkStatus(
				"module_SettingCarGroup_TableCarGroupCar"
			).data;
			if (!rows || rows.length == 0) {
				layer.msg("请至少选择一行再进行删除", { icon: 0 });
				return;
			}
			var ids = [];
			for (var i = 0; i < rows.length; i++) {
				ids.push(rows[i].id);
			}
			layer.confirm(
				"确认要移除这些车辆吗？",
				{ btn: ["确认", "取消"] },
				function (index) {
					layer.close(index);
					$.ajax({
						type: "POST",
						url: URL.carGroup.removeCarGroupCar,
						data: { ids: JSON.stringify(ids) },
						cache: false,
						dataType: "json",
						success: function (result) {
							if (result && result.state == 1) {
								layer.msg(result.msg, { icon: 1 });
								loadGroupCarTableData();
							} else {
								layer.msg(result.msg, { icon: 2 });
							}
						},
					});
				},
				function (index) {
					layer.close(index);
				}
			);
		});
		$("#module_SettingCarGroup_BtnGroupSubmit").on("click", function () {
			var action = $("#module_SettingCarGroup_TxtGroupAction").val();
			var id = $("#module_SettingCarGroup_TxtGroupID").val();
			var name = $("#module_SettingCarGroup_TxtGroupName").val();
			var color = $("#module_SettingCarGroup_TxtGroupColor").val();
			if (name == null || name.trim().length == 0) {
				layer.msg("分组名称不能为空", { icon: 0 });
				return;
			}
			if (color == null || color.trim().length == 0) {
				layer.msg("颜色不能为空", { icon: 0 });
				return;
			}
			$.ajax({
				type: "POST",
				url: URL.carGroup.addEditCarGroup,
				data: { action: action, id: id, name: name, color: color },
				cache: false,
				dataType: "json",
				success: function (result) {
					layer.close(layer.index);
					if (result && result.state == 1) {
						layer.msg(result.msg, { icon: 1 });
						tableCarGroup.reload();
					} else {
						layer.msg(result.msg, { icon: 2 });
					}
				},
			});
		});
	}

	//加载分组内车辆的数据
	function loadGroupCarTableData() {
		$.ajax({
			type: "POST",
			url: URL.carGroup.getCarGroupCar,
			data: { groupid: nowGroup },
			cache: false,
			dataType: "json",
			success: function (result) {
				if (result && result.state == 1) {
					var data = result.data.rows;
					tableCarGroupCar.reload({ data: data });
				} else {
					layer.msg(result.msg, { icon: 2 });
				}
			},
		});
	}

	function loadGroupColor() {
		layui.colorpicker.render({
			elem: "#module_SettingCarGroup_DivGroupColor",
			color: "#2ec770",
			predefine: true,
			done: function (color) {
				$("#module_SettingCarGroup_TxtGroupColor").val(color);
			},
		});
	}

	//修改分组
	editGroup = function (id) {
		$("#module_SettingCarGroup_TxtGroupAction").val("edit");
		$("#module_SettingCarGroup_TxtGroupID").val(id);
		addEditGroup();
	};

	//删除分组
	removeGroup = function (id) {
		if (id == null || typeof id == "undefined" || id.trim().length == 0) {
			layer.msg("请选择一条进行删除", { icon: 0 });
			return;
		}
		layer.confirm(
			"确认要删除该分组吗？",
			{ btn: ["确认", "取消"] },
			function (index) {
				layer.close(index);
				clearGroupCar();
				$.ajax({
					type: "POST",
					url: URL.carGroup.removeCarGroup,
					data: { id: id },
					cache: false,
					dataType: "json",
					success: function (result) {
						if (result && result.state == 1) {
							layer.msg(result.msg, { icon: 1 });
							tableCarGroup.reload();
						} else {
							layer.msg(result.msg, { icon: 2 });
						}
					},
				});
			},
			function (index) {
				layer.close(index);
			}
		);
	};

	//添加分组
	function addEditGroup() {
		layer.open({
			type: 1,
			area: ["420px", "240px"],
			content: $("#module_SettingCarGroup_LayerGroup"),
		});
	}

	//打开搜索结果悬浮框
	function openSearchResult() {
		layer.open({
			type: 1,
			title: "查询试验车辆",
			content:
				"<iframe id='iframeSelectCar' name='iframeSelectCar' scrolling='auto' frameborder='0' src='SearchCar.html?CallPage=CarGroup&BottomBtnShow=true&SingleOrMultiple=multiple' style='width:100%; height:100%; display:block;'></iframe>",
			area: ["700px", "650px"],
			shadeClose: true, //开启遮罩关闭
			closeBtn: 1,
			resize: false,
		});
	}

	//选择车辆完成
	SearchCarPage_Complete = function (tableData) {
		layer.close(layer.index);
		if (tableData && tableData.length > 0) {
			var ids = [];
			for (var i = 0; i < tableData.length; i++) {
				ids.push(tableData[i].id);
			}
			$.ajax({
				type: "POST",
				url: URL.carGroup.addCarGroupCar,
				data: { groupid: nowGroup, ids: JSON.stringify(ids) },
				cache: false,
				dataType: "json",
				success: function (result) {
					if (result && result.state == 1) {
						layer.msg(result.msg, { icon: 1 });
						loadGroupCarTableData();
					} else {
						layer.msg(result.msg, { icon: 2 });
					}
				},
			});
		}
	};

	SearchCarPage_Close = function () {
		layer.close(layer.index);
	};

	function clearGroupCar() {
		nowGroup = null;
		$("#module_SettingCarGroup_TxtNowGroup").text("未选择");
		tableCarGroupCar.reload({ data: [] });
	}

	function settingCarGroup() {
		window.setTimeout(function () {
			$.ajax({
				type: "POST",
				url: URL.carGroup.getUserCarGroupCarInfo,
				cache: false,
				dataType: "json",
				success: function (result) {
					if (result && result.state == 1) {
						var data = result.data;
						CarsPosition.setGroupWithDefault(data);
					} else {
						layer.msg("获取车辆分组失败", { icon: 2 });
					}
				},
			});
		}, 5000);
	}

	function loadCarGroupModule() {
		loadTable();
		loadBtnEvent();
		loadGroupColor();
		settingCarGroup();
	}

	loadCarGroupModule();
});
