sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox"
], function (Controller, History, MessageBox) {
	"use strict";

	return Controller.extend("com.axium.Axium.controller.ScanHU", {
		onInit: function () {

			this.odataService = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZWM_GW_RFSCREENS_SRV/", true);
			this.oList = this.getView().byId("idList");
			this.aData = [];
			this.aDataCpy = [];
			this.Batchno = "";
			this.MaterialDesc = "";
			this.saveFlag = false;

			this.getView().addEventDelegate({
				onBeforeShow: jQuery.proxy(function (evt) {
					this.onBeforeShow(evt);
				}, this)
			});
		},
		// 	onBeforeShow: function() {

		// 	var listModel = this.getOwnerComponent().getModel("oListHU");
		// 	var oListModel = $.extend(true, {}, listModel);
		// 	this.getOwnerComponent().setModel(oListModel, "oListHU");
		// },
		onBeforeShow: function (oEvent) {
			var oRef = this;
			setTimeout(function () {
				var oInput = oRef.getView().byId("id1");
				oInput.focus();
			}, 1000);
		},

		onBeforeRendering: function () {
			var oRef = this;
			var aData = oRef.getView().getModel("oListHU").getData();
			var aDataCpy = oRef.getView().getModel("oListHUCpy").getData();
			oRef.aData = [];
			oRef.aDataCpy = [];
			oRef.getView().getModel("oListHU").setData(oRef.aData);
			oRef.getView().getModel("oListHUCpy").setData(oRef.aDataCpy);
			oRef.getView().getModel("oListHU").refresh(true);
			oRef.getView().getModel("oListHUCpy").refresh(true);
			oRef.getView().byId("idList").destroyItems();
			this.getView().byId("id1").setValue("");
		},

		// onBeforeShow: function(oEvent) {
		// 	var oRef = this;
		// 	setTimeout(function() {
		// 		var oInput = oRef.getView().byId("id1");
		// 		oInput.focus();
		// 	}, 1000);
		// },

		// handleSearch: function(oEvent) {
		onhandleSearch: function (oEvent) {
			var oRef = this;
			var hFlag = false;

			var tempVar = oRef.getView().byId("id1").getValue();
			var bool = tempVar.startsWith("(");
			if (bool) {
				tempVar = tempVar.replace(/[^A-Z0-9]+/ig, "");
			} else {
				tempVar = tempVar;
			}
			var regExp = /^0[0-9].*$/;
			var test = regExp.test(tempVar);
			console.log(test);

			if (test || bool) {
				if (tempVar.length >= 20) {
					setTimeout(function () {
						tempVar = tempVar.replace(/[^A-Z0-9]+/ig, "");
						tempVar = tempVar.replace(/^0+/, '');
						oRef.getView().byId("id1").setValue(tempVar);
						var aDataCpy = oRef.getView().getModel("oListHUCpy");
						if (aDataCpy != undefined) {
							// var aData = oRef.getOwnerComponent().getModel("oListHUCpy").getData();
							var extFlag = true;

							$.each(aDataCpy.oData.HUSet, function (index, item) {

								if (item.ExternalHU === tempVar) {
									extFlag = false;
									MessageBox.information("HU Number is already scanned", {
										title: "Information"
									});
									oRef.getView().byId("id1").setValue("");
								}
							});
						}

						if (extFlag) {
							// this.odataService.read("/ScannedHU?ExternalHU='" + tempVar + "'", {
							oRef.odataService.read("/ScannedHU?ExternalHU='" + tempVar + "'", {

								success: cSuccess,
								failed: cFailed
							});

						}

						function cSuccess(data) {
							// var oModel = oRef.getOwnerComponent().getModel("oListHU"); //Get Hold of the Model
							// oModel.setData(null);
							// var aData = oRef.getOwnerComponent().getModel("oListHU").getData();
							//	if (tempVar.length === 20) {
							if (data.Message === "Valid HU") {

								oRef.aData.push({
									ExternalHU: data.ExternalHU,
									binNo: data.binNo
								});

								var oModel = new sap.ui.model.json.JSONModel();

								oModel.setData({
									HUSet: oRef.aData
								});

								var oModelCpy = new sap.ui.model.json.JSONModel();
								oModelCpy.setData({
									HUSet: oRef.aData
								});

								oRef.getOwnerComponent().setModel(oModel, "oListHU");
								oRef.getOwnerComponent().setModel(oModelCpy, "oListHUCpy");
								oRef.getView().byId("id1").setValue("");
								oRef.onBeforeShow(oEvent);
							}
							//} 
							else if (tempVar === "") {

							} else {
								MessageBox.error("Invalid HU");
								oRef.getView().byId("id1").setValue("");

							}

						}

						function cFailed() {
							MessageBox.error("HU Number Scan failed");

						}

					}, 1000);
				} else {
					hFlag = true;
					return hFlag;
				}
			} else {
				if (tempVar.length >= 18) {
					setTimeout(function () {
						tempVar = tempVar.replace(/[^A-Z0-9]+/ig, "");
						tempVar = tempVar.replace(/^0+/, '');
						oRef.getView().byId("id1").setValue(tempVar);
						var aDataCpy = oRef.getView().getModel("oListHUCpy");
						if (aDataCpy != undefined) {
							// var aData = oRef.getOwnerComponent().getModel("oListHUCpy").getData();
							var extFlag = true;

							$.each(aDataCpy.oData.HUSet, function (index, item) {

								if (item.ExternalHU === tempVar) {
									extFlag = false;
									MessageBox.information("HU Number is already scanned", {
										title: "Information"
									});
									oRef.getView().byId("id1").setValue("");
								}
							});
						}

						if (extFlag) {
							// this.odataService.read("/ScannedHU?ExternalHU='" + tempVar + "'", {
							oRef.odataService.read("/ScannedHU?ExternalHU='" + tempVar + "'", {

								success: cSuccess,
								failed: cFailed
							});

						}

						function cSuccess(data) {
							// var oModel = oRef.getOwnerComponent().getModel("oListHU"); //Get Hold of the Model
							// oModel.setData(null);
							// var aData = oRef.getOwnerComponent().getModel("oListHU").getData();
							//	if (tempVar.length === 20) {
							if (data.Message === "Valid HU") {

								oRef.aData.push({
									ExternalHU: data.ExternalHU,
									binNo: data.binNo
								});

								var oModel = new sap.ui.model.json.JSONModel();

								oModel.setData({
									HUSet: oRef.aData
								});

								var oModelCpy = new sap.ui.model.json.JSONModel();
								oModelCpy.setData({
									HUSet: oRef.aData
								});

								oRef.getOwnerComponent().setModel(oModel, "oListHU");
								oRef.getOwnerComponent().setModel(oModelCpy, "oListHUCpy");
								oRef.getView().byId("id1").setValue("");
								oRef.onBeforeShow(oEvent);
							}
							//} 
							else if (tempVar === "") {

							} else {
								MessageBox.error("Invalid HU");
								oRef.getView().byId("id1").setValue("");

							}

						}

						function cFailed() {
							MessageBox.error("HU Number Scan failed");

						}

					}, 1000);
				} else {
					hFlag = true;
					return hFlag;
				}
			}

		},

		onSelectHU: function (oEvent) {
			sap.ui.getCore().HUSelected = oEvent.getSource().getTitle();
			var oRef = this;
			oRef.HUdetails();
			// var oRouter = this.getOwnerComponent().getRouter();
			// oRouter.navTo("BinScan", {
			// 	HUSelect: HUSelected,
			// 	Batch: sap.ui.getCore().batchNum,
			// 	descp: sap.ui.getCore().MatDesc,
			// });

		},

		HUdetails: function () {
			var oRef = this;
			// var tempVar = oRef.getView().byId("id1").getValue();
			oRef.odataService.read("/HUQtyDetailsSet?$filter=ExternalHU eq '" + sap.ui.getCore().HUSelected + "'", {
				success: cSuccess,
				failed: cFailed
			});

			function cSuccess(data) {
				if (data.results[0].BatchNo === "NOSTOCK") {
					MessageBox.error("No Stock maintained for the HU");
				} else {
					sap.ui.getCore().batchNum = data.results[0].BatchNo;
					sap.ui.getCore().MatDesc = data.results[0].MaterialDesc;
					sap.ui.getCore().MatNum = data.results[0].Material;

					var oRouter = oRef.getOwnerComponent().getRouter();
					oRouter.navTo("BinScan", {
						HUSelect: sap.ui.getCore().HUSelected,
						Batch: sap.ui.getCore().batchNum,
						descp: sap.ui.getCore().MatDesc,
						MatNum: sap.ui.getCore().MatNum
					});
				}

			}

			function cFailed() {
				MessageBox.error("HU Number Scan failed");

			}

		},

		onSubmit: function (oEvent) {
			var oRef = this;
			var tempVar = oRef.getView().byId("id1").getValue();

			// else{
			var result = this.oList.getModel("oListHU").getData();
			var data = {};
			var flag = false;
			data.NavFGHeaderFGItems = [];
			$.each(result.HUSet, function (index, item) {
				var temp = {};
				if (item.binNo === undefined) {
					flag = true;
					return flag;
				} else {
					temp.ExternalHU = item.ExternalHU;
					temp.BinNumber = item.binNo;
					temp.Message = "";
					data.NavFGHeaderFGItems.push(temp);
				}
			});

			if (flag === false) {
				this.odataService.create("/FGPutAwayHeaderSet", data, null, function (odata, response) {

					// if(data.NavFGHeaderFGItems.BinNumber===undefined){
					// 		MessageBox.information("Please scan Bin Number");
					// }
					// else{
					MessageBox.success("HU Transferred To Warehouse Successfully", {
						title: "Success",
						Action: "OK",
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								var oRef = this;
								var aData = oRef.getView().getModel("oListHU").getData();
								oRef.aData = [];
								oRef.getView().getModel("oListHU").setData(oRef.aData);
								oRef.getView().getModel("oListHU").refresh(true);
								oRef.getView().byId("idList").destroyItems();
								this.getView().byId("id1").setValue("");
								this.saveFlag = true;
								// var sHistory = History.getInstance();
								// var sPreviousHash = sHistory.getPreviousHash();
								// if (sPreviousHash !== undefined) {
								// 	window.history.go(-1);
								// }
							}
						}.bind(oRef),
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
					// var data = oRef.getView().getModel("oListHU").getData();
					// oRef.data = [];
					// oRef.getView().getModel("oListHU").setData(oRef.data);
					// oRef.getView().getModel("oListHU").refresh(true);

				}, function (odata, response) {
					// var errorResponse = JSON.parse(odata.response.body);
					// var errorDetails = errorResponse.error.message.value;
					// var jsonParse = JSON.parse(odata.response.body);
					// var err = jsonParse.error;
					// // var parse1 = JSON.parse(err);
					// var msg = err.message.value;
					// MessageBox.error(msg);
					var errorResponse = JSON.parse(odata.response.body);
					var errorDetails = errorResponse.error.innererror.errordetails;
					// var errorString = "";
					var jsonParse = JSON.parse(odata.response.body);
					var err = jsonParse.error;
					var msg = err.message.value;
					$.each(errorDetails, function (index, item) {
						if (index != errorDetails.length - 1) {
							var code = item.code.trim();
							var i = code.indexOf('/');
							var HU = code.slice(0, i);
							msg = msg + "\n" + HU + " " + item.message + "\n";
						}

					});
					MessageBox.error(msg, {
						title: "Error",
						onClose: null,
						styleClass: "",
						initialFocus: null,
						textDirection: sap.ui.core.TextDirection.Inherit
					});
				});
			} else {
				MessageBox.information("Bin Number Missing");
			}

			// }

		},

		onDelete: function (oEvent) {

			var that = this;
			that.oModel = that.getView().getModel("oListHU");
			var data = that.getView().getModel("oListHU").getData(that.result);

			that.oList = that.byId("idList");

			var sItems = that.oList.getSelectedItems();

			if (sItems.length === 0) {
				MessageBox.information("Please Select a row to Delete");
				return;
			} else {

				for (var i = sItems.length - 1; i >= 0; i--) {
					var path = sItems[i].getBindingContext("oListHU").getPath();
					var idx = parseInt(path.substring(path.lastIndexOf('/') + 1));
					data.HUSet.splice(idx, 1);
				}
				that.getView().getModel("oListHU").refresh(true);
			}
			that.oList.removeSelections();
		},

		onPressBack: function () {
			var oRef = this;
			if (this.saveFlag === false) {
				var aData = oRef.getView().getModel("oListHU").getData();
				var aDataCpy = oRef.getView().getModel("oListHUCpy").getData();
				oRef.aData = [];
				oRef.aDataCpy = [];
				oRef.getView().getModel("oListHU").setData(oRef.aData);
				oRef.getView().getModel("oListHUCpy").setData(oRef.aDataCpy);
				oRef.getView().getModel("oListHU").refresh(true);
				oRef.getView().getModel("oListHUCpy").refresh(true);
				oRef.getView().byId("idList").destroyItems();
				this.getView().byId("id1").setValue("");
			}
			var sRouter = sap.ui.core.UIComponent.getRouterFor(this);
			sRouter.navTo("Home", true);
		},

	});

});