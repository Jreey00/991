(function () {
	//关闭loading
	// window.setTimeout(function () {
	// $('.body').show();
	//     $('#loadingDiv').remove();
	// }, 3 * 1000);

	require([
		"jquery",
		"mymap",
		"layui",
		"URL",
		"websocket",
		"carsposition",
		"equipmentposition",
		"ajaxglobalconfig",
	], function (
		$,
		mymap,
		layui,
		URL,
		wsClient,
		CarsPosition,
		equipmentposition,
		ajaxglobal
	) {
		//引入css
		layui.link("Style/index.css?v=" + allConfig.urlArgs);
		layui.link("Resource/icon/iconfont/iconfont.css?v=" + allConfig.urlArgs);

		var siteTable1 = null;
		var siteTable2 = null;
		var siteTable3 = null;
		var siteTable4 = null;
		var isFullscreen = false;
		var data = null;
		var equipmentList = [];
		var arr = [1, 2, 5];
		function loadRoadSituationList() {
			$.ajax({
				type: "POST",
				contentType: "application/json",
				url: "http://pgms.fawjiefang.com.cn/fullscreenmap/led/getRoadSituation",
				dataType: "json",
				cache: false,
				data: JSON.stringify({}),
				success: function (result) {
					if (result.code == 0) {
						data = result.data;
						loadSiteTable(data);
					} else {
						layer.msg("获取场地容量信息出错，请刷新页面重试！", { icon: 2 });
					}
				},
				error: function (e) {
					console.error(e);
					layer.msg("获取场地容量信息出错，请刷新页面重试！", { icon: 2 });
				},
			});
		}
		//  var data = [
		//   [
		//     {
		//       "roadName": "强化坏路",
		//       "roadCapacity": 17,
		//       "testAccountCapacity": 11,
		//       "state": 2,
		//       "count": 8,
		//       "violations": null,
		//       "attention": null,
		//       "velNum": null,
		//       "roadId": null,
		//       "groundId": null,
		//       "roadIdList": [
		//         "c5a3affa-a189-497f-989c-6abd79da9cbd",
		//         "26344192-d522-4339-a338-d6762481ef9c",
		//         "d9db7a3f-9408-470d-9e9c-e99d5c5314a8"
		//       ],
		//       "isShow": null
		//     },
		//     {
		//       "roadName": "2号路",
		//       "roadCapacity": 2,
		//       "testAccountCapacity": 0,
		//       "state": 1,
		//       "count": 2,
		//       "violations": null,
		//       "attention": null,
		//       "velNum": 0,
		//       "roadId": "c5a3affa-a189-497f-989c-6abd79da9cbd",
		//       "groundId": "74521c58-b104-4ded-833f-36ed022edbe5",
		//       "roadIdList": [
		//         "c5a3affa-a189-497f-989c-6abd79da9cbd"
		//       ],
		//       "isShow": 1
		//     },
		//     {
		//       "roadName": "3号路",
		//       "roadCapacity": 2,
		//       "testAccountCapacity": 0,
		//       "state": 1,
		//       "count": 6,
		//       "violations": null,
		//       "attention": null,
		//       "velNum": 0,
		//       "roadId": "26344192-d522-4339-a338-d6762481ef9c",
		//       "groundId": "74521c58-b104-4ded-833f-36ed022edbe5",
		//       "roadIdList": [
		//         "26344192-d522-4339-a338-d6762481ef9c"
		//       ],
		//       "isShow": 1
		//     },
		//     {
		//       "roadName": "1号路",
		//       "roadCapacity": 13,
		//       "testAccountCapacity": 11,
		//       "state": 2,
		//       "count": 0,
		//       "violations": null,
		//       "attention": null,
		//       "velNum": 11,
		//       "roadId": "d9db7a3f-9408-470d-9e9c-e99d5c5314a8",
		//       "groundId": "74521c58-b104-4ded-833f-36ed022edbe5",
		//       "roadIdList": [
		//         "d9db7a3f-9408-470d-9e9c-e99d5c5314a8"
		//       ],
		//       "isShow": 1
		//     }
		//   ],
		//   [
		//     {
		//       "roadName": "高速环路",
		//       "roadCapacity": 25,
		//       "testAccountCapacity": 20,
		//       "state": 2,
		//       "count": 3,
		//       "violations": null,
		//       "attention": null,
		//       "velNum": null,
		//       "roadId": null,
		//       "groundId": null,
		//       "roadIdList": [
		//         "2afd1dda-24d4-44ba-b133-48b67561a066",
		//         "426d3b94-4d9b-4178-8c65-8917930d4497",
		//         "e0cffd11-7a35-4cea-9fb9-3444f0263e9c"
		//       ],
		//       "isShow": null
		//     },
		//     {
		//       "roadName": "三道",
		//       "roadCapacity": 7,
		//       "testAccountCapacity": 0,
		//       "state": 1,
		//       "count": 0,
		//       "violations": null,
		//       "attention": null,
		//       "velNum": 0,
		//       "roadId": "2afd1dda-24d4-44ba-b133-48b67561a066",
		//       "groundId": "8d68c1c3-f1ec-4769-966b-ec275e6fc1a8",
		//       "roadIdList": [
		//         "2afd1dda-24d4-44ba-b133-48b67561a066"
		//       ],
		//       "isShow": 1
		//     },
		//     {
		//       "roadName": "二道",
		//       "roadCapacity": 8,
		//       "testAccountCapacity": 0,
		//       "state": 1,
		//       "count": 3,
		//       "violations": null,
		//       "attention": null,
		//       "velNum": 0,
		//       "roadId": "426d3b94-4d9b-4178-8c65-8917930d4497",
		//       "groundId": "8d68c1c3-f1ec-4769-966b-ec275e6fc1a8",
		//       "roadIdList": [
		//         "426d3b94-4d9b-4178-8c65-8917930d4497"
		//       ],
		//       "isShow": 1
		//     },
		//     {
		//       "roadName": "一道",
		//       "roadCapacity": 10,
		//       "testAccountCapacity": 20,
		//       "state": 3,
		//       "count": 0,
		//       "violations": null,
		//       "attention": null,
		//       "velNum": 20,
		//       "roadId": "e0cffd11-7a35-4cea-9fb9-3444f0263e9c",
		//       "groundId": "8d68c1c3-f1ec-4769-966b-ec275e6fc1a8",
		//       "roadIdList": [
		//         "e0cffd11-7a35-4cea-9fb9-3444f0263e9c"
		//       ],
		//       "isShow": 1
		//     }
		//   ],
		//   [
		//     {
		//       "roadName": "综合性能路",
		//       "roadCapacity": 7,
		//       "testAccountCapacity": 0,
		//       "state": 1,
		//       "count": 0,
		//       "violations": null,
		//       "attention": null,
		//       "velNum": null,
		//       "roadId": null,
		//       "groundId": null,
		//       "roadIdList": [
		//         "3a4433b6-4e85-4cce-aafe-e25d6f731ddd",
		//         "e6e124ea-7bc6-4c08-8b60-f3b7814c65dc",
		//         "f204c91a-fe9e-4019-bb69-69165abec391"
		//       ],
		//       "isShow": null
		//     },
		//     {
		//       "roadName": "B段",
		//       "roadCapacity": 1,
		//       "testAccountCapacity": 0,
		//       "state": 1,
		//       "count": 0,
		//       "violations": null,
		//       "attention": null,
		//       "velNum": 0,
		//       "roadId": "3a4433b6-4e85-4cce-aafe-e25d6f731ddd",
		//       "groundId": "c8299fda-c037-4eae-be08-d9390dddec89",
		//       "roadIdList": [
		//         "3a4433b6-4e85-4cce-aafe-e25d6f731ddd"
		//       ],
		//       "isShow": 1
		//     },
		//     {
		//       "roadName": "C段",
		//       "roadCapacity": 5,
		//       "testAccountCapacity": 0,
		//       "state": 1,
		//       "count": 0,
		//       "violations": null,
		//       "attention": null,
		//       "velNum": 0,
		//       "roadId": "e6e124ea-7bc6-4c08-8b60-f3b7814c65dc",
		//       "groundId": "c8299fda-c037-4eae-be08-d9390dddec89",
		//       "roadIdList": [
		//         "e6e124ea-7bc6-4c08-8b60-f3b7814c65dc"
		//       ],
		//       "isShow": 1
		//     },
		//     {
		//       "roadName": "A段",
		//       "roadCapacity": 1,
		//       "testAccountCapacity": 0,
		//       "state": 1,
		//       "count": 0,
		//       "violations": null,
		//       "attention": null,
		//       "velNum": 0,
		//       "roadId": "f204c91a-fe9e-4019-bb69-69165abec391",
		//       "groundId": "c8299fda-c037-4eae-be08-d9390dddec89",
		//       "roadIdList": [
		//         "f204c91a-fe9e-4019-bb69-69165abec391"
		//       ],
		//       "isShow": 1
		//     }
		//   ],
		//   [
		//     {
		//       "roadName": "噪声试验路",
		//       "roadCapacity": 1,
		//       "testAccountCapacity": 0,
		//       "state": 1,
		//       "count": 0,
		//       "violations": null,
		//       "attention": null,
		//       "velNum": 0,
		//       "roadId": "15838866-e55e-4ce3-989f-a1f05cf586dd",
		//       "groundId": "2e4d1da1-f243-4db5-9859-ef28836ea628",
		//       "roadIdList": [
		//         "15838866-e55e-4ce3-989f-a1f05cf586dd"
		//       ],
		//       "isShow": 2
		//     },
		//     {
		//       "roadName": "深涉水池",
		//       "roadCapacity": 1,
		//       "testAccountCapacity": 0,
		//       "state": 1,
		//       "count": 0,
		//       "violations": null,
		//       "attention": null,
		//       "velNum": 0,
		//       "roadId": "390ba904-02d4-409d-8766-9d9ddb827b8d",
		//       "groundId": "385197c8-9636-4f7f-8ab2-a4e4edc9017c",
		//       "roadIdList": [
		//         "390ba904-02d4-409d-8766-9d9ddb827b8d"
		//       ],
		//       "isShow": 2
		//     },
		//     {
		//       "roadName": "坡道",
		//       "roadCapacity": 1,
		//       "testAccountCapacity": 34,
		//       "state": 3,
		//       "count": 0,
		//       "violations": null,
		//       "attention": null,
		//       "velNum": 34,
		//       "roadId": "26279f19-32dd-4f54-be5b-ec198c7dbdc8",
		//       "groundId": "385197c8-9636-4f7f-8ab2-a4e4edc9017c",
		//       "roadIdList": [
		//         "26279f19-32dd-4f54-be5b-ec198c7dbdc8"
		//       ],
		//       "isShow": 2
		//     },
		//     {
		//       "roadName": "其他",
		//       "roadCapacity": 11,
		//       "testAccountCapacity": 70,
		//       "state": 3,
		//       "count": 0,
		//       "violations": null,
		//       "attention": null,
		//       "velNum": null,
		//       "roadId": null,
		//       "groundId": null,
		//       "roadIdList": [
		//         "d9138217-473f-4bc5-ba21-8507d8ffd0c2",
		//         "749a94a0-0664-4aab-96dd-450910b5e012",
		//         "b62a0413-8f30-471c-8334-1b4131630b83",
		//         "7d1a60b3-1512-4d9a-9bff-baa2bdbace67",
		//         "bd90b69d-41f5-4eea-8816-862fcec490f9",
		//         "1f394933-a3ca-4228-940f-7ba93939ea57",
		//         "3964d2cb-caa7-4839-b07f-6f0d51ea27a2",
		//         "f9ae4025-bb29-4f56-b4ed-a42379a977d7",
		//         "1c0cdfbb-444a-4d26-b0ac-3d01f414ed5b",
		//         "b321e228-c09b-43f4-86b2-8cf8d311344a"
		//       ],
		//       "isShow": null
		//     }
		//   ]
		// ]
		// loadSiteTable(data)
		function loadSiteTable(data) {
			// $("#tableCentent1").css(
			//   {
			//     left: '0'
			//   }
			// );
			// $("#tableTitle1").css(
			//   {
			//     left: '0'
			//   }
			// );
			// $(".tableStyle").css({
			//   marginLeft: window.innerWidth / 50,
			// });
			// $("#tableTitle1").css({
			//   marginRight: window.innerWidth / 50,
			// });
			siteTable1 = layui.table.render({
				elem: "#siteTable1",
				id: "siteTable1",
				// height: 500,
				width: (window.innerWidth - 75) / 4,
				skin: "nob",
				data: data[0],
				cols: [
					[
						{
							field: "roadName",
							width: "29%",
							title: "试验道路",
							align: "center",
							templet: setOperate,
						},
						{
							field: "roadCapacity",
							width: "19%",
							title: "容量",
							align: "center",
							templet: setCarno,
						},
						{
							field: "state",
							width: "29%",
							title: "容量状态",
							align: "center",
							templet: setState,
						},
						{
							field: "count",
							width: "23%",
							title: "计划量",
							align: "center",
							templet: setCount,
						},
					],
				],
				done: function (res, curr, count) {
					var re = res.data;
					if (re.length > 0) {
						$.each(re, function (i, d) {
							if (i % 2 === 0) {
								$(
									$(".siteTable1 .layui-table-body.layui-table-main tr")[i]
								).css(
									"background-image",
									"url('Resource/icon/img_liebiao_tankuang_01.png')"
								);
							}
						});
					}
					//超出tips提示
					$(".layui-table td>div").on({
						mouseover: function () {
							if (this.offsetWidth < this.scrollWidth) {
								var that = this;
								var text = $(this).text();
								window.layer.tips(text, that, {
									tips: 1,
									time: 0,
								});
							}
						},
						mouseout: function () {
							layer.closeAll("tips");
						},
					});
				},
			});

			siteTable2 = layui.table.render({
				elem: "#siteTable2",
				id: "siteTable2",
				// height: 500,
				width: (window.innerWidth - 75) / 4,
				skin: "nob",
				data: data[1],
				cols: [
					[
						{
							field: "roadName",
							width: "29%",
							title: "试验道路",
							align: "center",
							templet: setOperate,
						},
						{
							field: "roadCapacity",
							width: "19%",
							title: "容量",
							align: "center",
							templet: setCarno,
						},
						{
							field: "state",
							width: "29%",
							title: "容量状态",
							align: "center",
							templet: setState,
						},
						{
							field: "count",
							width: "23%",
							title: "计划量",
							align: "center",
							templet: setCount,
						},
					],
				],
				done: function (res, curr, count) {
					console.log(res, "res2");
					var re = res.data;
					if (re.length > 0) {
						$.each(re, function (i, d) {
							if (i % 2 === 0) {
								$(
									$(".siteTable2 .layui-table-body.layui-table-main tr")[i]
								).css(
									"background-image",
									"url('Resource/icon/img_liebiao_tankuang_01.png')"
								);
							}
						});
					}
					//超出tips提示
					$(".layui-table td>div").on({
						mouseover: function () {
							if (this.offsetWidth < this.scrollWidth) {
								var that = this;
								var text = $(this).text();
								window.layer.tips(text, that, {
									tips: 1,
									time: 0,
								});
							}
						},
						mouseout: function () {
							layer.closeAll("tips");
						},
					});
				},
			});

			siteTable3 = layui.table.render({
				elem: "#siteTable3",
				id: "siteTable3",
				// height: 500,
				skin: "nob",
				width: (window.innerWidth - 75) / 4,
				data: data[2],
				cols: [
					[
						{
							field: "roadName",
							width: "29%",
							title: "试验道路",
							align: "center",
							templet: setOperate,
						},
						{
							field: "roadCapacity",
							width: "19%",
							title: "容量",
							align: "center",
							templet: setCarno,
						},
						{
							field: "state",
							width: "29%",
							title: "容量状态",
							align: "center",
							templet: setState,
						},
						{
							field: "count",
							width: "23%",
							title: "计划量",
							align: "center",
							templet: setCount,
						},
					],
				],
				done: function (res, curr, count) {
					var re = res.data;
					if (re.length > 0) {
						$.each(re, function (i, d) {
							if (i % 2 === 0) {
								$(
									$(".siteTable3 .layui-table-body.layui-table-main tr")[i]
								).css(
									"background-image",
									"url('Resource/icon/img_liebiao_tankuang_01.png')"
								);
							}
						});
					}
					//超出tips提示
					$(".layui-table td>div").on({
						mouseover: function () {
							if (this.offsetWidth < this.scrollWidth) {
								var that = this;
								var text = $(this).text();
								window.layer.tips(text, that, {
									tips: 1,
									time: 0,
								});
							}
						},
						mouseout: function () {
							layer.closeAll("tips");
						},
					});
				},
			});
			siteTable4 = layui.table.render({
				elem: "#siteTable4",
				id: "siteTable4",
				// height: 500,
				width: (window.innerWidth - 75) / 4,
				skin: "nob",
				data: data[3],
				cols: [
					[
						{
							field: "roadName",
							width: "29%",
							title: "试验道路",
							align: "center",
							templet: setOperate,
						},
						{
							field: "roadCapacity",
							width: "19%",
							title: "容量",
							align: "center",
							templet: setCarno,
						},
						{
							field: "state",
							width: "29%",
							title: "容量状态",
							align: "center",
							templet: setState,
						},
						{
							field: "count",
							width: "23%",
							title: "计划量",
							align: "center",
							templet: setCount,
						},
					],
				],
				done: function (res, curr, count) {
					var re = res.data;
					if (re.length > 0) {
						$.each(re, function (i, d) {
							if (i % 2 === 0) {
								$(
									$(".siteTable4 .layui-table-body.layui-table-main tr")[i]
								).css(
									"background-image",
									"url('Resource/icon/img_liebiao_tankuang_01.png')"
								);
							}
						});
					}
					//超出tips提示
					$(".layui-table td>div").on({
						mouseover: function () {
							if (this.offsetWidth < this.scrollWidth) {
								var that = this;
								var text = $(this).text();
								window.layer.tips(text, that, {
									tips: 1,
									time: 0,
								});
							}
						},
						mouseout: function () {
							layer.closeAll("tips");
						},
					});
				},
			});
		}

		function setCarno(data) {
			var ht =
				`<div>` +
				`<span title='` +
				data.testAccountCapacity +
				"/" +
				data.roadCapacity +
				`'style='display:block;'>` +
				`<span>` +
				data.testAccountCapacity +
				"</span>" +
				"/" +
				`<span>` +
				data.roadCapacity +
				"</span>" +
				`</span>` +
				`</div>`;
			return ht;
		}

		function setCount(data) {
			var html = `<a href='http://pgms.fawjiefang.com.cn/#/groundManagement/testOperation?roadName=${
				data.roadName
			}&roadIdList=${data.roadIdList.toString()}&type=1&time=${new Date()}' target="PGMS" style='color:#27FCEA;' >${
				data.count
			}</a>`;
			return html;
		}

		function setOperate(data) {
			// var html =
			//   `<a style="color:#1E9FFF"  href="http://pgms.fawjiefang.com.cn?id=${data.id}"  >` +
			//   data.id+
			//   "</a>";
			var html =
				`<a href='http://pgms.fawjiefang.com.cn/#/groundManagement/testOperation?roadName=${
					data.roadName
				}&roadIdList=${data.roadIdList.toString()}&type=0&time=${new Date()}' target="PGMS" style='color:#27FCEA;' >` +
				`<span title='` +
				data.roadName +
				`'style='display:block;'>` +
				`<span>` +
				data.roadName +
				"</span>" +
				`</span>` +
				`</a>`;
			return html;
		}
		function setState(data) {
			let state = data.state;
			var html = `<img style="width:15px;height:15px;" src="${
				state == 1
					? "Resource/icon/icon_zhuangtai_lan.png"
					: state == 2
					? "Resource/icon/icon_zhuangtai_huang.png"
					: "Resource/icon/icon_zhuangtai_hong.png"
			}"/>`;
			return html;
		}
		//    全屏
		function openFullscreen(element) {
			isFullscreen = true;
			if (element.requestFullscreen) {
				element.requestFullscreen();
			} else if (element.mozRequestFullScreen) {
				element.mozRequestFullScreen();
			} else if (element.msRequestFullscreen) {
				element.msRequestFullscreen();
			} else if (element.webkitRequestFullscreen) {
				element.webkitRequestFullScreen();
			}
		}
		// 退出全屏
		function exitFullScreen() {
			isFullscreen = false;
			if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.msExitFullscreen) {
				document.msExiFullscreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			} else if (document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			}
		}

		$(window).resize(function () {
			$("#dialog1").css("width", window.innerWidth - 30);
			layui.use("table", function () {
				loadSiteTable(data);
			});
		});

		//按钮事件
		function btnEvent() {
			$("#count").on("click", function () {
				var data = $("#roadName").children("span").children("span").text();
				window.open(
					`http://pgms.fawjiefang.com.cn/#/groundManagement/testOperation?roadName=${data}&type=0`,
					"PGMS"
				);
			});

			$("#quanping").on("click", function () {
				if (isFullscreen) {
					exitFullScreen();
				} else {
					openFullscreen(document.getElementById("maps"));
				}
			});
			$("#tianqiLink").on("click", function () {
				window.open(
					`http://pgms.fawjiefang.com.cn/#/generalManagement/weatherInfoSearch`,
					"PGMS"
				);
			});
			//    关闭弹窗按钮
			$("#closeDialog").on("click", function () {
				if ($("#tableTitle1").css("left") === "0px") {
					// $("#tableCentent1").css(
					//   {
					//     left: window.innerWidth * -1,
					//     transition: "left 1s",
					//   },
					//   "slow"
					// );
					// $("#tableTitle1").css(
					//   {
					//     left: window.innerWidth * -1,
					//     transition: "left 1s",
					//   },
					//   "slow"
					// );
					$("#dialog1").css({
						left: window.innerWidth * -1,
						transition: "left 1s",
					});
					setTimeout(() => {
						$("#tableOpen1").css({
							display: "inline-block",
						});
					}, 1000);
					setTimeout(() => {
						$("#content1").css({
							display: "none",
						});
					}, 1000);
				}
			});

			$("#closeDialog1").on("click", function () {
				if ($("#shiyan1").css("left") === "0px") {
					$("#shiyan1").css(
						{
							left: "-5555px",
							transition: "left 1s",
						},
						"slow"
					);
				}
				$("#tableOpen2").css({
					display: "inline-block",
				});
			});

			$("#closeDialog2").on("click", function () {
				if ($("#shiyan2").css("left") === "0px") {
					$("#shiyan2").css(
						{
							left: "5555px",
							transition: "left 1s",
						},
						"slow"
					);
				}
				$("#tableOpen3").css({
					display: "block",
					left: window.innerWidth - 20 + "px",
				});
			});

			$("#closeDialog3").on("click", function () {
				if ($("#shiyan3").css("left") === "0px") {
					$("#shiyan3").css(
						{
							left: "5555px",
							transition: "left 1s",
						},
						"slow"
					);
				}
				$("#tableOpen4").css({
					display: "block",
					left: window.innerWidth - 20 + "px",
				});
			});

			$("#tableOpen1").on("click", function () {
				$("#content1").css({
					display: "unset",
				});
				setTimeout(() => {
					$("#dialog1").css(
						{
							left: "0",
							transition: "left 1s",
						},
						"slow"
					);
					// $("#tableTitle1").css(
					//   {
					//     left: "0",
					//     transition: "left 1s",
					//   },
					//   "slow"
					// );
					// $("#tableCentent1").css(
					//   {
					//     left: "0",
					//     transition: "left 1s",
					//   },
					//   "slow"
					// );
					$("#tableOpen1").css({
						display: "none",
					});
				}, 300);
			});
			$("#tableOpen2").on("click", function () {
				$("#shiyan1").css(
					{
						left: "0",
						transition: "left 1s",
					},
					"slow"
				);
				$("#tableOpen2").css({
					display: "none",
				});
			});
			$("#tableOpen3").on("click", function () {
				$("#shiyan2").css(
					{
						left: "0",
						transition: "left 1s",
					},
					"slow"
				);
				$("#tableOpen3").css({
					display: "none",
				});
			});
			$("#tableOpen4").on("click", function () {
				$("#shiyan3").css(
					{
						left: "0",
						transition: "left 1s",
					},
					"slow"
				);
				$("#tableOpen4").css({
					display: "none",
				});
			});
			$("#turning").on("click", function () {
				let mywin = window.open(
					"http://pgms.fawjiefang.com.cn/#/generalManagement/violationManagement?selectCard=1&againstType=2",
					"PGMS"
				);
				mywin.postMessage("", "*");
			});
			$("#departure").on("click", function () {
				let mywin = window.open(
					"http://pgms.fawjiefang.com.cn/#/generalManagement/violationManagement?selectCard=1&againstType=1",
					"PGMS"
				);
				mywin.postMessage("", "*");
			});
			$("#fatigue").on("click", function () {
				let mywin = window.open(
					"http://pgms.fawjiefang.com.cn/#/generalManagement/violationManagement?selectCard=1&againstType=4",
					"PGMS"
				);
				mywin.postMessage("", "*");
			});
			$("#distanceClose").on("click", function () {
				let mywin = window.open(
					"http://pgms.fawjiefang.com.cn/#/generalManagement/violationManagement?selectCard=1&againstType=3",
					"PGMS"
				);
				mywin.postMessage("", "*");
			});
			$("#highSpeed").on("click", function () {
				let mywin = window.open(
					"http://pgms.fawjiefang.com.cn/#/generalManagement/violationManagement?selectCard=1&againstType=5",
					"PGMS"
				);
				mywin.postMessage("", "*");
			});
			$("#lowSpedd").on("click", function () {
				let mywin = window.open(
					"http://pgms.fawjiefang.com.cn/#/generalManagement/violationManagement?selectCard=1&againstType=6",
					"PGMS"
				);
				mywin.postMessage("", "*");
			});
			$("#failureCheckIn").on("click", function () {
				let mywin = window.open(
					"http://pgms.fawjiefang.com.cn/#/generalManagement/breakContractManagement?violationAtion=1",
					"PGMS"
				);
				mywin.postMessage("", "*");
			});
			$("#timeOutAdmission").on("click", function () {
				let mywin = window.open(
					"http://pgms.fawjiefang.com.cn/#/generalManagement/breakContractManagement?violationAtion=2",
					"PGMS"
				);
				mywin.postMessage("", "*");
			});
			$("#timeOutNotAppear").on("click", function () {
				let mywin = window.open(
					"http://pgms.fawjiefang.com.cn/#/generalManagement/breakContractManagement?violationAtion=3",
					"PGMS"
				);
				mywin.postMessage("", "*");
			});
			$("#cancellationOrder").on("click", function () {
				let mywin = window.open(
					"http://pgms.fawjiefang.com.cn/#/generalManagement/breakContractManagement?violationAtion=6",
					"PGMS"
				);
				mywin.postMessage("", "*");
			});
			$("#daozha1").on("click", function () {
				let mywin = window.open(
					`http://pgms.fawjiefang.com.cn/#/system/siteManagementSettings?activeName=4&equipmentType=${equipmentList[0].equipmentType}&workState=1`,
					"PGMS"
				);
				mywin.postMessage("", "*");
			});
			$("#daozha2").on("click", function () {
				let mywin = window.open(
					`http://pgms.fawjiefang.com.cn/#/system/siteManagementSettings?activeName=4&equipmentType=${equipmentList[0].equipmentType}&workState=2`,
					"PGMS"
				);
				mywin.postMessage("", "*");
			});
			$("#shexiangtou1").on("click", function () {
				let mywin = window.open(
					`http://pgms.fawjiefang.com.cn/#/system/siteManagementSettings?activeName=4&equipmentType=${equipmentList[1].equipmentType}&workState=1`,
					"PGMS"
				);
				mywin.postMessage("", "*");
			});
			$("#shexiangtou2").on("click", function () {
				let mywin = window.open(
					`http://pgms.fawjiefang.com.cn/#/system/siteManagementSettings?activeName=4&equipmentType=${equipmentList[1].equipmentType}&workState=2`,
					"PGMS"
				);
				mywin.postMessage("", "*");
			});
			$("#led1").on("click", function () {
				let mywin = window.open(
					`http://pgms.fawjiefang.com.cn/#/system/siteManagementSettings?activeName=4&equipmentType=${equipmentList[2].equipmentType}&workState=1`,
					"PGMS"
				);
				mywin.postMessage("", "*");
			});
			$("#led2").on("click", function () {
				let mywin = window.open(
					`http://pgms.fawjiefang.com.cn/#/system/siteManagementSettings?activeName=4&equipmentType=${equipmentList[2].equipmentType}&workState=2`,
					"PGMS"
				);
				mywin.postMessage("", "*");
			});
			$("#other1").on("click", function () {
				let mywin = window.open(
					`http://pgms.fawjiefang.com.cn/#/system/siteManagementSettings?activeName=4&equipmentType=10&workState=1`,
					"PGMS"
				);
				mywin.postMessage("", "*");
			});
			$("#other2").on("click", function () {
				let mywin = window.open(
					`http://pgms.fawjiefang.com.cn/#/system/siteManagementSettings?activeName=4&equipmentType=10&workState=2`,
					"PGMS"
				);
				mywin.postMessage("", "*");
			});

			//关注车辆按钮事件
			$("#btnSettionCarGroup").on("click", function () {
				layer.open({
					type: 1,
					title: "关注车辆",
					id: "module_SettingCarGroup_Div",
					content: $("#module_SettingCarGroup"),
					area: ["900px", "600px"],
					closeBtn: 1,
					shade: 0.3,
					shadeClose: true,
					anim: 5,
					resize: false,
				});
			});

			//车辆图标按钮事件
			$("#btnSelectCarIcon").on("click", function () {
				layer.open({
					type: 1,
					title: "车辆图标",
					id: "module_SelectCarIcon_Div",
					content: $("#module_SelectCarIcon"),
					area: ["600px", "300px"],
					closeBtn: 1,
					shade: 0.3,
					shadeClose: true,
					anim: 5,
					resize: false,
				});
			});

			//分屏监控按钮事件
			$("#btnMultiScreenMap").on("click", function () {
				window.open("MultiScreenMap.html");
			});

			//关闭车辆报警小弹框事件
			// $("#closes").on("click", function () {
			//     $("#cards").css({"display":"none"})
			// console.log('关闭')
			// });

			//全屏地图查看车辆报警按钮
			// $("#lookBtn").on("click", function () {
			//     layer.open({
			//         type: 1,
			//         title: "车辆报警",
			//         id: "module_ViewCarAlarm_Div",
			//         content: $('#module_ViewCarAlarm'),
			//         area: ["900px", "600px"],
			//         closeBtn: 1,
			//         resize: false
			//     });
			// console.log('车辆报警1111')
			// });

			//车辆报警按钮事件
			$("#btnViewCarAlarm").on("click", function () {
				layer.open({
					type: 1,
					title: "车辆报警",
					id: "module_ViewCarAlarm_Div",
					content: $("#module_ViewCarAlarm"),
					area: ["900px", "600px"],
					closeBtn: 1,
					resize: false,
				});
			});

			//查询按钮事件
			$("#btnShowSearchResult").on("click", function () {
				layer.close(layer.index);
				$("#btnShowSearchResult").parent().hide();
				openSearchResult();
			});
		}

		//30秒自动关闭弹窗
		// function setTime(){
		//     if(true){
		//         setTimeout(()=>{
		//             $("#cards").css({"display":"none"})
		//         },30000)
		//     }
		// }

		//搜索车辆（SearchCar.html）子页面回调的方法
		function SearchCarPageFunction() {
			//定位车辆
			SearchCarPage_CarPosition = function (terminalcode) {
				layer.close(layer.index);
				$("#btnShowSearchResult").parent().show();
				CarsPosition.find(terminalcode);
			};

			//车辆监控
			SearchCarPage_CarMonitor = function (id, carno, hasTC, terminalcode) {
				layer.close(layer.index);
				var tab = [];
				if (hasTC == "hasTC") {
					tab.push({
						title:
							'<i class="iconfont" style="padding:0 10px 0 0;font-size:30px;vertical-align: middle;">&#xe665;</i>车辆监测',
						content:
							"<iframe id='iframeSelectCar' name='iframeSelectCar' scrolling='auto' frameborder='0' src='RealtimeData.html?id=" +
							encodeURIComponent(id) +
							"&carno=" +
							encodeURIComponent(carno) +
							"&terminalcode=" +
							encodeURIComponent(terminalcode) +
							"' style='width:100%; height:100%; display:block;'></iframe>",
					});
				} else {
					tab.push({
						title:
							'<i class="iconfont" style="padding:0 10px 0 0;font-size:30px;vertical-align: middle;">&#xe61e;</i>历史轨迹',
						content:
							"<iframe id='iframeSelectCar' name='iframeSelectCar' scrolling='auto' frameborder='0' src='HistoricalTrack.html?id=" +
							encodeURIComponent(id) +
							"&carno=" +
							encodeURIComponent(carno) +
							"' style='width:100%; height:100%; display:block;'></iframe>",
					});
				}

				var tabLayerIndex = layer.tab({
					tab: tab,
					cancel: function () {
						$("#btnShowSearchResult").parent().show();
						return true;
					},
				});
				layer.full(tabLayerIndex);
			};
		}

		//打开搜索结果悬浮框
		function openSearchResult() {
			layer.open({
				type: 1,
				title: "查询试验车辆",
				content:
					"<iframe id='iframeSelectCar' name='iframeSelectCar' scrolling='auto' frameborder='0' src='SearchCar.html?CallPage=index&BottomBtnShow=false&SingleOrMultiple=none' style='width:100%; height:100%; display:block;'></iframe>",
				area: ["700px", "600px"],
				closeBtn: 1,
				shadeClose: false, //开启遮罩关闭
				resize: false,
				cancel: function () {
					$("#btnShowSearchResult").parent().show();
					return true;
				},
			});
		}

		//加载一些模块
		function loadModules() {
			// require(["gpslayerswitching", "carstatuestatistics", "caralarm","selectcaricon"]);
			require([
				"gpslayerswitching",
				"carstatuestatistics",
				"selectcaricon",
				"cargroup",
				"caralarm",
			]);
		}

		//添加车辆定位
		function addCarPosition() {
			$.ajax({
				type: "POST",
				url: URL.car.bindTerminalList,
				cache: false,
				contentType: "application/json",
				dataType: "json",
				success: function (result) {
					if (result.msgBody.state == 1) {
						var allData = result.msgBody.data;
						//     var arr=["999999","YS1442","YS1443","YS1515","YS1535","YS1510","YS1514","YS1509","YS1387","YQ0518"]
						//     allData=allData.filter(filterOpt)
						//        function filterOpt(item){
						//         for(let i=0;i<arr.length;i++){
						//             if(item.carno===arr[i]){
						//                 return true
						//             }
						//         }
						//        }
						// let onlinenum=[];
						// let outlinenum=[];
						// allData.forEach((item)=>{
						//     if(item.isonline){
						//         onlinenum.push(item)
						//     }else{
						//         outlinenum.push(item)
						//     }
						// })
						// $("#i_Layer_CarStatisticsValueOnline").html(onlinenum.length);
						// $("#i_Layer_CarStatisticsValueOutline").html(outlinenum.length);
						CarsPosition.adds(allData);
						wsClient.send("3#");
						wsClient.send("0#");
					} else {
						layer.msg("添加车辆定位出错，请刷新页面重试！", { icon: 2 });
					}
				},
				error: function (e) {
					console.error(e);
					layer.msg("添加车辆定位出错，请刷新页面重试！", { icon: 2 });
				},
			});
		}

		//添加设备定位
		function addEquipmentPosition() {
			//设备定位假数据(本地调试)
			// var data = [
			//   {
			//     "id": "0395c0ee-a955-4614-b28d-38ff782d14ae",
			//     "equipmentName": "综服楼院区",
			//     "equipmentCode": "250f48e05589447cbff0be5b00e36ce7",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.03618,
			//     "latitude": 44.00098,
			//     "workState": 1
			//   },
			//   {
			//     "id": "05536346-bb94-4bd5-a697-e740a66f4a3b",
			//     "equipmentName": "Camera 02",
			//     "equipmentCode": "07a35a7d279346c594891ab30afd94c5",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "064e66d1-f840-49da-b686-3eefc9b36356",
			//     "equipmentName": "场院门出口",
			//     "equipmentCode": "4487a786cdfc437d878ed160d3b2898f",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.03394,
			//     "latitude": 43.99849,
			//     "workState": 1
			//   },
			//   {
			//     "id": "0806f881-5ada-4dd6-8870-9addee40016f",
			//     "equipmentName": "SSL出口",
			//     "equipmentCode": "b03de9ed0b034d8bb7815bb979f05022",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02849,
			//     "latitude": 43.99578,
			//     "workState": 1
			//   },
			//   {
			//     "id": "0a1aab7c-878f-4be5-b5e9-f370d168e17c",
			//     "equipmentName": "高环出口",
			//     "equipmentCode": "4d728c04818f4f4fabc29275b08b5987",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "1182b800-071d-4712-9a21-e0ba909b5d77",
			//     "equipmentName": "装卸车台区",
			//     "equipmentCode": "e5094b3afe3648eebb7bbb594dc6521b",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "1349b75a-d947-4c5e-9f49-33a2b8c08b08",
			//     "equipmentName": "NJ北侧东头",
			//     "equipmentCode": "19aec03f6a234b8bad889bc0f2492122",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "139ce441-ab1e-4580-b23f-2fd4ba4a8526",
			//     "equipmentName": "测速高环2",
			//     "equipmentCode": "e9f1106d119c4fc899a39e37e4df3b8b",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "14296385-a3c1-4b2b-a48a-5a96ff95320e",
			//     "equipmentName": "测速耐久路",
			//     "equipmentCode": "6f363eb67b54419c966811102b9deac7",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "14e75f85-0f2f-48e5-b6ba-e4203f6e848f",
			//     "equipmentName": "暖气换热站",
			//     "equipmentCode": "93e9509a84e244e980b52945c6d0abc1",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.03181,
			//     "latitude": 43.9989,
			//     "workState": 1
			//   },
			//   {
			//     "id": "187cd644-97fe-4da6-818d-33a5a1594556",
			//     "equipmentName": "ABS东加速段",
			//     "equipmentCode": "b72d70a56186443e996910935eeee89f",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 0
			//   },
			//   {
			//     "id": "1915c0e7-d021-4391-8d5e-7c543389db1d",
			//     "equipmentName": "GH西侧下环",
			//     "equipmentCode": "9508c61e45ce4a71acaa15cd9a76ae58",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02121,
			//     "latitude": 43.99059,
			//     "workState": 1
			//   },
			//   {
			//     "id": "23b46206-8c02-4aff-a0dd-7247f4c02b99",
			//     "equipmentName": "Camera 02",
			//     "equipmentCode": "06183cc99449460aa8657449148e7a45",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "2798ce49-77be-49a4-8dc1-8d05e5809cac",
			//     "equipmentName": "试车场入口",
			//     "equipmentCode": "17a732b791334abfb8b2659ded753bef",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.03565,
			//     "latitude": 44.00153,
			//     "workState": 1
			//   },
			//   {
			//     "id": "29e69c36-ce22-46f9-8de3-bc6be507b0ee",
			//     "equipmentName": "XN南入口",
			//     "equipmentCode": "9b778a695df043108f4055829b424915",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 0
			//   },
			//   {
			//     "id": "2baea9ed-f23d-4722-a636-52a8aaefe2d8",
			//     "equipmentName": "GH入口",
			//     "equipmentCode": "99f8751ace4c48b4a82eb13a24b5e53f",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "2bb1b67b-d395-453d-af6c-5a35230b18a1",
			//     "equipmentName": "SSL东侧跑道",
			//     "equipmentCode": "c3c0779cb2b040e09f803aa2506c67a6",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "2de28113-01d7-4ad0-98fd-7214854c26ed",
			//     "equipmentName": "给水净化间",
			//     "equipmentCode": "6a3ec9efbf9648cf9fac2505f3a4abca",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "303c7ff9-9558-47a2-bb05-905907b6f898",
			//     "equipmentName": "圆形广场入口",
			//     "equipmentCode": "ac68120282ac4357bfebddd36ea63397",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.03334,
			//     "latitude": 43.99983,
			//     "workState": 1
			//   },
			//   {
			//     "id": "3189292e-bf76-4bb5-83fd-34e234b88156",
			//     "equipmentName": "ABSL西",
			//     "equipmentCode": "165ab0f66eaf40ddaf7564600779a6af",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 0
			//   },
			//   {
			//     "id": "31eaec78-f106-4ce1-9087-c223b5655b20",
			//     "equipmentName": "维修间内2",
			//     "equipmentCode": "6d4a4ebee3ff4cec879bc3f0b7ac86cd",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "3851728b-0485-4d7e-9c5b-cb4246b555ab",
			//     "equipmentName": "NJ西南角",
			//     "equipmentCode": "32bf0b15312344b78ce973be26f5b3a1",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "3a9f8536-64e3-4294-baa1-e1820baf15f8",
			//     "equipmentName": "Camera 01",
			//     "equipmentCode": "a0a07339819a4d7eb49b35c26dccd8d3",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "3cf89285-fb93-4585-9225-bf643bc1bdf2",
			//     "equipmentName": "GH西侧高点",
			//     "equipmentCode": "466e73e3d84445d0818e58b81f89c893",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "42527e1f-cda2-481b-b537-8888bcd8f9b0",
			//     "equipmentName": "维修间后1",
			//     "equipmentCode": "27b1528504174ad4b7611c9b466b25d2",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "4776a55e-9716-40af-ae4a-acd2279853a7",
			//     "equipmentName": "ZS测试区",
			//     "equipmentCode": "258331afa970483098ad79ed8fd677f3",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "491ff9ec-116c-47a5-9eba-0200a5957caa",
			//     "equipmentName": "GH服务区出口",
			//     "equipmentCode": "9d74eecb8c764f9da57b8f7d8d39fc63",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "4c89aa4d-4952-43a4-bed5-31ec5710d119",
			//     "equipmentName": "场院入口",
			//     "equipmentCode": "af65b40fe56a4edf8da7f38917037377",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "4f4bff11-4136-4e4f-a191-ddcc24dfa6f4",
			//     "equipmentName": "备件库",
			//     "equipmentCode": "2790adc6db4d43ec870dac5e50e37394",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "5054f60f-75eb-4336-bacd-ec748443aa82",
			//     "equipmentName": "NJ灰尘洞",
			//     "equipmentCode": "0908da38624e42fb9455f0567b6c3c19",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "526e06f5-c895-4f11-ae11-fee060ecd6ea",
			//     "equipmentName": "Camera 02",
			//     "equipmentCode": "3170855b5007452bbc79f71d86277664",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "5c3323bf-a8fd-4ae8-94af-6957866b352b",
			//     "equipmentName": "NJL灰尘洞南侧",
			//     "equipmentCode": "d8d7394263c149d18fc57424b82eb364",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "5d4f8574-cef3-4a2b-8434-d6761a6084b5",
			//     "equipmentName": "综服楼南侧",
			//     "equipmentCode": "8c3c1e80bdae48cc994d0807fe53bee3",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "60f7718f-31e4-426c-95e1-0836387bd4b7",
			//     "equipmentName": "淋雨试验室设备间",
			//     "equipmentCode": "4fdfc478ee2d4c5989cda36b032169d5",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "61aa8e72-0a8f-44e8-907c-4c7a015df343",
			//     "equipmentName": "NJL南侧跑道2",
			//     "equipmentCode": "21586a8dca014914ba42891341cb9ea3",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "6353e2bd-b287-43e0-a296-c3b1a27bc028",
			//     "equipmentName": "充电间内南侧",
			//     "equipmentCode": "882035915f2d49328de7c3e9be0b7b6a",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "64725680-1724-4a2e-89eb-a9381ba1c3c0",
			//     "equipmentName": "样车库03",
			//     "equipmentCode": "b00c7619cd864a5ebbde9ff35a833bfd",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "66057f7b-ca5a-42bf-a7f6-84901d9213cc",
			//     "equipmentName": "NJL北侧跑道2",
			//     "equipmentCode": "928ac608e449439fbc8775dda4447111",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "674bb8ab-8fb7-425a-837a-6ed717dadafe",
			//     "equipmentName": "样车场01",
			//     "equipmentCode": "5d889527b1274fd7a991792867a9b828",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "691964a9-3b7b-410e-a020-4b91bf9328c0",
			//     "equipmentName": "NJ入口",
			//     "equipmentCode": "284ed494348e4bb78beca6d9fe3de6f9",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "6b6c0194-28cd-4bb8-83b3-d5874a0fb163",
			//     "equipmentName": "NJ西侧南",
			//     "equipmentCode": "16e1bf07be7d443a9236baa3a16abdbb",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "6bc7cd0b-2634-4f21-95a7-00d48c463abd",
			//     "equipmentName": "维修间内3",
			//     "equipmentCode": "9674c1b5dee949ce8c9afee69318c29c",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "6c0fff3f-44ad-4dd2-a089-0bb1e52ca533",
			//     "equipmentName": "NJ泥浆池",
			//     "equipmentCode": "0c22b32b812c454487b556d6226113dd",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "6e10d2c2-e2c5-4eab-b93c-5f9a587227a8",
			//     "equipmentName": "加油站加油机",
			//     "equipmentCode": "e83b59d4bac540969e5c56fa0448e6be",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "6ff55b88-70d1-4c0e-83ad-d431c11b4ff7",
			//     "equipmentName": "服务区路口",
			//     "equipmentCode": "0fa8ab1d0d2e43d99454487f98431411",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "74f23dab-0fa6-46ac-9101-2f220a0dfee7",
			//     "equipmentName": "维修间内4",
			//     "equipmentCode": "0883bc870d5f4fba99481993a5e0693d",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "76ce7b0a-b8be-45b5-82a7-aa785c957e5a",
			//     "equipmentName": "XN北侧",
			//     "equipmentCode": "e24e76606eb6474886582bab405c6755",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "78c48a3a-3640-4331-88da-ff1ac5cba8a7",
			//     "equipmentName": "NJL东侧弯路",
			//     "equipmentCode": "02bfe44ba943495bb74cae69e37472d5",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "79a1445a-7d60-4aab-b8f6-cca5f9b467ea",
			//     "equipmentName": "XN东侧",
			//     "equipmentCode": "703539645eb44c2bb9810cefa179bc25",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "7ce3ac17-609d-4b03-addf-dcf281c21844",
			//     "equipmentName": "GH北侧跑道",
			//     "equipmentCode": "0c379d543ab4497e8ffbe414cb1fbb8d",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "83280f63-c9d9-4659-9d0c-df1249bffdfd",
			//     "equipmentName": "污水处理站房",
			//     "equipmentCode": "28340c5af70748e39f95dabd6ff4b735",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "8699c859-4acf-41c2-8f1a-b3ffaff36695",
			//     "equipmentName": "GH东侧上环",
			//     "equipmentCode": "d68be2fd2f424641951f342754c8f893",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "86a918fc-84d9-497e-a398-7ecb341f2253",
			//     "equipmentName": "GH东侧高点",
			//     "equipmentCode": "2e3e52d1ac99434dad9350bec45771e6",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "877f48f9-7860-4bde-b6ce-8de47f993cd9",
			//     "equipmentName": "ABS控制间",
			//     "equipmentCode": "a2b82754883a4ec2b0ecdd8a2e77cac9",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "89609ef9-4145-4876-a715-466ddc4f77b0",
			//     "equipmentName": "GHL北侧跑道2",
			//     "equipmentCode": "4b10bc65c87c43eca40b1158dd96ebaf",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "8a708655-7423-46e4-abd1-05821050affc",
			//     "equipmentName": "样车场02",
			//     "equipmentCode": "4524c99595db4dfc82c8b3b50bf26c61",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 0
			//   },
			//   {
			//     "id": "8b6e05b1-b3b2-4fd6-a56c-36cd23e51383",
			//     "equipmentName": "NJ西北角",
			//     "equipmentCode": "8fb9c87fd1cd4d048eeac519b6ec4b40",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "911bebce-266d-4d93-ac73-16ba4bb9848f",
			//     "equipmentName": "样车库05",
			//     "equipmentCode": "b1ac0695393f4c01aa25bb54b13c4940",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "9121339c-04a2-4eee-b48d-e7b47ef4dbcb",
			//     "equipmentName": "测量广场",
			//     "equipmentCode": "dffd628a262b4b2899347ebf92984589",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "9246b9d5-0f8e-489d-ac1f-3bfc5e7a1492",
			//     "equipmentName": "NJ坡路南侧",
			//     "equipmentCode": "2b59d5f8cb1246238b0d4abe75942c91",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "92516d93-dc66-40b2-815a-58d55d9f0fa3",
			//     "equipmentName": "SSL北侧跑道",
			//     "equipmentCode": "53ef987641db430092c55e3c9cda36c7",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "93d954e4-0c70-425e-b1a4-11cb7db40e41",
			//     "equipmentName": "荷载场南侧",
			//     "equipmentCode": "db969bdca8324a55a63c8c11fbd0ba6b",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "96d16033-81bb-451f-8108-8fc9fb0bc6a4",
			//     "equipmentName": "GH西侧上环",
			//     "equipmentCode": "55c39d9e4c994c5bb1a38b3dcb308da3",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "9d7458f3-7fa8-42ac-88fe-69b0d0a0132b",
			//     "equipmentName": "综服楼西南角",
			//     "equipmentCode": "abfb7c9545fe423eb2c4fc1e936a44a3",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "a041404a-561c-441b-8eba-13b4ff9ad5b7",
			//     "equipmentName": "显示屏",
			//     "equipmentCode": "cs",
			//     "equipmentType": 5,
			//     "equipmentSpecification": "123",
			//     "longitude": 125.02937,
			//     "latitude": 44.002,
			//     "workState": 2
			//   },
			//   {
			//     "id": "a0845e86-2719-419e-88e5-619213f2b247",
			//     "equipmentName": "深水池入口",
			//     "equipmentCode": "34c1bb206b254c478f5b9903dbe455aa",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 0
			//   },
			//   {
			//     "id": "a1e56f66-7faf-4be5-ac10-9b6a91d71e8c",
			//     "equipmentName": "充电间内北侧",
			//     "equipmentCode": "a1c43b65e12b4c4ab322d3fcd35570d1",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "a52489db-fa60-4ed9-90ab-b6ba3cf62824",
			//     "equipmentName": "ZS西广场",
			//     "equipmentCode": "0b1f2b6a9a69447a87204d00e9480fc7",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "a72d4126-dfe2-4a55-9c0c-abf2be0e348b",
			//     "equipmentName": "停车库后西",
			//     "equipmentCode": "c4db788ac5d54cfba926ee33b0dbc1bb",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "a8127267-bdd4-45d2-9090-d05108f138a1",
			//     "equipmentName": "GH东侧下环",
			//     "equipmentCode": "cade47d094304a53985cad1ffecf87da",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "a9b6cc18-d106-4dfc-9bb7-cd924f7beeda",
			//     "equipmentName": "测速进场路",
			//     "equipmentCode": "7587d39713db42489ee7ed9225aae317",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "aabd13d3-6b67-4672-a946-4a8c668832f1",
			//     "equipmentName": "NJ出口",
			//     "equipmentCode": "900955ad50b04e8da042a36ad2607f79",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "adb6508c-9f13-4393-9156-042a2393c0c7",
			//     "equipmentName": "扒胎机",
			//     "equipmentCode": "扒胎机",
			//     "equipmentType": 7,
			//     "equipmentSpecification": "扒胎机",
			//     "longitude": 125.02671,
			//     "latitude": 43.99881,
			//     "workState": 1
			//   },
			//   {
			//     "id": "adf2ce44-7ce4-49e7-aa7b-7be6212b626b",
			//     "equipmentName": "NJ坡路西侧",
			//     "equipmentCode": "e187d1f87ce046139d86ee2443414d20",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "ae39873d-b03f-4ac8-8e9a-b1af5538c1c1",
			//     "equipmentName": "ABS东",
			//     "equipmentCode": "4cdbed39a4ad4c55a1e6eddc09b04843",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 0
			//   },
			//   {
			//     "id": "b1226e53-3d6a-4a4a-b9c6-0906f93b9667",
			//     "equipmentName": "SSL南侧跑道",
			//     "equipmentCode": "5c6a71b6554b4ae495d01577d84f3e11",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 0
			//   },
			//   {
			//     "id": "b31ac43c-df5c-403e-9031-0a66ef5d394f",
			//     "equipmentName": "综服楼院门口",
			//     "equipmentCode": "a1fda98800194f468a535e1eb9379f9c",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "b34e4afa-38a5-4bfc-91a7-913c55dfeb6d",
			//     "equipmentName": "加油站库区",
			//     "equipmentCode": "d84c1f6fec5a4711ad77cfc50f944c02",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 0
			//   },
			//   {
			//     "id": "b617aafa-3734-4b60-937b-b20709b43015",
			//     "equipmentName": "维修间外2",
			//     "equipmentCode": "6d24ffa236c74f08bce82992ba07bd9c",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "b6346c1d-895a-4fab-a343-81affff061f9",
			//     "equipmentName": "维修间内1",
			//     "equipmentCode": "ddd336c43f594fc5b39d349f8a46f2db",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "b8d580f1-c761-4266-9814-c60c09baa485",
			//     "equipmentName": "维修间后2",
			//     "equipmentCode": "d222a36345fa4040b862a51e79af618c",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "bc0dd5b1-a4c5-422b-bb79-c087e305cfce",
			//     "equipmentName": "维修间外1",
			//     "equipmentCode": "157820a47cd647feb793040e4ba8aee8",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "bd9b9054-1090-42d4-be8f-e22330040f12",
			//     "equipmentName": "Camera 01",
			//     "equipmentCode": "46fd3c071e364b14a93b1507dd4e1c69",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "be191a9a-deb4-44dd-9bb1-dfbd553276dd",
			//     "equipmentName": "XN出口",
			//     "equipmentCode": "96cf7aa1523e436890c23377ed99b496",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02774,
			//     "latitude": 43.99805,
			//     "workState": 1
			//   },
			//   {
			//     "id": "c05d39b0-7341-4320-9969-24b777d1efea",
			//     "equipmentName": "圆形广场",
			//     "equipmentCode": "eb07b0792fc3425d815b72bc78ec64dd",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "c104b60b-91aa-4038-bf58-cb6648dca24d",
			//     "equipmentName": "Camera 01",
			//     "equipmentCode": "6b06a9b08988468e83e3b44d78ca1e55",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "c1c763b4-f2ed-4374-a370-e60d453cc665",
			//     "equipmentName": "NJ出口支路",
			//     "equipmentCode": "4209b0180b684f88a40e82673fea1523",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "c222adb3-dfd9-4c13-9a2e-138852cbad0f",
			//     "equipmentName": "NJ南侧西头",
			//     "equipmentCode": "133a4a7c86314b058833788efbb57214",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "c27432fd-3630-4b8e-981f-b9ca67c56654",
			//     "equipmentName": "淋雨试验室控制间",
			//     "equipmentCode": "c0d9885f729f4376830382a103d52877",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "c46059ab-e737-4c3a-82ec-01632878ec37",
			//     "equipmentName": "XN西侧球",
			//     "equipmentCode": "4228abc1072c4c749f566ab5d8c645c6",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "c92649b6-a47a-4394-a30c-6c81a62021d1",
			//     "equipmentName": "NJ北侧西头",
			//     "equipmentCode": "f08b5d9ef98f4ba08d0d1c65e36fb34a",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "c93a485c-2377-4db6-80d1-f6e81713496e",
			//     "equipmentName": "XN西侧",
			//     "equipmentCode": "8e43e6666be9423d92437c755d21e57b",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "c95b162b-c2c6-4c95-88ae-20bcfb01600e",
			//     "equipmentName": "GH南侧跑道",
			//     "equipmentCode": "8a1b2637a4124a26bace706528e13bf6",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "cb20fd3e-65d2-4633-86f8-8a43883b7e8c",
			//     "equipmentName": "综服楼西侧",
			//     "equipmentCode": "ddac6c3be3554af09a4fd553bb8e010e",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "cb433d48-5e47-4348-9ad4-73e0217f8416",
			//     "equipmentName": "测速高环1",
			//     "equipmentCode": "681b6ca69bdc443fab66a9a4947253d8",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.03189,
			//     "latitude": 43.99657,
			//     "workState": 1
			//   },
			//   {
			//     "id": "cb47c667-89fe-4ba3-b9f6-da417f3ab03f",
			//     "equipmentName": "Camera 02",
			//     "equipmentCode": "f570b8b8e583477b82165e9a1ab2a3ce",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "cb747d9c-50cd-4f9a-a894-7f248113e8e7",
			//     "equipmentName": "样车库04",
			//     "equipmentCode": "0723064064da4cce82217094dbc60f5e",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "cf247624-bed6-423a-9b35-3d93119bb9fe",
			//     "equipmentName": "NJ东侧凸路",
			//     "equipmentCode": "5a02ee53d9f347a293c3e52f7e1638de",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "cf7945be-b427-42e6-9e1e-38e153bb71e7",
			//     "equipmentName": "Camera 01",
			//     "equipmentCode": "73613e99264d4cef93294ef0d44a54fe",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "cfb1a015-0d5f-4f26-ac1a-a42e713dd240",
			//     "equipmentName": "NJ南侧跑道",
			//     "equipmentCode": "144321899e9947baaf4b7cf7d7a4f588",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "d5f1fcad-157b-4e9c-8b9d-f1fc1cb0e1f7",
			//     "equipmentName": "GHL南侧跑道2",
			//     "equipmentCode": "afb4cc4297554c8dba83340ba18e8e93",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "d8101b80-e9fc-482b-a236-89386c90e28a",
			//     "equipmentName": "载荷装卸间",
			//     "equipmentCode": "e79f2830a1764cc6a079d31739414e9f",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "db59e776-05c4-452f-a1cc-db9d4fc583d5",
			//     "equipmentName": "深水池出口",
			//     "equipmentCode": "f88066f9b08e41a5ae408f39162ac4e6",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 0
			//   },
			//   {
			//     "id": "dbe80faf-402e-4c36-b132-330c2e7475cd",
			//     "equipmentName": "测速出场路",
			//     "equipmentCode": "8d9f82612e0646c0bfdd8b15af3ad085",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "dc11888d-4ae9-41ee-97d7-b36b640d34f2",
			//     "equipmentName": "气象观测站",
			//     "equipmentCode": "6dafe8f2a6184118b440eea488cd9dc3",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 0
			//   },
			//   {
			//     "id": "dc61dab2-21c4-4a46-ac31-978fb2e1129a",
			//     "equipmentName": "测速高环3",
			//     "equipmentCode": "2de2447e18f848caab339959129a742e",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "deffaf3d-e4ed-4a60-925e-165588dafac3",
			//     "equipmentName": "NJ西侧跑道",
			//     "equipmentCode": "7e2f0be1d4794d1b86fd3586a1c14141",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "e00b366d-39bf-457c-9ef3-d3a4e36e3146",
			//     "equipmentName": "NJ北侧跑道",
			//     "equipmentCode": "e4cef194672f4d9398a22f3d078f1ac5",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "e62fa618-d4b7-4019-aee0-06c22d7ba5d3",
			//     "equipmentName": "龙门吊",
			//     "equipmentCode": "龙门吊",
			//     "equipmentType": 6,
			//     "equipmentSpecification": "龙门吊",
			//     "longitude": 125.02459,
			//     "latitude": 43.99573,
			//     "workState": 1
			//   },
			//   {
			//     "id": "e7dee4e9-440a-4550-95ef-e2e60144f8b3",
			//     "equipmentName": "ZS东广场",
			//     "equipmentCode": "2702f9bae18a4deab130c4b2a4f7bf99",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 0
			//   },
			//   {
			//     "id": "e8c3c607-07a6-4a1c-8c1b-25d33b568bcb",
			//     "equipmentName": "充电站",
			//     "equipmentCode": "53ffb0555afe4e788344e09b7e30b0cb",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "e90783ce-d011-40af-aaba-0837ed985d26",
			//     "equipmentName": "指挥塔顶",
			//     "equipmentCode": "5b36c35d247748e6a7413c9aa60a23c6",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "e9e147bc-6693-4bd9-97cc-4d36a74f4c02",
			//     "equipmentName": "NJ东北角",
			//     "equipmentCode": "8a3d7cf9397e4d1da1cedfb15ed3e362",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "ea538d15-bf87-40a4-aaa1-0000ed459a08",
			//     "equipmentName": "XN入口",
			//     "equipmentCode": "4438480c48024bfc80e3fe29e7e70441",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.03441,
			//     "latitude": 43.99991,
			//     "workState": 1
			//   },
			//   {
			//     "id": "eae0927d-d611-4d1c-97a0-2933e265ae0a",
			//     "equipmentName": "商车检测车间",
			//     "equipmentCode": "d81f7874ccb74c1298ca869197dcd26b",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "eb57cfe9-c45b-4c5f-a6f4-a2e9ca707f01",
			//     "equipmentName": "XN东侧球",
			//     "equipmentCode": "64d00587c9204738b00b725a5d5391f2",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "f0df9592-db87-45d4-87a3-daa81f0e0d46",
			//     "equipmentName": "试车场出口",
			//     "equipmentCode": "f5f8a04a8d994b899461388b594317dd",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "f6bd8c7e-cd19-4ec5-aba7-b31c5a09d433",
			//     "equipmentName": "SSL入口",
			//     "equipmentCode": "aa4f4088c95041c9a1ae86b0dba7406e",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "fba18770-6891-407a-b5f0-206313f7f15d",
			//     "equipmentName": "废油品库",
			//     "equipmentCode": "face7f3519b64b34a238fe52ea53c265",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   },
			//   {
			//     "id": "fcd54375-592d-4dc6-9b87-d369dbaaf456",
			//     "equipmentName": "停车库后东",
			//     "equipmentCode": "9572c8fb1f764822882ba97eeb2ad153",
			//     "equipmentType": 1,
			//     "equipmentSpecification": "枪机",
			//     "longitude": 125.02945,
			//     "latitude": 43.99821,
			//     "workState": 1
			//   }
			// ]
			//     equipmentposition.adds(data)

			$.ajax({
				type: "GET",
				// url: URL.equipment.getEquipmentInfo,
				url: "http://pgms.fawjiefang.com.cn/fullscreenmap/info/getValidEquipments",
				dataType: "json",
				success: function (result) {
					if (result.code == 0) {
						var allData = result.data;
						equipmentposition.adds(allData);
					}
				},
				error: function (e) {
					console.error(e);
					layer.msg("添加设备定位出错，请刷新页面重试！", { icon: 2 });
				},
			});
		}

		//加载搜索poi自动完成
		function loadAutocomplete() {
			AMap.plugin("AMap.Autocomplete", function () {
				var autoComplete = new AMap.Autocomplete({ input: "txtAutocomplete" });
				AMap.event.addListener(autoComplete, "select", function (e) {
					var location = e.poi.location;
					if (location && location != "") {
						mymap
							.getProtogenesis()
							.setZoomAndCenter(16, [location.lng, location.lat]);
					} else {
						layer.msg("没有此位置的定位信息，请换个位置再试！", { icon: 0 });
					}
				});
				//回车事件
				$("#txtAutocomplete").keypress(function (e) {
					if (e.keyCode == 13) {
						var keyword = $("#txtAutocomplete").val();
						autoComplete.search(keyword, function (status, result) {
							if (status == "complete") {
								var siteArray = result.tips;
								for (var i = 0; i < siteArray.length; i++) {
									var location = siteArray[i].location;
									if (location && location != "") {
										mymap
											.getProtogenesis()
											.setZoomAndCenter(16, [location.lng, location.lat]);
										return;
									}
								}
							} else if (status == "error") {
							} else if (status == "no_data") {
								layer.msg("未找到此位置！", { icon: 0 });
							}
						});
					}
				});
			});
		}

		// function RefreshTable() {
		//   window.setTimeout(function () {
		//     $.ajax({
		//       type: "POST",
		//       url: URL.carAlarm.getCarAlarmInfo,
		//       cache: false,
		//       dataType: "json",
		//       success: function (result) {
		//         if (result && result.state == 1) {
		//           var data = result.data;
		//           $("#d1").text(
		//             data.TerminalCustomizeAlarm[0].carno +
		//               "  " +
		//               data.TerminalCustomizeAlarm[0].rulename
		//           );
		//           $("#d2").text(
		//             data.TerminalCustomizeAlarm[1].carno +
		//               "  " +
		//               data.TerminalCustomizeAlarm[1].rulename
		//           );
		//           $("#d3").text(
		//             data.TerminalCustomizeAlarm[2].carno +
		//               "  " +
		//               data.TerminalCustomizeAlarm[2].rulename
		//           );
		//         } else {
		//           layer.msg(result.msg, { icon: 2 });
		//         }
		//         // RefreshTable();
		//       },
		//     });
		//   }, 20000);
		// }

		// function InitTable() {
		//   $.ajax({
		//     type: "POST",
		//     url: URL.carAlarm.getCarAlarmInfo,
		//     cache: false,
		//     dataType: "json",
		//     success: function (result) {
		//       if (result && result.state == 1) {
		//         var data = result.data;
		//         $("#d1").text(
		//           data.TerminalCustomizeAlarm[0].carno +
		//             "  " +
		//             data.TerminalCustomizeAlarm[0].rulename
		//         );
		//         $("#d2").text(
		//           data.TerminalCustomizeAlarm[1].carno +
		//             "  " +
		//             data.TerminalCustomizeAlarm[1].rulename
		//         );
		//         $("#d3").text(
		//           data.TerminalCustomizeAlarm[2].carno +
		//             "  " +
		//             data.TerminalCustomizeAlarm[2].rulename
		//         );
		//       }
		//     },
		//   });
		// }

		//高德地图天气api
		function getWea() {
			$.ajax({
				type: "GET",
				url: URL.weather.getWea,
				dataType: "json",
				success: function (result) {
					if (result.infocode == "10000") {
						let weath = result.lives[0].weather;
						let path = "Resource/icon/icon_tianqi_qingtian.png";
						if (weath.indexOf("晴") != -1) {
							path = "Resource/icon/icon_tianqi_qingtian.png";
						} else if (weath.indexOf("多云") != -1) {
							path = "Resource/icon/icon_tianqi_duoyun.png";
						} else if (weath.indexOf("大雨") != -1) {
							path = "Resource/icon/icon_tianqi_dayu.png";
						} else if (weath.indexOf("中雨") != -1) {
							path = "Resource/icon/icon_tianqi_zhongyu.png";
						} else if (weath.indexOf("小雨") != -1) {
							path = "Resource/icon/icon_tianqi_xiaoyu.png";
						} else if (weath.indexOf("雷阵雨") != -1) {
							path = "Resource/icon/icon_tianqi_leizhenyu.png";
						} else if (weath.indexOf("阵雨") != -1) {
							path = "Resource/icon/icon_tianqi_zhenyu.png";
						} else if (weath.indexOf("雨") != -1) {
							path = "Resource/icon/icon_tianqi_xiaoyu.png";
						} else if (weath.indexOf("阴天") != -1) {
							path = "Resource/icon/icon_tianqi_yintian.png";
						} else if (weath.indexOf("雨夹雪") != -1) {
							path = "Resource/icon/icon_tianqi_yujiaxue.png";
						} else if (weath.indexOf("雪") != -1) {
							path = "Resource/icon/icon_tianqi_xiaxue.png";
						} else if (weath.indexOf("雾") != -1) {
							path = "Resource/icon/icon_tianqi_dawu.png";
						} else {
							path = "Resource/icon/icon_tianqi_qingtian.png";
						}
						$("#weatherIcon").attr("src", path);
					} else {
						layer.msg("获取天气信息出错，请刷新页面重试！", { icon: 2 });
					}
				},
				error: function (e) {
					layer.msg("获取天气信息出错，请刷新页面重试！", { icon: 2 });
				},
			});
		}

		//农安气象站api
		function getWeather() {
			$.ajax({
				type: "GET",
				url: URL.weather.getWeather,
				dataType: "json",
				success: function (result) {
					if (result.code == 0) {
						var data = result.data;
						$("#temperature").text(data.temperature);
						$("#rainfall").text(data.rainfall);
						$("#instantaneousWindDirection").text(data.fxAvg1);
						$("#instantaneousWindSpeed").text(data.fsAvg1);
						$("#averageWindDirection").text(data.fxAvg10);
						$("#averageWindSpeed").text(data.fsAvg10);
					} else {
						layer.msg("获取天气信息出错，请刷新页面重试！", { icon: 2 });
					}
				},
				error: function (e) {
					console.error(e);
					layer.msg("获取天气信息出错，请刷新页面重试！", { icon: 2 });
				},
			});
		}

		function sheBeiFilter(params) {
			switch (params) {
				case 1:
					return "摄像头";
				case 2:
					return "道闸";
				case 3:
					return "加油机";
				case 4:
					return "充电桩";
				case 5:
					return "显示屏";
				case 6:
					return "龙门吊";
				case 7:
					return "扒胎机";
				case 8:
					return "地中衡";
				case 9:
					return "气象站";
				default:
					return "其他";
			}
		}

		function loadChangDiSheBei() {
			// let data = [
			//   {
			//     "equipmentType": 1,
			//     "totalCount": 117,
			//     "onLineCount": 106,
			//     "offLineCount": 11
			//   },
			//   {
			//     "equipmentType": 5,
			//     "totalCount": 1,
			//     "onLineCount": 1,
			//     "offLineCount": 0
			//   },
			//   {
			//     "equipmentType": 2,
			//     "totalCount": 0,
			//     "onLineCount": 0,
			//     "offLineCount": 0
			//   },
			//   {
			//     "equipmentType": 9,
			//     "totalCount": 0,
			//     "onLineCount": 0,
			//     "offLineCount": 0
			//   }
			// ];
			$.ajax({
				type: "GET",
				url: "http://pgms.fawjiefang.com.cn/fullscreenmap/equipment/getEquipmentSummary",
				dataType: "json",
				success: function (result) {
					if (result.code == 0) {
						equipmentList = result.data;
						var data = result.data;
						data.forEach((item, index) => {
							$("#circle" + (index + 1)).Circle({
								value: (item.offLineCount / item.totalCount) * 100,
								total: item.totalCount,
								tips: true,
								size: 31,
								textSize: 15,
								textColor: "#fff",
								lineWidth: 3,
								bgColor: "#27FCEA",
								cirColor: "#FFCC00",
								tipsColor: "#32C9EE",
								tipsUnit: false,
								tipsSize: 15,
								tipsText: sheBeiFilter(item.equipmentType),
							});
						});
						$("#daozhaZc").text(data[0].onLineCount);
						$("#daozhaYc").text(data[0].offLineCount);
						$("#sxtZc").text(data[1].onLineCount);
						$("#sxtYc").text(data[1].offLineCount);
						$("#ledZc").text(data[2].onLineCount);
						$("#ledYc").text(data[2].offLineCount);
						$("#otherZc").text(data[3].onLineCount);
						$("#otherYc").text(data[3].offLineCount);
						// $("#circle1").Circle({
						//   value: (dz.offLineCount / dz.totalCount) * 100,
						//   total: dz.totalCount,
						//   tips: true,
						//   size: 40,
						//   textSize: 18,
						//   textColor: "#fff",
						//   lineWidth: 3,
						//   bgColor: "#27FCEA",
						//   cirColor: "#FFCC00",
						//   tipsColor: "#32C9EE",
						//   tipsUnit: false,
						//   tipsSize: 15,
						//   tipsText: "道闸",
						// });
						// $("#daozhaZc").text(dz.onLineCount);
						// $("#daozhaYc").text(dz.offLineCount);
						// $("#circle2").Circle({
						//   value: (sxt.offLineCount / sxt.totalCount) * 100,
						//   total: sxt.totalCount,
						//   tips: true,
						//   size: 40,
						//   textSize: 18,
						//   textColor: "#fff",
						//   lineWidth: 3,
						//   bgColor: "#27FCEA",
						//   cirColor: "#FFCC00",
						//   tipsColor: "#32C9EE",
						//   tipsUnit: false,
						//   tipsSize: 15,
						//   tipsText: "摄像头",
						// });
						// $("#sxtZc").text(sxt.onLineCount);
						// $("#sxtYc").text(sxt.offLineCount);
						// $("#circle3").Circle({
						//   value: (led.offLineCount / led.totalCount) * 100,
						//   total: led.totalCount,
						//   tips: true,
						//   size: 40,
						//   textSize: 18,
						//   textColor: "#fff",
						//   lineWidth: 3,
						//   bgColor: "#27FCEA",
						//   cirColor: "#FFCC00",
						//   tipsColor: "#32C9EE",
						//   tipsUnit: false,
						//   tipsSize: 15,
						//   tipsText: "LED屏幕",
						// });
						// $("#ledZc").text(led.onLineCount);
						// $("#ledYc").text(led.offLineCount);
						// $("#circle4").Circle({
						//   value: (qt.offLineCount / qt.totalCount) * 100,
						//   total: qt.totalCount,
						//   tips: true,
						//   size: 40,
						//   textSize: 18,
						//   textColor: "#fff",
						//   lineWidth: 3,
						//   bgColor: "#27FCEA",
						//   cirColor: "#FFCC00",
						//   tipsColor: "#32C9EE",
						//   tipsUnit: false,
						//   tipsSize: 15,
						//   tipsText: "其他",
						// });
						// $("#otherZc").text(qt.onLineCount);
						// $("#otherYc").text(qt.offLineCount);
					} else {
						layer.msg("获取场地设备信息出错，请刷新页面重试！", { icon: 2 });
					}
				},
				error: function (e) {
					console.error(e);
					layer.msg("获取场地设备信息出错，请刷新页面重试！", { icon: 2 });
				},
			});
		}

		//获取试验违规信息
		function getTestViolationInformation() {
			// let data = [
			//   {
			//     againstType: 0,
			//     reportType: 0,
			//     againstList: [
			//       {
			//         againstAddress: "试验设施",
			//         carNum: "YS1442",
			//         againstTime: "2022-02-23 13:59:11",
			//       },
			//       {
			//         againstAddress: "高速环路",
			//         carNum: "YS1290",
			//         againstTime: "2022-02-23 13:23:42",
			//       },
			//     ],
			//     againstTotal: 689,
			//   },
			//   {
			//     againstType: 1,
			//     reportType: 0,
			//     againstList: [
			//       {
			//         againstAddress: "高速环路",
			//         carNum: "YS1570",
			//         againstTime: "2022-02-23 14:21:09",
			//       },
			//       {
			//         againstAddress: "高速环路",
			//         carNum: "YS1570",
			//         againstTime: "2022-02-23 14:20:09",
			//       },
			//     ],
			//     againstTotal: 12397,
			//   },
			//   {
			//     againstType: 2,
			//     reportType: 0,
			//     againstList: [],
			//     againstTotal: 0,
			//   },
			//   {
			//     againstType: 3,
			//     reportType: 0,
			//     againstList: [],
			//     againstTotal: 0,
			//   },
			//   {
			//     againstType: 4,
			//     reportType: 0,
			//     againstList: [],
			//     againstTotal: 0,
			//   },
			//   {
			//     againstType: 5,
			//     reportType: 0,
			//     againstList: [],
			//     againstTotal: 466,
			//   },
			//   {
			//     againstType: 6,
			//     reportType: 0,
			//     againstList: [],
			//     againstTotal: 10070,
			//   },
			//   {
			//     againstType: null,
			//     reportType: 1,
			//     againstList: [
			//       {
			//         againstAddress: "高速环路",
			//         carNum: "0209",
			//         againstTime: "2022-02-10 00:00:00",
			//       },
			//     ],
			//     againstTotal: 1,
			//   },
			// ];
			$.ajax({
				type: "GET",
				url: "http://pgms.fawjiefang.com.cn/fullscreenmap/siteOperaMonitor/against",
				dataType: "json",
				success: function (result) {
					if (result.code == 0) {
						var data = result.data;
						let IllegalTurning = data.filter(
							(item) => item.againstType == 2
						)[0]["againstTotal"]; //违规转弯
						let LaneDeparture = data.filter((item) => item.againstType == 1)[0][
							"againstTotal"
						]; //车道偏离
						let FatigueDriving = data.filter(
							(item) => item.againstType == 4
						)[0]["againstTotal"]; //疲劳驾驶
						let vehicle = data.filter((item) => item.againstType == 3)[0][
							"againstTotal"
						]; //车距过近
						let UltraHighSpeed = data.filter(
							(item) => item.againstType == 5
						)[0]["againstTotal"]; //超高速
						let UltraLowSpeed = data.filter((item) => item.againstType == 6)[0][
							"againstTotal"
						]; //超低速
						$("#IllegalTurning").text(IllegalTurning);
						$("#LaneDeparture").text(LaneDeparture);
						$("#FatigueDriving").text(FatigueDriving);
						$("#vehicle").text(vehicle);
						$("#UltraHighSpeed").text(UltraHighSpeed);
						$("#UltraLowSpeed").text(UltraLowSpeed);
						$("#IllegalTurning").leoTextAnimate({
							delay: 4000,
							fixed: [""], //
							start: "-",
						});
						$("#LaneDeparture").leoTextAnimate({
							delay: 4000,
							fixed: [""], //
							start: "-",
						});
						$("#FatigueDriving").leoTextAnimate({
							delay: 4000,
							fixed: [""], //
							start: "-",
						});
						$("#vehicle").leoTextAnimate({
							delay: 4000,
							fixed: [""], //
							start: "-",
						});
						$("#UltraHighSpeed").leoTextAnimate({
							delay: 4000,
							fixed: [""], //
							start: "-",
						});
						$("#UltraLowSpeed").leoTextAnimate({
							delay: 4000,
							fixed: [""], //
							start: "-",
						});
					} else {
						layer.msg("获取试验违规信息出错，请刷新页面重试！", { icon: 2 });
					}
				},
				error: function (e) {
					console.error(e);
					layer.msg("获取试验违规信息出错，请刷新页面重试！", { icon: 2 });
				},
			});
		}

		//获取异常计划信息
		function getViolation() {
			// let data = [
			//   {
			//     violationTotal: "582",
			//     violationAtion: 1,
			//   },
			//   {
			//     violationTotal: "32",
			//     violationAtion: 2,
			//   },
			//   {
			//     violationTotal: "1",
			//     violationAtion: 3,
			//   },
			//   {
			//     violationTotal: "15",
			//     violationAtion: 4,
			//   },
			//   {
			//     violationTotal: "24",
			//     violationAtion: 5,
			//   },
			//   {
			//     violationTotal: "44",
			//     violationAtion: 6,
			//   },
			// ];
			// let admission1 = data.filter((item) => item.violationAtion == 1)[0][
			//   "violationTotal"
			// ]; //未办理入场
			// let admission2 = data.filter((item) => item.violationAtion == 2)[0][
			//   "violationTotal"
			// ]; //未及时入场
			// let admission3 = data.filter((item) => item.violationAtion == 3)[0][
			//   "violationTotal"
			// ]; //超时未出场
			// let admission4 = data.filter((item) => item.violationAtion == 6)[0][
			//   "violationTotal"
			// ]; //取消试验单
			// $("#admission1").text(admission1);
			// $("#admission2").text(admission2);
			// $("#admission3").text(admission3);
			// $("#admission4").text(admission4);
			$.ajax({
				type: "GET",
				url: "http://pgms.fawjiefang.com.cn/fullscreenmap/siteOperaMonitor/violation",
				dataType: "json",
				success: function (result) {
					if (result.code == 0) {
						var data = result.data;
						let admission1 = data.filter((item) => item.violationAtion == 1)[0][
							"violationTotal"
						]; //未办理入场
						let admission2 = data.filter((item) => item.violationAtion == 2)[0][
							"violationTotal"
						]; //未及时入场
						let admission3 = data.filter((item) => item.violationAtion == 3)[0][
							"violationTotal"
						]; //超时未出场
						let admission4 = data.filter((item) => item.violationAtion == 6)[0][
							"violationTotal"
						]; //取消试验单
						$("#admission1").text(admission1);
						$("#admission2").text(admission2);
						$("#admission3").text(admission3);
						$("#admission4").text(admission4);
						$("#admission1").leoTextAnimate({
							delay: 4000,
							fixed: [""], //
							start: "-",
						});
						$("#admission2").leoTextAnimate({
							delay: 4000,
							fixed: [""], //
							start: "-",
						});
						$("#admission3").leoTextAnimate({
							delay: 4000,
							fixed: [""], //
							start: "-",
						});
						$("#admission4").leoTextAnimate({
							delay: 4000,
							fixed: [""], //
							start: "-",
						});
					} else {
						layer.msg("获取异常计划信息出错，请刷新页面重试！", { icon: 2 });
					}
				},
				error: function (e) {
					console.error(e);
					layer.msg("获取异常计划信息出错，请刷新页面重试！", { icon: 2 });
				},
			});
		}

		//加载试验场
		function loadTestSite() {
			$.ajax({
				type: "POST",
				url: URL.testSite.getTestSite,
				cache: false,
				dataType: "json",
				success: function (result) {
					if (result.state == 1) {
						var data = result.data;
						for (var i = 0; i < data.length; i++) {
							var name = data[i].name;
							var pointStr = data[i].datapoints;
							if (pointStr) {
								var point = JSON.parse(pointStr);
								if (point && point.length > 0) {
									var html =
										"<button onclick=\"btnTestSiteClick('" +
										point[0].x +
										"," +
										point[0].y +
										"')\">" +
										name +
										"</button>";
									$(".index-header-dropdown-content").append(html);
								}
							}
						}
					} else {
						layer.msg("获取试验场信息出错，请刷新页面重试！", { icon: 2 });
					}
				},
				error: function (e) {
					console.error(e);
					layer.msg("获取试验场信息出错，请刷新页面重试！", { icon: 2 });
				},
			});

			btnTestSiteClick = function (point) {
				var pointArr = point.split(",");
				mymap.getProtogenesis().setZoomAndCenter(16, pointArr);
			};
		}
		$(function () {
			var topVal = ($(window).height() - 100) / 2;
			$(".i-ShowSearchResult-Div").css({
				position: "fixed",
				"z-index": "11",
				top: topVal + "px",
			});

			$("#dialog1").css({
				width: window.innerWidth - 30,
				left: window.innerWidth,
			});
			$("#dialog2").css({
				left: window.innerWidth,
			});
			setTimeout(() => {
				$("#dialog1").css({
					opacity: 1,
					left: 0,
					transition: "left 1s",
				});
				$("#dialog2").css({
					left: 0,
					opacity: 1,
					transition: "left 1s",
				});
			}, 2000);
			btnEvent();
			SearchCarPageFunction();
			loadModules();
			loadRoadSituationList();
			addCarPosition();
			addEquipmentPosition();
			loadAutocomplete();
			loadTestSite();
			// RefreshTable();
			// InitTable();
			getWea();
			getWeather();
			loadChangDiSheBei();
			getViolation();
			getTestViolationInformation();
			setInterval(()=>{
				getWea();
				getWeather();//天气
				loadRoadSituationList();//场地容量及计划信息
				getTestViolationInformation();//试验违规信息
				loadChangDiSheBei();//设备信息
				getViolation(); //异常计划信息
			},10000)
		});

		console.log("%c警告", "color:red;");
		console.log("%c此功能仅供开发者使用,请勿在此执行任何操作！", "color:red;");
		console.log("%c版本：V" + allConfig.version, "color:blue;");
	});
})();
