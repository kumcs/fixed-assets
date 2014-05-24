var _close = mywindow.findChild("_close");
var _save = mywindow.findChild("_save");
var _dispCode = mywindow.findChild("_dispCode");
var _dispName = mywindow.findChild("_dispName");
var _assetDisp = mywindow.findChild("_assetDisp");

var _newMode = 0;
var _editMode = 1;
var _viewMode = 2;

_close.clicked.connect(close);
_save.clicked.connect(saveDisp);

function close()
{
 mywindow.close();
}

function prepare()
{
  _dispCode.clear();
  _dispName.clear();
  _dispCode.setFocus();
}

function populate()
{
  _assetDisp.select();
  var params = new Object();
  params.disp = _dispCode.text;
  var data = toolbox.executeQuery('SELECT disp_system FROM asset.asset_disp WHERE disp_code = <? value("disp") ?>',params);
  if (data.first())
  {
   if (data.value("disp_system"))
   {
     _dispCode.enabled = false;
     _dispName.setFocus();
   }
  }
}

function set(input)
{
 if ("mode" in input)
 {
  _assetDisp.setMode(input.mode);
  if (input.mode == 0)
  {
    prepare();
  }
 }
 if ("filter" in input)
 {
   _assetDisp.setFilter(input.filter);
   populate();
 } 
 return 0;
}

function saveDisp()
{
// Check required details have been entered 
  if (_dispCode.text == "" || _dispName.text == "")
  {
    QMessageBox.warning(mywindow, "Warning", "You must enter all details before saving");
    return 0;
  }

  try
  {
     toolbox.executeBegin();
     _assetDisp.save();
     toolbox.executeCommit(); 
     mainwindow.sSalesOrdersUpdated(-1);
     mywindow.close();
  }
  catch(e)
  {
   toolbox.executeRollback();
   print(e);
   QMessageBox.critical(mywindow, "Error", e);
  }
} 

