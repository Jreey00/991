(function () {
	//获取URL里的参数
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}

	require([
		"jquery",
		"layui",
		"savecheckstatus",
		"iadvancedsearch",
		"URL",
		"ajaxglobalconfig",
	], function ($, layui, SaveCheckStatus, iAdvancedSearch, URL, ajaxglobal) {
		//引入css
		layui.link("Style/SearchCar.css?v=" + allConfig.urlArgs);

		/*
		 *请求参数
		 */
		var QueryString = {
			/*
			 *什么界面调用的该界面
			 *主要用于添加一些特殊元素
			 */
			CallPage: getQueryString("CallPage"),
			/*
			 *是否显示确定关闭按钮
			 *true：显示
			 *false：不显示
			 *默认不显示
			 */
			BottomBtnShow: getQueryString("BottomBtnShow"),
			/*
			 *列表是单选还是多选
			 *single：单选
			 *multiple：多选
			 *none：不选
			 *默认不选
			 */
			SingleOrMultiple: getQueryString("SingleOrMultiple"),
			/*
			 *是否保存跨页选择的状态
			 *只有在列表是多选状态下才有效
			 *true：保存
			 *false：不保存
			 *默认不保存
			 */
			SaveCheckStatus: getQueryString("SaveCheckStatus"),
		};

		//车辆结果表格
		var layuiTable;

		$(function () {
			if (QueryString.BottomBtnShow != "true") {
				$(".bottomBtn").hide();
			}

			if (
				QueryString.SingleOrMultiple == "multiple" &&
				QueryString.SaveCheckStatus == "true"
			) {
				SaveCheckStatus.init({
					gridId: "i_Layer_SearchResult_Table",
					filterId: "i_Layer_SearchResult_Table_Filter",
					fieldName: "id",
				});
			}

			loadSearchCarTable();
			btnEvent();
		});

		function loadSearchCarTable() {
			var cols = [
				{
					field: "id",
					title: "ID",
					hide: true,
				},
				{
					field: "carno",
					title: "车辆编码",
					align: "center",
				},
				{
					field: "isonline",
					title: "车辆状态",
					align: "center",
					templet: function (d) {
						if (d.isonline == "1") {
							return "<div style='color:#0299FF;display:inline-block;width:20px;height:14px;margin-right:5px;text-align:center;'>行驶</div>";
						} else if (d.isonline == "2") {
							return "<div style='color:#FF8929;display:inline-block;width:20px;height:14px;margin-right:5px;text-align:center;'>怠数</div>";
						} else if (d.isonline == "3") {
							return "<div style='color:#F65E5E;display:inline-block;width:20px;height:14px;margin-right:5px;text-align:center;'>停止</div>";
						} else if (d.isonline == "4") {
							return "<div style='color:#056BD4;display:inline-block;width:20px;height:14px;margin-right:5px;text-align:center;'>ON档停车</div>";
						} else if (d.isonline == "5") {
							return "<div style='color:#16C8C6;display:inline-block;width:20px;height:14px;margin-right:5px;text-align:center;'>数据传输</div>";
						} else if (d.isonline == "6") {
							return "<div style='color:#3F63D9;display:inline-block;width:20px;height:14px;margin-right:5px;text-align:center;'>休眠</div>";
						} else if (d.isonline == "7") {
							return "<div style='color:#EAC530;display:inline-block;width:20px;height:14px;margin-right:5px;text-align:center;'>设备掉电</div>";
						} else if (d.isonline == "8") {
							return "<div style='color:#063C91;display:inline-block;width:20px;height:14px;margin-right:5px;text-align:center;'>失联</div>";
						} else if (d.isonline == "0") {
							return "<div style='color:#063C91;display:inline-block;width:20px;height:14px;margin-right:5px;text-align:center;'>失联</div>";
						} else if (d.isonline == "9") {
							return "<div style='color:green;display:inline-block;width:20px;height:14px;margin-right:5px;text-align:center;'>在线</div>";
						}
					},
				},
				// { field: 'vin', title: '车辆识别码', align: "center" },
				{
					field: "terminalcode",
					title: "终端编号",
					align: "center",
				},
			];

			//如果是index.html调用的该页面
			if (QueryString.CallPage == "index") {
				cols.push({
					title: "操作",
					align: "center",
					templet: function (d) {
						if (d.terminalcode) {
							var templetHtml =
								"<div>" +
								'<img src="Resource/icon/dingwei.png"  style="color: #009688;margin: 0px 10px;" id="CarPosition{{ d.id }}" onmouseover="show(\'{{d.id}}\')"   onclick="btnCarPositionClick(\'{{d.terminalcode}}\')"/>' +
								"<img src=\"Resource/icon/shishishuju.png\"  style=\"color: #009688;margin: 0px 10px;\" id=\"CarMonitor{{ d.id }}\"  onmouseover=\"showCar('{{d.id}}')\"   onclick=\"btnCarMonitorClick('{{d.id}}','{{d.carno}}','hasTC','{{d.terminalcode}}')\"/>" +
								'<img src="Resource/icon/fenpingjiankong.png"  style="color: #009688;margin: 0px 10px;" id="SplitSreen{{ d.id }}"   onmouseover="showSplit(\'{{d.id}}\')"  onclick="btnSplitSreenClick()"/>' +
								"<img src=\"Resource/icon/lishiguiji.png\"  style=\"color: #009688;margin: 0px 10px;\" id=\"history{{ d.id }}\"  onmouseover=\"showMon('{{d.id}}')\"  onclick=\"btnCarMonitorClick('{{d.id}}','{{d.carno}}','has','{{d.terminalcode}}')\"/>" +
								// '<a href="#" style="color: #009688;margin: 0px 10px;" onclick="btnCarPositionClick(\'{{d.terminalcode}}\')">定位车辆</a>' +
								//'<a href="#" style="color: #009688;margin: 0px 10px;" onclick="btnCarMonitorClick(\'{{d.id}}\',\'{{d.carno}}\',\'hasTC\')">车辆监测</a>' +
								"</div>";
							var templetHtmlRe = layui.laytpl(templetHtml).render({
								terminalcode: d.terminalcode,
								id: d.id,
								carno: d.carno,
							});
							return templetHtmlRe;
						} else {
							var templetHtml =
								"<div>" +
								"<img src=\"Resource/icon/shishishuju.png\"  style=\"color: #009688;margin: 0px 10px;\" id=\"CarMonitor{{ d.id }}\" onmouseover=\"showCar('{{d.id}}')\"  onclick=\"btnCarMonitorClick('{{d.id}}','{{d.carno}}','hasTC',,'{{d.terminalcode}}')\"/>" +
								// '<a href="#" style="color: #009688;margin: 0px 10px;" onclick="btnCarMonitorClick(\'{{d.id}}\',\'{{d.carno}}\',\'noTc\')">车辆监测</a>' +
								"</div>";
							var templetHtmlRe = layui.laytpl(templetHtml).render({
								id: d.id,
								carno: d.carno,
							});
							return templetHtmlRe;
						}
					},
				});
			}

			if (QueryString.SingleOrMultiple == "single") {
				cols.splice(0, 0, {
					type: "radio",
				});
			} else if (QueryString.SingleOrMultiple == "multiple") {
				cols.splice(0, 0, {
					type: "checkbox",
				});
			}

			//加载搜索车辆结果表格
			layuiTable = layui.table.render({
				elem: "#i_Layer_SearchResult_Table",
				id: "i_Layer_SearchResult_Table",
				skin: "line", //行边框风格
				url: URL.car.paginationTable, //数据接口
				method: "post",
				height: window.innerHeight - 110,
				contentType: "application/json",
				where: {
					msgHeaders: {
						count: 2,
					},
					msgBody: {
						rows: 10000,
						page: 1,
					},
				},
				page: false, //开启分页
				limit: 10,
				limits: [5, 10, 20],
				//用于对分页请求的参数：page、limit重新设定名称
				// request: {
				//     pageName: 'page', //页码的参数名称，默认：page
				//     limitName: 'rows' //每页数据量的参数名，默认：limit
				// },
				//重新规定返回的数据格式
				response: {
					statusName: "state", //规定数据状态的字段名称，默认：code
					statusCode: 1, //规定成功的状态码，默认：0
					msgName: "msg", //规定状态信息的字段名称，默认：msg
					countName: "total", //规定数据总数的字段名称，默认：count
					dataName: "rows", //规定数据列表的字段名称，默认：data
				},
				//将返回的任意数据格式解析成 table 组件规定的数据格式
				parseData: function (res) {
					//res：原始返回的数据
					if (res.msgBody["state"] == 1)
						return {
							state: res.msgBody.state, //解析接口状态
							msg: res.msgBody.msg, //解析提示文本
							total: res.msgBody.data.total, //解析数据长度
							rows: res.msgBody.data.rows, //解析数据列表
						};
					else
						return {
							state: 0, //解析接口状态
							msg: "查询接口异常", //解析提示文本
							total: 0, //解析数据长度
							rows: [], //解析数据列表
						};
				},
				cols: [cols],
				done: function () {
					if (
						QueryString.SingleOrMultiple == "multiple" &&
						QueryString.SaveCheckStatus == "true"
					) {
						//初始化表格行选中状态
						SaveCheckStatus.checkedDefault({
							gridId: "i_Layer_SearchResult_Table",
							fieldName: "id",
						});
					}
				},
			});

			if (QueryString.SingleOrMultiple == "single") {
				//监听行单击事件（双击事件为：rowDouble）
				//注：test是table原始容器的属性 lay-filter="对应的值"
				layui.table.on(
					"row(i_Layer_SearchResult_Table_Filter)",
					function (obj) {
						//选中行样式
						obj.tr
							.addClass("layui-table-click")
							.siblings()
							.removeClass("layui-table-click");
						//选中radio样式
						obj.tr.find('i[class="layui-anim layui-icon"]').trigger("click");
					}
				);
			} else if (QueryString.SingleOrMultiple == "multiple") {
				//单击行勾选checkbox事件
				$(document).on(
					"click",
					".layui-table-body table.layui-table tbody tr",
					function () {
						var index = $(this).attr("data-index");
						var tableBox = $(this).parents(".layui-table-box");
						//存在固定列
						if (
							tableBox.find(".layui-table-fixed.layui-table-fixed-l").length > 0
						) {
							tableDiv = tableBox.find(
								".layui-table-fixed.layui-table-fixed-l"
							);
						} else {
							tableDiv = tableBox.find(".layui-table-body.layui-table-main");
						}
						var checkCell = tableDiv
							.find("tr[data-index=" + index + "]")
							.find("td div.laytable-cell-checkbox div.layui-form-checkbox I");
						if (checkCell.length > 0) {
							checkCell.click();
						}
					}
				);
				$(document).on(
					"click",
					"td div.laytable-cell-checkbox div.layui-form-checkbox",
					function (e) {
						e.stopPropagation();
					}
				);
			}
		}

		show = function (id) {
			layer.tips("定位车辆", "#CarPosition" + id, {
				tips: [1, "#003B90"], //设置tips方向和颜色 类型：Number/Array，默认：2 tips层的私有参数。支持上右下左四个方向，通过1-4进行方向设定。如tips: 3则表示在元素的下面出现。有时你还可能会定义一些颜色，可以设定tips: [1, '#c00']
				tipsMore: false, //是否允许多个tips 类型：Boolean，默认：false 允许多个意味着不会销毁之前的tips层。通过tipsMore: true开启
				time: 1000,
			});
		};

		showCar = function (id) {
			layer.tips("单车监控", "#CarMonitor" + id, {
				tips: [1, "#003B90"], //设置tips方向和颜色 类型：Number/Array，默认：2 tips层的私有参数。支持上右下左四个方向，通过1-4进行方向设定。如tips: 3则表示在元素的下面出现。有时你还可能会定义一些颜色，可以设定tips: [1, '#c00']
				tipsMore: false, //是否允许多个tips 类型：Boolean，默认：false 允许多个意味着不会销毁之前的tips层。通过tipsMore: true开启
				time: 1000,
			});
		};
		showSplit = function (id) {
			layer.tips("分屏监控", "#SplitSreen" + id, {
				tips: [1, "#003B90"], //设置tips方向和颜色 类型：Number/Array，默认：2 tips层的私有参数。支持上右下左四个方向，通过1-4进行方向设定。如tips: 3则表示在元素的下面出现。有时你还可能会定义一些颜色，可以设定tips: [1, '#c00']
				tipsMore: false, //是否允许多个tips 类型：Boolean，默认：false 允许多个意味着不会销毁之前的tips层。通过tipsMore: true开启
				time: 1000,
			});
		};
		showMon = function (id) {
			layer.tips("历史轨迹", "#history" + id, {
				tips: [1, "#003B90"], //设置tips方向和颜色 类型：Number/Array，默认：2 tips层的私有参数。支持上右下左四个方向，通过1-4进行方向设定。如tips: 3则表示在元素的下面出现。有时你还可能会定义一些颜色，可以设定tips: [1, '#c00']
				tipsMore: false, //是否允许多个tips 类型：Boolean，默认：false 允许多个意味着不会销毁之前的tips层。通过tipsMore: true开启
				time: 1000,
			});
		};

		//按钮事件
		function btnEvent() {
			//查询按钮
			$("#btnSearch").on("click", function () {
				layuiTable.reload({
					where: {
						isonline: $("#cbCarStatus").val(),
						carno: $("#txtCarNumbersID").val(),
					},
					page: {
						curr: 1,
					},
				});
			});

			

			//高级查询按钮
			$("#btnAdvancedSearch").on("click", function () {
				var laterIndex = layer.open({
					type: 1,
					title: "查询条件",
					id: "i_Layer_AdvancedSearch_Div",
					content: $("#i_Layer_AdvancedSearch"),
					area: ["440px", "550px"],
					btnAlign: "c",
					closeBtn: 0,
					shade: 0.5,
					anim: 5,
					resize: false,
					btn: ["确定", "取消"],
					yes: function () {
						var advancedSearch = iAdvancedSearch.getInstance();
						var searchJson = advancedSearch.getWhereJson();
						if (searchJson) {
							searchJson["isbinding"] = 1;
							layuiTable.reload({
								where: searchJson,
								page: {
									curr: 1, //重新从第 1 页开始
								},
							});
						} else {
							layuiTable.reload({
								page: {
									curr: 1,
								},
							});
						}
						$("#i_Layer_AdvancedSearch").empty();
						layer.close(layer.index);
					},
					btn2: function () {
						$("#i_Layer_AdvancedSearch").empty();
						return true;
					},
					cancel: function () {
						$("#i_Layer_AdvancedSearch").empty();
						return true;
					},
				});
				var advancedSearch = new iAdvancedSearch({
					id: "i_Layer_AdvancedSearch",
					fileds: [
						{
							filed: "carno",
							title: "车辆编码",
						},
						//{ filed: "vin", title: "车辆识别码" },
						{
							filed: "carGroup",
							title: "分组车辆",
						},
						{
							filed: "terminalcode",
							title: "终端编号",
						},
						{
							filed: "projectno",
							title: "项目号",
						},
						{
							filed: "borrowperson",
							title: "借用人",
						},
						{
							filed: "borrowdep",
							title: "借用部门",
						},
						{
							filed: "usetype",
							title: "使用类型",
						},
						{
							filed: "isonline",
							title: "车辆状态",
							editor: "select",
							editorFileds: [
								{
									filed: "",
									title: "全部",
								},
								{
									filed: "1",
									title: "在线",
								},
								{
									filed: "0",
									title: "离线",
								},
							],
						},
					],
					layerIndex: laterIndex,
				});
			});

			//定位车辆
			btnCarPositionClick = function (terminalcode) {
				var parentWindow = parent.window || window.parent;
				parentWindow.SearchCarPage_CarPosition(terminalcode);
			};

			//车辆监控和历史轨迹
			btnCarMonitorClick = function (id, carno, hasTC, terminalcode) {
				var parentWindow = parent.window || window.parent;
				parentWindow.SearchCarPage_CarMonitor(id, carno, hasTC, terminalcode);
			};

			//分屏监控
			btnSplitSreenClick = function (id, carno, hasTC) {
				window.open("MultiScreenMap.html");
			};

			//确定
			$("#btnOK").on("click", function () {
				var parentWindow = parent.window || window.parent;
				var tableData = GetTableSelectData();
				parentWindow.SearchCarPage_Complete(tableData);
			});

			//关闭
			$("#btnClose").on("click", function () {
				var parentWindow = parent.window || window.parent;
				parentWindow.SearchCarPage_Close();
			});
		}

		//获取表格选择的数据
		GetTableSelectData = function () {
			var tableData = null;
			if (QueryString.SingleOrMultiple == "single") {
				tableData = layui.table.checkStatus("i_Layer_SearchResult_Table")
					.data[0];
			} else if (QueryString.SingleOrMultiple == "multiple") {
				if (QueryString.SaveCheckStatus == "true") {
					tableData = SaveCheckStatus.getValue({
						gridId: "i_Layer_SearchResult_Table",
					});
				} else {
					tableData = layui.table.checkStatus(
						"i_Layer_SearchResult_Table"
					).data;
				}
			}
			return tableData;
		};
	});
})();
