//高级搜索悬浮框模块
define(["jquery", "layui"], function ($, layui) {
	var laytpl = layui.laytpl;
	var templateFrom =
		'<div id="i_AdvancedSearch">' +
		'<div id="i_AdvancedSearch_form" class="layui-form">' +
		"</div>" +
		"</div>";
	var templateRow =
		'<div id="{{ d.RowID }}" class="layui-form-item" style="padding-left:10px;padding-top:5px;">' +
		"{{d.RowContent}}" +
		"</div>";
	var templateInput =
		'<div class="layui-inline" style="width: 200px; margin: 2px;">' +
		'<input id="{{ d.InputID }}" type="text" name="{{ d.InputID }}" placeholder="{{ d.InputHoverTxt }}" class="layui-input">' +
		"</div>";
	var templateInput1 =
		'<input id="{{ d.InputID }}" type="text" name="{{ d.InputID }}" placeholder="{{ d.InputHoverTxt }}" class="layui-input">';
	var templateSelect =
		'<div class="layui-inline" style="width: 140px; margin: 2px;">' +
		'<select id="{{ d.SelectID }}" name="{{ d.SelectID }}" lay-filter="{{ d.SelectID }}">' +
		"{{ d.SelectOption }}" +
		"</select>" +
		"</div>";
	var templateSelect1 =
		'<select id="{{ d.SelectID }}" name="{{ d.SelectID }}" lay-filter="{{ d.SelectID }}">' +
		"{{ d.SelectOption }}" +
		"</select>";
	var templateDeleteRow =
		'<div class="layui-inline" style="margin: 2px;">' +
		'<button id="{{ d.DeleteBtnID }}" class="layui-btn layui-btn-danger">' +
		'<i class="layui-icon">&#x1006;</i>' +
		"</button>" +
		"</div>";
	var templateAddRow =
		'<div id="i_Advanced_Row_btnAdd" class="layui-form-item" style="margin-top: 10px;">' +
		'<div style="text-align: center">' +
		'<button id="i_Advanced_btnAdd" class="layui-btn">' +
		'<i class="layui-icon">&#xe654;</i>添加条件' +
		"</button>" +
		"</div>" +
		"</div>";

	var instance = null;

	/**
	 *
	 * @param {String} opt.id 渲染的父ID
	 * @param {Array} opt.fileds 字段
	 * @param {Array} opt.layerIndex layer弹出层的index
	 */
	var iAdvancedSearch = function (opt) {
		this._init(opt);
	};
	iAdvancedSearch.prototype = {
		rowCount: 0, //行个数
		_maxRowIndex: 0, //目前为止最大的行索引(删除行不会减)
		_opt: null, //用户传的数据
		_layerAdvancedSearch: null, //要渲染的父对象
		//_height: 300,             //当前高度
		//_modifyHeight: 20,         //增加或减少的高度
		_init: function (opt) {
			instance = this;
			this._opt = opt;
			_layerAdvancedSearch = $("#" + opt.id);
			_layerAdvancedSearch.append(templateFrom);
			$("#i_AdvancedSearch_form").append(templateAddRow);
			$("#i_Advanced_btnAdd").on(
				"click",
				{ iAdvancedSearch: this },
				function (event) {
					event.data.iAdvancedSearch.addRow();
				}
			);
			this.addRow();
		},
		//添加行
		addRow: function () {
			this.rowCount++;
			this._maxRowIndex++;
			//生成添加的Html
			var opting = "";
			for (var i = 0; i <= this._opt.fileds.length; i++) {
				if (i == 0) opting += "<option value=''>请选择</option>";
				else
					opting +=
						"<option value='" +
						this._opt.fileds[i - 1].filed +
						"'>" +
						this._opt.fileds[i - 1].title +
						"</option>";
			}
			var select = laytpl(templateSelect).render({
				SelectID: "i_Advanced_filed_" + this._maxRowIndex,
				SelectOption: opting,
			});
			var input = laytpl(templateInput).render({
				InputID: "i_Advanced_value_" + this._maxRowIndex,
				InputHoverTxt: "请先选择查询项",
			});
			var deleteRow = "";
			if (this.rowCount > 1) {
				deleteRow = laytpl(templateDeleteRow).render({
					DeleteBtnID: "i_Advanced_btnDelete_" + this._maxRowIndex,
				});
			}
			$("#i_Advanced_Row_btnAdd").before(
				laytpl(templateRow).render({
					RowID: "i_Advanced_row_" + this._maxRowIndex,
					RowContent: select + input + deleteRow,
				})
			);
			//重新渲染组件
			layui.form.render("select");
			//条件下拉框值改变事件
			layui.form.on(
				"select(i_Advanced_filed_" + this._maxRowIndex + ")",
				function (data) {
					var newVal = data.value;
					var config = instance._opt;
					var fileds = config.fileds;
					var index = data.elem.id.substring(
						data.elem.id.lastIndexOf("_") + 1,
						data.elem.id.length
					);
					var thisFiled;
					for (var i = 0; i < fileds.length; i++) {
						if (fileds[i].filed == newVal) {
							thisFiled = fileds[i];
							break;
						}
					}
					if (
						!thisFiled.editor ||
						(thisFiled.editor && thisFiled.editor == "input")
					) {
						if (
							document.getElementById("i_Advanced_value_" + index).nodeName ==
							"SELECT"
						)
							$("#i_Advanced_value_" + index)
								.nextAll()[0]
								.remove();
						$("#i_Advanced_value_" + index).replaceWith(
							laytpl(templateInput1).render({
								InputID: "i_Advanced_value_" + index,
								InputHoverTxt: "请输入" + thisFiled.title,
							})
						);
					} else if (thisFiled.editor == "select") {
						var opting = "";
						for (var i = 0; i < thisFiled.editorFileds.length; i++) {
							opting +=
								"<option value='" +
								thisFiled.editorFileds[i].filed +
								"'>" +
								thisFiled.editorFileds[i].title +
								"</option>";
						}
						var select = laytpl(templateSelect1).render({
							SelectID: "i_Advanced_value_" + index,
							SelectOption: opting,
						});
						$("#i_Advanced_value_" + index).replaceWith(select);
						layui.form.render("select");
					}
				}
			);
			//每行删除按钮的单击事件
			$("#i_Advanced_btnDelete_" + this._maxRowIndex).on(
				"click",
				{ iAdvancedSearch: this, index: this._maxRowIndex },
				function (event) {
					event.data.iAdvancedSearch.deleteRow(event.data.index);
				}
			);

			//添加高度
			// this._height += this._modifyHeight;
			// layer.style(this._opt.layerIndex, { height: this._height });

			//达到数量后禁用添加条件按钮
			var addBtn = $("#i_Advanced_btnAdd");
			if (
				this.rowCount == this._opt.fileds.length &&
				!addBtn.prop("disabled")
			) {
				addBtn.prop("disabled", "disabled");
				addBtn.addClass("layui-btn-disabled");
			}
		},
		deleteRow: function (rowIndex) {
			this.rowCount--;
			$("#i_Advanced_row_" + rowIndex).remove();

			//减少高度
			// this._height -= this._modifyHeight;
			// layer.style(this._opt.layerIndex, { height: this._height });

			//如果按钮禁用了就启用添加条件按钮
			var addBtn = $("#i_Advanced_btnAdd");
			if (addBtn.prop("disabled")) {
				addBtn.prop("disabled", "");
				addBtn.removeClass("layui-btn-disabled");
			}
		},
		getWhereJson: function () {
			var jsonStr = "{";
			for (var i = 1; i <= this._maxRowIndex; i++) {
				var aaa = document.getElementById("i_Advanced_row_" + i);
				if (aaa) {
					var filed = $("#i_Advanced_filed_" + i).val();
					if (filed && filed != "") {
						var value = $("#i_Advanced_value_" + i).val();
						if (value && value != "")
							jsonStr += '"' + filed + '":"' + value + '",';
					}
				}
			}
			jsonStr = jsonStr.substr(0, jsonStr.length - 1);
			jsonStr += "}";
			try {
				return JSON.parse(jsonStr);
			} catch (e) {
				return {};
			}
		},
	};
	iAdvancedSearch.getInstance = function () {
		return instance;
	};
	return iAdvancedSearch;
});
