var _close = mywindow.findChild("_close");
var _new = mywindow.findChild("_new");
var _edit = mywindow.findChild("_edit");
var _view = mywindow.findChild("_view");
var _results = mywindow.findChild("_results");
var _query = mywindow.findChild("_query");
var _search = mywindow.findChild("_search");
var _type = mywindow.findChild("_type");
var _print = mywindow.findChild("_print");
var _showRetired = mywindow.findChild("_showRetired");

_close.clicked.connect(closeForm);
_new.clicked.connect(assetNew);
_view.clicked.connect(assetView);
_edit.clicked.connect(assetEdit);
_query.clicked.connect(fillList);
_print.clicked.connect(printReport);
_results.clicked.connect(checkEditprivs);

// Check priviledges
_new.enabled = privileges.check("MaintainFixedAsset");

_type.populate("SELECT id, assettype_code FROM asset.asset_type ORDER BY 2");

_showRetired.clicked.connect(fillList);
//mainwindow.tick.connect(fillList);
mainwindow["salesOrdersUpdated(int, bool)"].connect(fillList);

with (_results)
{
 // addColumn("ID",  10, 1, false, "id");
 // addColumn("altId",  10, 1, false, "altId");
  addColumn("Code",  -1, 1, true, "asset_code");
  addColumn("Description / Sub-Asset",  -1, 1, true, "asset_name");
  addColumn("Asset Type",  -1, 1, true, "asset_type");
}

fillList();
_results["populateMenu(QMenu *,XTreeWidgetItem *, int)"].connect(populateMenu);

// context menu
function populateMenu(pMenu, pItem, pCol)
{
var mCode
if(pMenu == null)
  pMenu = _results.findChild("_menu");

if(pMenu != null)
 {
  var _addsep = false;
  var currentItem = _results.currentItem();
  if(currentItem != null)
  {
   mCode = pMenu.addAction(qsTr("Edit..."));
   mCode.enabled = privileges.check("MaintainFixedAsset");
   mCode.triggered.connect(assetEdit);

   mCode = pMenu.addAction(qsTr("View..."));
   mCode.enabled = privileges.check("ViewFixedAsset") || privileges.check("MaintainFixedAsset");
   mCode.triggered.connect(assetView);

   mCode = pMenu.addAction(qsTr("Retire..."));
   mCode.enabled = privileges.check("MaintainFixedAsset");
   mCode.triggered.connect(retireAsset);

   mCode = pMenu.addAction(qsTr("Print Asset Report"));
   mCode.enabled = privileges.check("ViewFixedAsset") || privileges.check("MaintainFixedAsset");
   mCode.triggered.connect(printAsset);
  }
 }
}
 

function fillList()
{
 try
 {
  if (_search.text == "" && _type.id() == -1)
  {
//  Display in hierarchy format
    data = toolbox.executeDbQuery("asset", "fetchFixedAssetsHierarchy", getParams());
  } else {
//  Display in list format
    data = toolbox.executeDbQuery("asset", "fetchFixedAssets", getParams());
  }
  _results.populate(data,true);
 }
 catch(e)
 {
   print(e);
   QMessageBox.critical(mywindow, "Database Error", "Critical error:" + e);
 }
}

function closeForm()
{
 mywindow.close();
}

function assetNew()
{
 assetOpen(0,0, false);
}

function assetEdit()
{ 

 if (_results.id() == -1)
 {
  QMessageBox.warning(mywindow, "Selection", "You must select a line first");
  return 0;
 }
 assetOpen(1,_results.altId(), false);
}

function assetView()
{ 
 if (_results.id() == -1)
 {
  QMessageBox.warning(mywindow, "Selection", "You must select a line first");
  return 0;
 }
 assetOpen(2,_results.altId(), false);
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
     wparams.filter = "id = " + number;
   var tmp = toolbox.lastWindow().set(wparams);
  }
  catch(e)
  {
   print(e);
   QMessageBox.critical(mywindow, "Database Error", "Critical error:" + e);
  }
}

function retireAsset()
{
 if (_results.id() == -1)
 {
  QMessageBox.warning(mywindow, "Selection", "You must select a line first");
  return 0;
 }
 assetOpen(1,_results.altId(), true);

}

function checkEditprivs()
{
  _edit.enabled = privileges.check("MaintainFixedAsset");
  _view.enabled = (privileges.check("MaintainFixedAsset") || privileges.check("ViewFixedAsset"));
}

function printReport()
{
   toolbox.printReport("FixedAssetList", getParams());
}

function printAsset()
{
 var aparams = new Object();
 aparams.asset = _results.id();
 toolbox.printReport("FixedAssetDetail", aparams);
}

function getParams()
{
 params = new Object();
 if (_showRetired.checked) 
   params.show_retired = 9999;
 else
   params.show_retired = 5;

 if (_search.text != null)
   params.search = "%" + _search.text + "%";

 if(_type.id() != -1)
  params.type = _type.id();

 return params;
}