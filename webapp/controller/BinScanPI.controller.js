sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox",
	"sap/m/Button",
	"sap/m/Dialog",
	"sap/m/MessageToast",
	"sap/m/Text"
], function (Controller, History, MessageBox, Button, Dialog, MessageToast, Text) {
	"use strict";

	return Controller.extend("com.axium.Axium.controller.BinScanPI", {
		onInit: function () {
			var oRef = this;
			var data = [];
			oRef.odataService = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZWM_GW_RFSCREENS_SRV/", true);
			this.aData = [];
			oRef.odataService.read("/CountItemsSet", null, null, false, function (response) {
				for (var i = 0; i < response.results.length; i++) {
					data.push({
						BinNumber: response.results[i].BinNumber,
						Status: response.results[i].Status

					});
				}
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData({
					binDet: data
				});
				oRef.getOwnerComponent().setModel(oModel, "PlantStorage");

			});
			// this.getView().addEventDelegate({
			// 	onBeforeShow: jQuery.proxy(function (evt) {
			// 		this.onBeforeShow(evt);
			// 	}, this)
			// });
			sap.ui.getCore().bin = "";
		},
		// onBeforeShow: function () {
		// 	var oRef = this;
		// 	// var aData = oRef.getView().getModel("oListHU");
		// 	// var bin = sap.ui.getCore().bin
		// 	this.aData.push({
		// 		binNo: sap.ui.getCore().bin
		// 	});

		// 	var oModel = new sap.ui.model.json.JSONModel();

		// 	oModel.setData({
		// 		BinSet: this.aData
		// 	});
		// 	oRef.getOwnerComponent().setModel(oModel, "oListHU");
		// },

		onBinScan: function () {
			var oRef = this;
			var bin = oRef.getView().byId("bin").getValue();
			sap.ui.getCore().bin = bin;
			oRef.odataService.read("/ScannedBinNumber?BinNumber='" + bin + "'", null,
				null, false,
				function (data) {
					if (bin === "") {
						MessageBox.error("Please Scan Bin");
					} else if (data.Message === "valid Bin") {
						var data = [];
						// oRef.odataService = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZWM_GW_RFSCREENS_SRV/", true);
						oRef.aData = [];
						oRef.odataService.read("/BinMaterialSet?$filter=BinNumber eq '" + sap.ui.getCore().bin + "'and StrLoc eq'" + sap.ui.getCore().stgloc +
							"'and Plant eq'" + sap.ui.getCore().plnt + "'", null, null, false,
							function (response) {

								for (var i = 0; i < response.results.length; i++) {
									data.push({
										Material: response.results[i].Material,
										MaterialDesc: response.results[i].MaterialDesc,
										BatchNo: response.results[i].BatchNo,
										Count: response.results[i].Count,
										UOM: response.results[i].UOM,
										Boxes: response.results[i].Boxes,
										PerBoxQty: response.results[i].PerBoxQty,
										PerPalQty: response.results[i].PerPalQty,
										Indicator: response.results[i].Indicator,
										Pallets: response.results[i].Pallets
									});
								}

								var oModel = new sap.ui.model.json.JSONModel();
								oModel.setData({
									matDet: data
								});
								oRef.getOwnerComponent().setModel(oModel, "PhysicalInventory");

							});
						var sRouter = sap.ui.core.UIComponent.getRouterFor(oRef);
						sRouter.navTo("MaterialDetPI", true);
						sap.ui.getCore().bin = oRef.getView().byId("bin").getValue();

					} else {
						sap.m.MessageBox.alert(data.Message, {
							title: "Information",
							onClose: null,
							styleClass: "",
							initialFocus: null,
							textDirection: sap.ui.core.TextDirection.Inherit
						});

					}

				});
			oRef.getView().byId("bin").setValue("");
		},
		onBinPress: function (oEvent) {
			var bin = oEvent.getSource().getTitle();
			var oRef = this;
			var data = [];
			oRef.odataService.read("/BinMaterialSet?$filter=BinNumber eq '" + sap.ui.getCore().bin + "'and StrLoc eq'" + sap.ui.getCore().stgloc +
				"'and Plant eq'" + sap.ui.getCore().plnt + "'", null, null, false,
				function (response) {

					for (var i = 0; i < response.results.length; i++) {
						data.push({
							Material: response.results[i].Material,
							MaterialDesc: response.results[i].MaterialDesc,
							BatchNo: response.results[i].BatchNo,
							Count: response.results[i].Count,
							UOM: response.results[i].UOM,
							Boxes: response.results[i].Boxes,
							PerBoxQty: response.results[i].PerBoxQty,
							PerPalQty: response.results[i].PerPalQty,
							Indicator: response.results[i].Indicator,
							Pallets: response.results[i].Pallets
						});
					}

					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData({
						matDet: data
					});
					oRef.getOwnerComponent().setModel(oModel, "PhysicalInventory");

				});
			sap.ui.getCore().bin = bin;
			var sRouter = sap.ui.core.UIComponent.getRouterFor(oRef);
			sRouter.navTo("MaterialDetPI", true);
		},

		onPressBack: function () {
			var that = this;
			var aData = that.getView().getModel("oListHU").getData();
			that.aData = [];
			that.getView().getModel("oListHU").setData(that.aData);
			that.getView().getModel("oListHU").refresh(true);
			var sRouter = sap.ui.core.UIComponent.getRouterFor(that);
			sRouter.navTo("PlantStorageLoc", true);

		},
		onSubmit: function () {
			var data = {};
			data.NavInvHeadInvItem = [];
			data.Plant = sap.ui.getCore().plnt;
			data.StorageLoc = sap.ui.getCore().stgloc;
			var myModel = this.getView().getModel("oListHU").getData();
			$.each(myModel.BinSet, function (index, item) {
				var temp = {};
				temp.BinNumber = item.bin;
				data.NavInvHeadInvItem.push(temp);
			});
			this.odataService.create("/InventoryHeaderSet", data, null, function (odata, response) {
					var msg;
					var bin;
					var msg1;
					$.each(response.data.NavInvHeadInvItem.results, function (index, item) {
						// if (index != response.data.NavInvHeadInvItem.results.length - 1) {
							msg = response.data.NavInvHeadInvItem.results[item].Matnr;
							bin = response.data.NavInvHeadInvItem.results[item].BinNumber;
							msg1 = "Physical Inventory" + msg + " for Bin number " + bin;

						// }
					});
					MessageBox.success(msg1);
				},
				function (odata, response) {
					MessageBox.error("Data not saved");
				}
			);
		}

	});

});