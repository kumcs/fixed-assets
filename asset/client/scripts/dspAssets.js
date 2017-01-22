include("asset");

mywindow.setWindowTitle(qsTr("Fixed Assets"));
mywindow.setListLabel(qsTr("Fixed Assets"));

mywindow.setMetaSQLOptions('asset','fetchFixedAssetsHierarchy');
mywindow.setSearchVisible(true); 
mywindow.setQueryOnStartEnabled(true);
mywindow.setParameterWidgetVisible(true);
mywindow.setReportName("FixedAssetList");
mywindow.setNewVisible(true);
mywindow.setUseAltId(true);
 
// Display Parameters
var _sql = "SELECT asset_type.id, assettype_code||' - '||assettype_name FROM asset.asset_type";
mywindow.parameterWidget().appendComboBox(qsTr("Asset Type"), "type", _sql); 
mywindow.parameterWidget().append(qsTr("Show Retired"), "retired", ParameterWidget.Exists);

// Add in the columns
var _list = mywindow.list();

with (_list)
{
  addColumn("Code",  -1, 1, true, "asset_code");
  addColumn("Description / Sub-Asset",  -1, 1, true, "asset_name");
  addColumn("Asset Type",  -1, 1, true, "asset_type");
  addColumn("Asset Status",  -1, 1, true, "assetstatus_code");
}

mywindow.setupCharacteristics("FADOC");

var _newAction = mywindow.newAction();
_newAction.triggered.connect(sNew);
var _queryAction = mywindow.queryAction();
toolbox.coreDisconnect(_queryAction, "triggered()", mywindow, "sFillList()");
_queryAction.triggered.connect(sFillList);

_list["itemSelected(int)"].connect(assetEdit);
_list["populateMenu(QMenu *,XTreeWidgetItem *, int)"].connect(populateMenu);
mainwindow["salesOrdersUpdated(int, bool)"].connect(sFillList);

// context menu
function populateMenu(pMenu, pItem, pCol)
{
var mCode
if(pMenu == null)
  pMenu = _list.findChild("_menu");

if(pMenu != null)
{
  var _addsep = false;
  var currentItem = _list.currentItem();
  if(currentItem != null)
  {
   if (pItem.rawValue("assetstatus_code") !== "Retired")
   {
     mCode = pMenu.addAction(qsTr("Edit..."));
     mCode.enabled = privileges.check("MaintainFixedAsset");
     mCode.triggered.connect(assetEdit);
   }

   mCode = pMenu.addAction(qsTr("View..."));
   mCode.enabled = privileges.check("ViewFixedAsset") || privileges.check("MaintainFixedAsset");
   mCode.triggered.connect(assetView);

   if (pItem.rawValue("assetstatus_code") !== "Retired")
   {
     mCode = pMenu.addAction(qsTr("Retire..."));
     mCode.enabled = privileges.check("MaintainFixedAsset");
     mCode.triggered.connect(retireAsset);
   }
   if (pItem.rawValue("assetstatus_code") == "Retired")
   {
     mCode = pMenu.addAction(qsTr("Delete..."));
     mCode.enabled = privileges.check("MaintainFixedAsset");
     mCode.triggered.connect(deleteAsset);
   }

   mCode = pMenu.addAction(qsTr("Asset Report"));
   mCode.enabled = privileges.check("ViewFixedAsset") || privileges.check("MaintainFixedAsset");
   mCode.triggered.connect(printAsset);
  }
 }
}

function sFillList()
{
  var _retired = mywindow.parameterWidget().parameters().retired;
  var _paramCount = Object.keys(mywindow.parameterWidget().parameters()).length;
  var _showHierarchy = (_paramCount == 0 || (_paramCount == 1 && _retired == 1));
  if (mywindow.searchText() == "" && _showHierarchy)
  {
//  Display in hierarchy format
    data = toolbox.executeDbQuery("asset", "fetchFixedAssetsHierarchy", mywindow.getParams());
  } else {
//  Display in list format
    data = toolbox.executeDbQuery("asset", "fetchFixedAssets", mywindow.getParams());
  }
  if (asset.errorCheck(data));
    _list.populate(data, true);
}

function sNew()
{
  assetOpen(0,0, false);
}

function assetEdit()
{ 
  if (_list.id() == -1)
  {
    QMessageBox.warning(mywindow, "Selection", "You must select a line first");
    return 0;
  }
  if (_list.rawValue("assetstatus_code") == "Retired") 
    assetOpen(2,_list.altId(), false);
  else
    assetOpen(1,_list.altId(), false);
}

function assetView()
{ 
  if (_list.id() == -1)
  {
    QMessageBox.warning(mywindow, "Selection", "You must select a line first");
    return 0;
  }
  assetOpen(2,_list.altId(), false);
}

function assetOpen(mode, number, retire)
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
    QMessageBox.critical(mywindow, mywindow.windowTitle, qsTr("Exception: ") +e);
  }
}

function retireAsset()
{
  if (_list.id() == -1)
  {
    QMessageBox.warning(mywindow, "Selection", "You must select a line first");
    return 0;
  }
  assetOpen(1,_list.altId(), true);
}

function deleteAsset()
{
  var _answer = QMessageBox.question(mywindow, qsTr("Delete Asset"), qsTr("This action will permanently delete the asset.\n Do you wish to continue?"), QMessageBox.Yes, QMessageBox.No);
  if (_answer == QMessageBox.No)
    return;

  var params = {asset: _list.id()};

  if (asset.checkDepn()) // Depreciation package installed
  {
  // Check for Depreciation transactions
    var _sql = "SELECT EXISTS(SELECT * FROM assetdepn.asset_trans WHERE "            
             + "assettrans_asset_id=<? value('asset') ?>) AS res;";
    var _chk = toolbox.executeQuery(_sql, params);
    if (_chk.first() && _chk.value("res") == true)
    {
      QMessageBox.critical(mywindow,qsTr("Transactions Exist"), qsTr("Transactions exist for this asset.  It cannot be deleted."));
      return;
    }
  }

  var _del = toolbox.executeQuery("DELETE FROM asset.asset WHERE id=<? value('asset') ?>", params);
  asset.errorCheck(_del);
  fillList();
}

function printAsset()
{
 var aparams = new Object();
 aparams.asset = _list.altId();
 toolbox.printReport("FixedAssetDetail", aparams, true);
}

function checkEditprivs()
{
  _edit.enabled = privileges.check("MaintainFixedAsset");
  _view.enabled = (privileges.check("MaintainFixedAsset") || privileges.check("ViewFixedAsset"));
}
