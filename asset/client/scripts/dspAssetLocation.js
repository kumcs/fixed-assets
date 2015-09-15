include("asset");
asset.location = new Object;

mywindow.setWindowTitle(qsTr("Fixed Assets by Location"));
mywindow.setListLabel(qsTr("Asset Locations"));
mywindow.setMetaSQLOptions('asset','fetchFixedAssetsLocation');
mywindow.setQueryOnStartEnabled(false);
mywindow.setSearchVisible(false);

// Set the Report
mywindow.setReportName("FixedAssetByLocation");

// Set up the List and columns
var _list = mywindow.list();

with (_list) {
  addColumn("Code",  -1, 1, true, "asset_code");
  addColumn("Description",  -1, 1, true, "asset_name");
  addColumn("Asset Type",  -1, 1, true, "asset_type");
  addColumn("Account",  -1, 1, true, "asset_crmacct");
  addColumn("Location",  -1, 1, true, "asset_location");
  addColumn("Address 1",  -1, 1, true, "asset_addr1");
  addColumn("City",  -1, 1, true, "asset_city");
}

// Parameter Filter Widget
mywindow.setParameterWidgetVisible(true);

var typeSql = "SELECT id, assettype_code FROM asset.asset_type ORDER BY assettype_code";
var locationSql = "SELECT location_id, formatLocationName(location_id) AS locationname FROM location";

mywindow.parameterWidget().append(qsTr("Asset"), "search", ParameterWidget.Text); 
mywindow.parameterWidget().appendComboBox(qsTr("Asset Type"), "type", typeSql,null,false,null); 
mywindow.parameterWidget().append(qsTr("Account"), "crmacct", ParameterWidget.Account); 
mywindow.parameterWidget().appendComboBox(qsTr("Location"), "asset_location", locationSql,null,false,null); 
mywindow.parameterWidget().append(qsTr("Address"), "address", ParameterWidget.Text); 

function populateMenu(pMenu, pItem, pCol) {
  var mCode

  if(pMenu != null) {
    var _addsep = false;
    var currentItem = _list.currentItem();
    if(currentItem != null)  {
      mCode = pMenu.addAction(qsTr("New..."));
      mCode.enabled = privileges.check("MaintainFixedAsset");
      mCode.triggered.connect(asset.location.assetNew);

      mCode = pMenu.addAction(qsTr("Edit..."));
      mCode.enabled = privileges.check("MaintainFixedAsset");
      mCode.triggered.connect(asset.location.assetEdit);

      mCode = pMenu.addAction(qsTr("View..."));
      mCode.enabled = privileges.check("ViewFixedAsset") || privileges.check("MaintainFixedAsset");
      mCode.triggered.connect(asset.location.assetView);

      mCode = pMenu.addAction(qsTr("Retire..."));
      mCode.enabled = privileges.check("MaintainFixedAsset");
      mCode.triggered.connect(asset.location.retireAsset);

      mCode = pMenu.addAction(qsTr("Print Asset Report"));
      mCode.enabled = privileges.check("ViewFixedAsset") || privileges.check("MaintainFixedAsset");
      mCode.triggered.connect(asset.location.printAsset);
    }
  }
}

asset.location.assetNew = function() {
  asset.location.assetOpen(0,0, false);
}

asset.location.assetEdit = function() { 
  if (_list.id() == -1)  {
    QMessageBox.warning(mywindow, "Selection", "You must select a line first");
    return 0;
  }
  asset.location.assetOpen(1,_list.id(), false);
}

asset.location.assetView = function() { 
  if (_list.id() == -1)  {
    QMessageBox.warning(mywindow, qsTr("Selection"), qsTr("You must select an Asset first"));
    return 0;
  }
  asset.location.assetOpen(2,_list.id(), false);
}

asset.location.assetOpen = function (mode, number, retire) 
{
  try
  {
    var childwnd = toolbox.openWindow("fixedAsset",mywindow, 0, 1);
    var wparams = new Object;
    wparams.mode = mode;
    wparams.retire = retire;
    if (mode)
      wparams.assetid = number;
    var tmp = toolbox.lastWindow().set(wparams);
  }
  catch(e)
  {
    print(e);
    QMessageBox.critical(mywindow, "Database Error", "Critical error:" + e);
  }
}

asset.location.retireAsset = function () {
  if (_list.id() == -1)  {
    QMessageBox.warning(mywindow, qsTr("Selection"), qsTr("You must select an Asset first"));
    return 0;
  }
  asset.location.assetOpen(1,_list.id(), true);
}

asset.location.printAsset = function () {
  var aparams = new Object();
  aparams.asset = _results.id();
  toolbox.printReport("FixedAssetDetail", aparams, true);
}

_list["itemSelected(int)"].connect(asset.location.assetEdit);
_list["populateMenu(QMenu *,XTreeWidgetItem *, int)"].connect(populateMenu);
mainwindow["salesOrdersUpdated(int, bool)"].connect(mywindow.sFillList);