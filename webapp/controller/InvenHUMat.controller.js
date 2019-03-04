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
			if (sap.ui.getCore().InvenStrLocFlag === true) {
				oMatNum.setVisible(false);
				oHU.setVisible(true);
			} else {
				if (sap.ui.getCore().InvenStrLocFlag === false) {
					oHU.setVisible(false);
					oMatNum.setVisible(true);
				}
			}
		},
		onHandleHUNumber: function () {
			var oRef = this;
			var huNumber = oRef.getView().byId("idHUNum").getValue();
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
					oRef.aData.push({
						ExternalHU: data.ExternalHU,
					});
					var oModel = new sap.ui.model.json.JSONModel();

					oModel.setData({
						HUBinSet: oRef.aData
					});
					oRef.getOwnerComponent().setModel(oModel, "InvenHUBin");
					oRef.getView().byId("idHUNum").setValue("");

				} else if (huNumber === "") {

				} else {
					MessageBox.error("Invalid HU");
					oRef.getView().byId("idHUNum").setValue("");
				}

			}

			function cFailed() {
				MessageBox.error("HU Number Scan Failed");
			}

		},
		onPressBack: function () {
			var oRef = this;
			var oHU = oRef.getView().byId("idHUNum");
			var oMatNum = oRef.getView().byId("idMatNum");
			var sRouter = sap.ui.core.UIComponent.getRouterFor(this);
			sRouter.navTo("InventoryPlntStrloc", true);
			oHU.setVisible(true);
			oMatNum.setVisible(true);
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