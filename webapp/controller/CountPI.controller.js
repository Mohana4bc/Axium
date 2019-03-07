sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.axium.Axium.controller.CountPI", {
		onInit: function () {
			var oRef = this;
			this.aData = [];
			oRef.odataService = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZWM_GW_RFSCREENS_SRV/", true);

			this.getView().addEventDelegate({
				onBeforeShow: jQuery.proxy(function (evt) {
					this.onBeforeShow(evt);
				}, this)
			});
			// sap.ui.getCore().saveFlag = false;
			// oRef.getView().byId("box").setValue("0");
			// oRef.getView().byId("pallet").setValue("0");

		},
		onBeforeShow: function () {
			var oRef = this;
			if (sap.ui.getCore().indicator === "X") {
				var count = this.getView().byId("count");
				count.setVisible(false);
			} else {
				var count = this.getView().byId("count");
				var box = this.getView().byId("box");
				var pallet = this.getView().byId("pallet");
				count.setEnabled(true);
				box.setVisible(false);
				pallet.setVisible(false);

			}
			oRef.onInit();

		},

		onPressBack: function () {
			var that = this;
			var sRouter = sap.ui.core.UIComponent.getRouterFor(that);
			sRouter.navTo("MaterialDetPI", true);
		},
		onSave: function () {
			var that = this;
			var model = that.getView().getModel("PhysicalInventory").getData();
			var perPalQty = model.matDet[sap.ui.selectedIndex].PerPalQty;
			var perBoxQty = model.matDet[sap.ui.selectedIndex].PerBoxQty;
			sap.ui.getCore().mat = that.getView().byId("matNum").getValue();
			sap.ui.getCore().matdesc = that.getView().byId("matDesc").getValue();
			sap.ui.getCore().batch = that.getView().byId("batch").getValue();
			sap.ui.getCore().uom = that.getView().byId("uom").getValue();
			sap.ui.getCore().box = that.getView().byId("box").getValue();
			sap.ui.getCore().pallet = that.getView().byId("pallet").getValue();
			var Bin = that.getView().byId("idBin").getValue();
			var materialNumber = that.getView().byId("matNum").getValue();
			var uom = that.getView().byId("uom").getValue();
			var calculatedPallet = parseFloat(sap.ui.getCore().pallet) * parseFloat(perPalQty);
			var calculatedBox = parseFloat(sap.ui.getCore().box) * parseFloat(perBoxQty);

			if (sap.ui.getCore().box !== "" && sap.ui.getCore().pallet !== "") {
				sap.ui.getCore().totalQuantity = sap.ui.getCore().count + calculatedPallet + calculatedBox;
				sap.ui.getCore().totalQuantity = sap.ui.getCore().totalQuantity;
				model.matDet[sap.ui.selectedIndex].Pallets = calculatedPallet;
				model.matDet[sap.ui.selectedIndex].Boxes = calculatedBox;
				model.matDet[sap.ui.selectedIndex].Count = sap.ui.getCore().totalQuantity;
				// that.getView().getModel("PhysicalInventory").refresh(true);
			}

			if (sap.ui.getCore().box === "" && sap.ui.getCore().pallet !== "") {
				sap.ui.getCore().totalQuantity = sap.ui.getCore().count + calculatedPallet;
				sap.ui.getCore().totalQuantity = sap.ui.getCore().totalQuantity;
				model.matDet[sap.ui.selectedIndex].Pallets = calculatedPallet;
				model.matDet[sap.ui.selectedIndex].Boxes = "0.000";
				model.matDet[sap.ui.selectedIndex].Count = sap.ui.getCore().totalQuantity;
				// that.getView().getModel("PhysicalInventory").refresh(true);
			}

			if (sap.ui.getCore().box !== "" && sap.ui.getCore().pallet === "") {
				sap.ui.getCore().totalQuantity = sap.ui.getCore().count + calculatedBox;
				sap.ui.getCore().totalQuantity = sap.ui.getCore().totalQuantity;
				model.matDet[sap.ui.selectedIndex].Pallets = "0.000";
				model.matDet[sap.ui.selectedIndex].Boxes = calculatedBox;
				model.matDet[sap.ui.selectedIndex].Count = sap.ui.getCore().totalQuantity;
				// that.getView().getModel("PhysicalInventory").refresh(true);
			}
			// that.getView().getModel("PhysicalInventory").refresh(true);
			var data = {};
			data.CountItemsSet = [];
			data.BinNumber = Bin;
			var temp = {};
			temp.BinNumber = Bin;
			temp.Material = materialNumber;
			temp.Batch = sap.ui.getCore().batch;
			temp.UOM = uom;
			temp.Status = "";
			temp.Boxes = calculatedBox;
			temp.Plant = sap.ui.getCore().plnt;
			temp.StrLoc = sap.ui.getCore().stgloc;
			temp.Quantity = sap.ui.getCore().totalQuantity.toFixed(3);
			data.CountItemsSet.push(temp);
			this.odataService.create("/CountHeaderSet", data, null, function (odata, response) {
				console.log(response);
				that.getView().getModel("PhysicalInventory").refresh(true);
				var sRouter = sap.ui.core.UIComponent.getRouterFor(that);
				sRouter.navTo("MaterialDetPI", true);
			}, function (odata, response) {
				console.log(response);
			});
			that.getView().byId("box").setValue("");
			that.getView().byId("pallet").setValue("");

		}

	});

});