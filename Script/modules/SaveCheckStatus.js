define(["jquery", "layui"], function ($, layui) {
	var table = layui.table;

	//记录选中表格记录编号
	var checkedMultiList = [];

	var tableCheckBoxMultiColumnUtil = {
		/*初始化分页设置*/
		init: function (settings) {
			var param = {
				//表格id
				gridId: "",
				//表格lay-filter值
				filterId: "",
				//表格主键字段名
				fieldName: "",
			};
			$.extend(param, settings);

			//设置当前保存数据参数
			if (checkedMultiList[param.gridId] == null) {
				checkedMultiList[param.gridId] = [];
			}

			//监听选中行
			table.on("checkbox(" + param.filterId + ")", function (obj) {
				var type = obj.type;
				var checked = obj.checked;

				//当前选中数据
				var checkRowData = [];
				//当前取消选中的数据
				var cacelCheckedRowData = [];

				//选中
				if (checked) {
					checkRowData = table.checkStatus(param.gridId).data;
				}
				//取消选中
				else {
					if (type == "all") {
						//当前页数据
						var currentPageData = table.cache[param.gridId];
						//debugger;
						cacelCheckedRowData = currentPageData;
					} else {
						cacelCheckedRowData.push(obj.data);
					}
				}
				//清除数据
				$.each(cacelCheckedRowData, function (index, item) {
					var itemValue = item[param.fieldName];

					checkedMultiList[param.gridId] = checkedMultiList[
						param.gridId
					].filter(function (fItem, fIndex) {
						return fItem[param.fieldName] != itemValue;
					});
				});

				//添加选中数据
				$.each(checkRowData, function (index, item) {
					//debugger;
					var itemValue = item[param.fieldName];
					var objFilter = checkedMultiList[param.gridId].filter(function (
						fItem,
						fIndex
					) {
						return fItem[param.fieldName] == itemValue;
					});
					if (objFilter == null || objFilter.length == 0) {
						var rowObj = item;
						checkedMultiList[param.gridId].push(rowObj);
					}
				});
			});
		},
		//设置页面默认选中（在表格加载完成之后调用）
		checkedDefault: function (settings) {
			var param = {
				//表格id
				gridId: "",
				//表格主键字段名
				fieldName: "",
			};

			$.extend(param, settings);

			//当前页数据
			var currentPageData = table.cache[param.gridId];
			if (
				checkedMultiList[param.gridId] != null &&
				checkedMultiList[param.gridId].length > 0
			) {
				$.each(currentPageData, function (index, item) {
					var itemValue = item[param.fieldName];

					var objFilter = checkedMultiList[param.gridId].filter(function (
						filterItem,
						filterIndex
					) {
						return filterItem[param.fieldName] == itemValue;
					});
					if (objFilter != null && objFilter.length > 0) {
						//设置选中状态
						item.LAY_CHECKED = true;

						var rowIndex = item["LAY_TABLE_INDEX"];
						updateRowCheckStatus(
							param.gridId,
							"tr[data-index=" + rowIndex + '] input[type="checkbox"]'
						);
					}
				});
			}
			//判断当前页是否全选
			var currentPageCheckedAll = table.checkStatus(param.gridId).isAll;
			if (currentPageCheckedAll) {
				updateRowCheckStatus(param.gridId, 'thead tr input[type="checkbox"]');
			}
		},
		//获取当前获取的所有集合值
		getValue: function (settings) {
			var param = {
				//表格id
				gridId: "",
			};
			$.extend(param, settings);

			return checkedMultiList[param.gridId];
		},
		//设置选中的id（一般在编辑时候调用初始化选中值）
		setIds: function (settings) {
			var param = {
				gridId: "",
				//数据集合
				ids: [],
			};
			$.extend(param, settings);

			checkedMultiList[param.gridId] = [];
			$.each(param.ids, function (index, item) {
				checkedMultiList[param.gridId].push(parseInt(item));
			});
		},
	};

	function updateRowCheckStatus(gridId, ele) {
		var layTableView = $(".layui-table-view");
		//一个页面多个表格，这里防止更新表格错误
		$.each(layTableView, function (index, item) {
			if ($(item).attr("lay-id") == gridId) {
				$(item).find(ele).prop("checked", true);
				$(item).find(ele).next().addClass("layui-form-checked");
			}
		});
	}

	return tableCheckBoxMultiColumnUtil;
});
