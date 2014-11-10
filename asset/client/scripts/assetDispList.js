var _close = mywindow.findChild("_close");
var _new = mywindow.findChild("_new");
var _edit = mywindow.findChild("_edit");
var _results = mywindow.findChild("_results");
var _delete = mywindow.findChild("_delete");

_close.clicked.connect(closeForm);
_new.clicked.connect(dispositionNew);
_edit.clicked.connect(dispositionEdit);
_delete.clicked.connect(dispositionDelete);

mainwindow["salesOrdersUpdated(int, bool)"].connect(fillList);
mainwindow.tick.connect(fillList);

with (_results)
{
  addColumn("ID",  10, 1, false, "disp_id");
  addColumn("Code",  75, 1, true, "disp_code");
  addColumn("Description",  175, 1, true, "disp_descr");
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
   mCode = pMenu.addAction(qsTr("Edit..."),privileges.check("MaintainAssetDisposition"));
   mCode.triggered.connect(dispositionEdit);

   mCode = pMenu.addAction(qsTr("Delete..."),privileges.check("MaintainAssetDisposition"));
   mCode.triggered.connect(dispositionDelete);

  }
 }
}
 

function fillList()
{
 try
 {
  var params = new Object();
  data = toolbox.executeQuery("SELECT * FROM asset.asset_disp", params);
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

function dispositionNew()
{
 dispositionOpen(0,0);
}

function dispositionEdit()
{ 
 if (_results.id() == -1)
 {
  QMessageBox.warning(mywindow, "Warning", "You must select a line first");
  return 0;
 }
 dispositionOpen(1,_results.id());
}

function dispositionDelete()
{
 if (_results.id() == -1)
 {
  QMessageBox.warning(mywindow, "Warning", "You must select an Asset Disposition first");
  return 0;
 }
 // Check Asset Disposition is not used
 if(isUsed(_results.id()))
 {
  QMessageBox.warning(mywindow, "Warning", "You cannot delete an Asset Disposition that is in use");
  return 0;
 } 
 // Check Asset Disposition is not a system type
 if(isSystem(_results.id()))
 {
  QMessageBox.warning(mywindow, "Warning", "You cannot delete a system Asset Disposition");
  return 0;
 } 

  var dparam = new Object();
  dparam.id = _results.id();
  var data = toolbox.executeQuery('DELETE FROM asset.asset_disp WHERE disp_id = <? value("id") ?>', dparam);
  
  fillList();
}

function isUsed(type)
{
  var cparam = new Object();
  cparam.type = type;
  var data = toolbox.executeQuery('SELECT count(*) as count FROM asset.asset WHERE asset_disposition = <? value("type") ?>', cparam);
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

function isSystem(type)
{
  var cparam = new Object();
  cparam.type = type;
  var data = toolbox.executeQuery('SELECT disp_system as system FROM asset.asset_disp WHERE disp_id = <? value("type") ?>', cparam);
  if (data.first())
  {
   return data.value("system") ;
  }
}

function dispositionOpen(mode, number)
{
  try
  {
   var childwnd = toolbox.openWindow("assetDisp",mywindow, 0, 1);
   var wparams = new Object;
   wparams.mode = mode;
   if (mode)
     wparams.filter = "disp_id = " + number;

   var tmp = toolbox.lastWindow().set(wparams);
  }
  catch(e)
  {
   print(e);
   QMessageBox.critical(mywindow, "Error", e);
  }
}

