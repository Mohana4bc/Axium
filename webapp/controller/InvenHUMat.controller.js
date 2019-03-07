sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageBox"
], function (Controller, History, MessageBox) {
	"use strict";

	return Controller.extend("com.axium.Axium.controller.InvenHUMat", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.axium.Axium.view.InvenHUMat
		 */
		onInit: function () {
			this.odataService = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZWM_GW_RFSCREENS_SRV/", true);
			this.aData = [];
			this.oList = this.getView().byId("idList");
			this.getView().addEventDelegate({
				onBeforeShow: jQuery.proxy(function (evt) {
					this.onBeforeShow(evt);
				}, this)
			});

		},
		onBeforeShow: function () {
			var oRef = this;
			var aData = oRef.getView().getModel("InvenHUBin").getData();
			oRef.aData = [];
			oRef.getView().getModel("InvenHUBin").setData(oRef.aData);
			var oHU = oRef.getView().byId("idHUNum");
			var oMatNum = oRef.getView().byId("idMatNum");
			var oBatchNum = oRef.getView().byId("idBatchNum");
			var oQty = oRef.getView().byId("idQty");
			var oAddButton = oRef.getView().byId("idAdd");

			if (sap.ui.getCore().InvenStrLocFlag === true) {
				oMatNum.setVisible(false);
				oBatchNum.setVisible(false);
				oQty.setVisible(false);
				oAddButton.setVisible(false);
				oHU.setVisible(true);
			} else {
				if (sap.ui.getCore().InvenStrLocFlag === false) {
					// oRef.odataService.read("/MaterialsSet?$filter=WareHouseNumber eq '" + sap.ui.getCore().WareHouseNum + "'",
					// 	null, null, false,
					// 	function (oData, oResponse) {
					// 		if (oRef.getView().byId("idMatNum") !== undefined) {
					// 			oRef.getView().byId("idMatNum").destroyItems();
					// 		}
					// 		for (var i = 0; i < oData.results.length; i++) {
					// 			oRef.getView().byId("idMatNum").addItem(
					// 				new sap.ui.core.ListItem({
					// 					text: oData.results[i].MaterialDesc,
					// 					//key: response.results[i].Material,
					// 					additionalText: oData.results[i].Material
					// 				}));
					// 		}
					// 	});
					oRef.odataService.read("/MaterialsSet", null, null, false, function (response) {
						if (oRef.getView().byId("idMatNum") !== undefined) {
							oRef.getView().byId("idMatNum").destroyItems();
						}
						for (var i = 0; i < response.results.length; i++) {
							oRef.getView().byId("idMatNum").addItem(
								new sap.ui.core.ListItem({
									// text: response.results[i].Material,
									// key: response.results[i].Material,
									// additionalText: response.results[i].MaterialDesc

									text: response.results[i].MaterialDesc,
									key: response.results[i].MaterialDesc,
									additionalText: response.results[i].Material

								}));
						}
					});
					oHU.setVisible(false);
					oMatNum.setVisible(true);
					oBatchNum.setVisible(true);
					oQty.setVisible(true);
					oAddButton.setVisible(true);
				}
			}
		},
		onHandleHUNumber: function () {
			var oRef = this;
			var huNumber = oRef.getView().byId("idHUNum").getValue();
			var aData = oRef.getView().getModel("InvenHUBin");
			var hFlag = false;
			// var huNumber = oRef.getView().byId("id1").getValue();
			// var materialNumber = oRef.getView().byId("id2").getValue();
			var bool = huNumber.startsWith("(");
			if (bool) {
				huNumber = huNumber.replace(/[^A-Z0-9]+/ig, "");
			} else {
				huNumber = huNumber;
			}
			var regExp = /^0[0-9].*$/;
			var test = regExp.test(huNumber);
			if (test || bool) {
				if (huNumber.length >= 20) {
					setTimeout(function () {
						var aData = oRef.getOwnerComponent().getModel("InvenHUBin");
						if (aData !== undefined) {
							var aData = oRef.getOwnerComponent().getModel("InvenHUBin").getData();
							var extFlag = true;
							$.each(aData.HUBinSet, function (index, item) {

								if (item.ExternalHU === huNumber) {
									extFlag = false;
									oRef.getView().byId("idHUNum").setValue("");
									sap.m.MessageBox.alert("HU Number is already scanned", {
										title: "Information"
									});
								}
							});
						}
						if (extFlag) {

							oRef.odataService.read("/ScannedHU?ExternalHU='" + huNumber + "'", {
								success: cSuccess,
								failed: cFailed
							});

						}

						function cSuccess(data) {

							if (data.Message === "Valid HU") {
								oRef.getHUDetails();
								// oRef.aData.push({
								// 	ExternalHU: data.ExternalHU,
								// });
								// var oModel = new sap.ui.model.json.JSONModel();

								// oModel.setData({
								// 	HUBinSet: oRef.aData
								// });
								// oRef.getOwnerComponent().setModel(oModel, "InvenHUBin");
								// oRef.getView().byId("idHUNum").setValue("");

							} else if (huNumber === "") {

							} else {
								MessageBox.error("Invalid HU");
								oRef.getView().byId("idHUNum").setValue("");
							}

						}

						function cFailed() {
							MessageBox.error("HU Number Scan Failed");
						}
					}, 1000);
				} else {
					hFlag = true;
					return hFlag;
				}
			} else {
				if (huNumber.length >= 18) {
					setTimeout(function () {
						var aData = oRef.getView().getModel("InvenHUBin");
						if (aData !== undefined) {
							var aData = oRef.getOwnerComponent().getModel("InvenHUBin").getData();
							var extFlag = true;
							$.each(aData.HUBinSet, function (index, item) {

								if (item.ExternalHU === huNumber) {
									extFlag = false;
									oRef.getView().byId("idHUNum").setValue("");
									sap.m.MessageBox.alert("HU Number is already scanned", {
										title: "Information"
									});
								}
							});
						}
						if (extFlag) {

							oRef.odataService.read("/ScannedHU?ExternalHU='" + huNumber + "'", {
								success: cSuccess,
								failed: cFailed
							});

						}

						function cSuccess(data) {

							if (data.Message === "Valid HU") {
								oRef.getHUDetails();
								// oRef.aData.push({
								// 	ExternalHU: data.ExternalHU,
								// });
								// var oModel = new sap.ui.model.json.JSONModel();

								// oModel.setData({
								// 	HUBinSet: oRef.aData
								// });
								// oRef.getOwnerComponent().setModel(oModel, "InvenHUBin");
								// oRef.getView().byId("idHUNum").setValue("");

							} else if (huNumber === "") {

							} else {
								MessageBox.error("Invalid HU");
								oRef.getView().byId("idHUNum").setValue("");
							}

						}

						function cFailed() {
							MessageBox.error("HU Number Scan Failed");
						}
					}, 1000);
				} else {
					hFlag = true;
					return hFlag;
				}
			}

		},
		getHUDetails: function () {
			var oRef = this;
			var huNumber = oRef.getView().byId("idHUNum").getValue();
			var tempMat = "";
			this.odataService.read("/HUQtyDetailsSet?$filter=ExternalHU eq '" + huNumber + "' and Material eq '" + tempMat + "'", {
				// this.odataService.read("/HUQtyDetailsSet?$filter=ExternalHU eq '00000000002000057331' and Material eq '000000003000000724' and ScannedQnty eq '0' and RequirementQnty eq '41600.000' and BinNumber eq 'U_ZONE'", {
				success: cSuccess,
				failed: cFailed
			});

			function cSuccess(data) {
				var huBatch = data.results[0].BatchNo;
				var hu = data.results[0].ExternalHU;
				var ScannedQty = data.results[0].ScannedQnty;
				var Material = data.results[0].Material;
				var MatDesc = data.results[0].MaterialDesc;
				// oRef.getView().byId("idBatchNum").setValue
				// idQty
				oRef.aData.push({
					ExternalHU: hu,
					Material: Material,
					MatDesc: MatDesc,
					StorageLocation: sap.ui.getCore().StorageLocation,
					Plant: sap.ui.getCore().PlantNumber,
					BatchNumber: huBatch,
					Quantity: ScannedQty
				});
				var oModel = new sap.ui.model.json.JSONModel();

				oModel.setData({
					HUBinSet: oRef.aData
				});
				oRef.getOwnerComponent().setModel(oModel, "InvenHUBin");
				oRef.getView().byId("idHUNum").setValue("");

			}

			function cFailed() {

			}

		},
		selectMaterial: function (oEvent) {
			sap.ui.getCore().globalMat = this.getView().byId("idMatNum").getSelectedItem().getAdditionalText();
		},
		onAddMaterial: function () {
			var oRef = this;
			var oMat = sap.ui.getCore().globalMat;
			var oBatchNo = oRef.getView().byId("idBatchNum").getValue();
			var oQty = oRef.getView().byId("idQty").getValue();
			var oMat = oRef.getView().byId("idMatNum").getValue();
			oRef.aData.push({
				ExternalHU: "",
				StorageLocation: sap.ui.getCore().StorageLocation,
				Plant: sap.ui.getCore().PlantNumber,
				BatchNumber: oBatchNo,
				Quantity: oQty,
				Material: sap.ui.getCore().globalMat,
				MatDesc: oMat
			});
			var oModel = new sap.ui.model.json.JSONModel();

			oModel.setData({
				HUBinSet: oRef.aData
			});
			oRef.getOwnerComponent().setModel(oModel, "InvenHUBin");
			oRef.getView().byId("idMatNum").setValue("");
			oRef.getView().byId("idBatchNum").setValue("");
			oRef.getView().byId("idQty").setValue("");

		},
		onPressBack: function () {
			var oRef = this;
			var oHU = oRef.getView().byId("idHUNum");
			var oMatNum = oRef.getView().byId("idMatNum");
			var sRouter = sap.ui.core.UIComponent.getRouterFor(this);
			sRouter.navTo("InventoryPlntStrloc", true);
			oHU.setVisible(true);
			oMatNum.setVisible(true);
		},
		onInvenSubmit: function () {
			var data = {};
			data.NavReconHeadItems = [];
			var result = this.oList.getModel("InvenHUBin").getData();
			var oRef = this;
			data.Plant = sap.ui.getCore().PlantNumber;
			data.StorageLocation = sap.ui.getCore().StorageLocation;
			$.each(result.HUBinSet, function (index, item) {
				var temp = {};
				temp.Plant = sap.ui.getCore().PlantNumber;
				temp.StorageLoc = sap.ui.getCore().StorageLocation;
				temp.Batch = item.BatchNumber;
				temp.Scannedqty = item.Quantity;
				temp.Material = item.Material;
				temp.Handlingunit = item.ExternalHU;
				data.NavReconHeadItems.push(temp);
			});
			this.odataService.create("/ReconAppHeaderSet", data, null, function (odata, response) {
				// MessageBox.success("Data Saved");
				MessageBox.success("Data Successfully Saved", {
					title: "Success",
					Action: "OK",
					onClose: function (oAction) {
						if (oAction === sap.m.MessageBox.Action.OK) {
							// oRef.getView().byId("idList").destroyItems();
							var sHistory = History.getInstance();
							var sPreviousHash = sHistory.getPreviousHash();
							if (sPreviousHash !== undefined) {
								window.history.go(-1);
							}
						}
					}.bind(oRef),
					styleClass: "",
					initialFocus: null,
					textDirection: sap.ui.core.TextDirection.Inherit
				});
			}, function () {
				MessageBox.error("Error Saving Data");
			});
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.axium.Axium.view.InvenHUMat
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.axium.Axium.view.InvenHUMat
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.axium.Axium.view.InvenHUMat
		 */
		//	onExit: function() {
		//
		//	}

	});

});