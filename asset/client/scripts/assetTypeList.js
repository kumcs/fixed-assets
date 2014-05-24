var _close = mywindow.findChild("_close");
var _new = mywindow.findChild("_new");
var _edit = mywindow.findChild("_edit");
var _results = mywindow.findChild("_results");
var _query = mywindow.findChild("_query");
var _search = mywindow.findChild("_search");
var _delete = mywindow.findChild("_delete");

_close.clicked.connect(closeForm);
_new.clicked.connect(assetNew);
_edit.clicked.connect(assetEdit);
_query.clicked.connect(fillList);
_delete.clicked.connect(assetDelete);
_results.clicked.connect(checkAssetprivs);

mainwindow.tick.connect(fillList);
mainwindow["salesOrdersUpdated(int, bool)"].connect(fillList);

with (_results)
{
  addColumn("Code",  -1, 1, true, "assettype_code");
  addColumn("Description",  -1, 1, true, "assettype_name");
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
   mCode = pMenu.addAction(qsTr("Edit..."),privileges.check("MaintainAssetType"));
   mCode.triggered.connect(assetEdit);

   mCode = pMenu.addAction(qsTr("Delete..."),privileges.check("MaintainAssetType"));
   mCode.triggered.connect(assetDelete);

  }
 }
}
 

function fillList()
{
 try
 {
  data = toolbox.executeDbQuery("asset", "fetchAssetTypes", getParams());
  _results.populate(data);
 }
 catch(e)
 {
   print(e);
   QMessageBox.critical(mywindow, "Error", e);
 }
}

function closeForm()
{
 mywindow.close();
}

function assetNew()
{
 assetOpen(0,0);
}

function assetEdit()
{ 
 if (_results.id() == -1)
 {
  QMessageBox.warning(mywindow, "Warning", "You must select an Asset Type first");
  return 0;
 }
 assetOpen(1,_results.id());
}

function assetDelete()
{
 if (_results.id() == -1)
 {
  QMessageBox.warning(mywindow, "Warning", "You must select an Asset Type first");
  return 0;
 }
 // Check Asset Type is not used
 if(isUsed(_results.id()))
 {
  QMessageBox.warning(mywindow, "Warning", "You cannot delete an Asset Type that is in use");
  return 0;
 } else {
  var dparam = new Object();
  dparam.id = _results.id();
  var data = toolbox.executeQuery('DELETE FROM asset.asset_type WHERE id = <? value("id") ?>', dparam);
 }  
 fillList();
}

function isUsed(type)
{
  var cparam = new Object();
  cparam.type = type;
  var data = toolbox.executeQuery('SELECT count(*) as count FROM asset.asset WHERE asset_type = <? value("type") ?>', cparam);
  if (data.first())
  {
   if (data.value("count") > 0)
   { 
     return true;
   } else {
     return false;
   }
  }
}

function assetOpen(mode, number)
{
  try
  {
   var childwnd = toolbox.openWindow("assetType",mywindow, 0, 1);
   var wparams = new Object;
   wparams.mode = mode;
   if (mode)
     wparams.assettypeid = number;
   var tmp = toolbox.lastWindow().set(wparams);
  }
  catch(e)
  {
   print(e);
   QMessageBox.critical(mywindow, "Error", e);
  }
}

function checkAssetprivs()
{
  _new.enabled = privileges.check("MaintainAssetType");
  _edit.enabled = privileges.check("MaintainAssetType");
  _delete.enabled = privileges.check("MaintainAssetType");
}

function getParams()
{
 params = new Object();
 params.search = "%" + _search.text + "%";
 return params;
}