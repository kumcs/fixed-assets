/* xTuple Fixed Asset
// Copyright (c) 2010-2012 Dave Anderson (www.anderson.net.nz)
// This package is provided free of charge to the xTuple community.
// If you find any errors or bugs or make any improvements, please submit these back to the author for inclusion in a future release
*/

// Declare variables
var _close = mywindow.findChild("_close");
var _save = mywindow.findChild("_save");
var _print = mywindow.findChild("_print");

var _assetCode = mywindow.findChild("_assetCode");
var _assetName = mywindow.findChild("_assetName");
var _fixedAsset = mywindow.findChild("_fixedAsset");
var _assetStatus = mywindow.findChild("_assetStatus");
var _parent = mywindow.findChild("_parent");
var _assetType = mywindow.findChild("_assetType");
var _vendor = mywindow.findChild("_vendorcode");
var _asset_brand = mywindow.findChild("_asset_brand");
var _asset_retire = mywindow.findChild("_asset_retire");
var _asset_disposition = mywindow.findChild("_asset_disposition");
var _comments = mywindow.findChild("_comments");
var _notes = mywindow.findChild("_notes");
var _rb1 = mywindow.findChild("_rb1");
var _rb2 = mywindow.findChild("_rb2");
var _address = mywindow.findChild("_address");
var _tab = mywindow.findChild("_tab");
var _warranty = mywindow.findChild("_warranty");
var _purchdate = mywindow.findChild("_purchdate");
var _installdate =  mywindow.findChild("_installdate");
var _warranty_exp = mywindow.findChild("_warranty_exp");
var _purch_price = mywindow.findChild("_purchprice");
var _residual_value = mywindow.findChild("_residualvalue");
var _asset_life = mywindow.findChild("_assetlife");

var _newMode = 0;
var _editMode = 1;
var _viewMode = 2;

var _populating = false;

// Connections
_close.clicked.connect(close);
_save.clicked.connect(saveAsset);
_assetCode["lostFocus()"].connect(checkTag);

_warranty["valueChanged(int)"].connect(warrantyChanged);
_assetStatus["currentIndexChanged(QString)"].connect(checkStatus);

// TODO - Add Comments when the Comments Widget allows adhoc types
//_rb1.clicked.connect(selectNotes);
//_rb2.clicked.connect(selectComments);

// Populate dropdowns
_assetType.populate("SELECT id, assettype_code as name from asset.asset_type ORDER BY assettype_code");
_assetStatus.populate("SELECT assetstatus_id, assetstatus_code from asset.asset_status order by assetstatus_order"); 
_asset_brand.populate("SELECT trunc(random() * 10000 + 1) as id, asset_brand FROM (SELECT DISTINCT asset_brand FROM asset.asset) as qry ORDER BY asset_brand");
_asset_disposition.populate("SELECT disp_id, disp_code FROM asset.asset_disp ORDER BY disp_code");
_parent.populate("SELECT id, asset_code || ' - ' || asset_name FROM asset.asset ORDER BY asset_code");

_tab.setCurrentIndex(0);
//selectNotes();

// Local functions
function close()
{
 mywindow.close();
}

function prepare()
{
  _assetCode.clear();
  _assetName.clear();
  _asset_retire.enabled = false;
  _asset_disposition.enabled = false;
  _populating = false;
}

function populate()
{
  _populating = true;
  _fixedAsset.select();
  _assetCode.enabled = false;
 
  var qparam = new Object();
  qparam.code = _assetCode.text;
  var data = toolbox.executeDbQuery("asset", "fetchFixedAsset", qparam);
  if (data.first())
    {
     _asset_brand.text = data.value("asset_brand");
     _vendor.setId(data.value("asset_vendor"));
     _notes.plainText = data.value("asset_comments");
     _purch_price.baseValue = data.value("asset_purch_price");
     _residual_value.baseValue = data.value("asset_residual_value"); 
     _asset_disposition.setId(data.value("asset_disposition"));
     _parent.setId(data.value("asset_parentid"));	
    }
  if(_fixedAsset.mode == _viewMode)
  {
  _asset_brand.enabled = false;
  _notes.enabled = false;
  _vendor.enabled = false;
  _purch_price.enabled = false;
  _residual_value.enabled = false;
  }
 _populating = false;
}

function set(input)
{
 if ("mode" in input)
 {
  _fixedAsset.setMode(input.mode);
  if (input.mode == _newMode)
  {
    prepare();
  }
 }
 if ("filter" in input)
 {
   _fixedAsset.setFilter(input.filter);
   populate();
 } 
 if ("retire" in input)
 {
   if (input.retire == true)
   {
   retireAsset();
   }
 }
 checkCtrlStatus();
 return 0;
}

function saveAsset()
{
  sSave();
  if(_print.checked == true) 
     printAsset();
  
  mainwindow.sSalesOrdersUpdated(-1);
  mywindow.close();
}

function sSave()
{
// Check required details have been entered 
  if (_assetType.id() == -1 || _assetCode.text == "" || _assetName.text == "" || _assetStatus.id() == -1)
  {
    QMessageBox.warning(mywindow, "Missing Information", "You must enter all details before saving (Code/Name/Type/Status)");
    return 0;
  }

  if (!checkStatus() || !checkTag())
  {
    return 0;
  }

  if (_installdate.date < _purchdate.date)
  {
    QMessageBox.warning(mywindow, "Incorrect Information", "You cannot install an Asset before you purchase it.");
    return 0;
  }

   // Save the Asset
  if(_fixedAsset.mode == _newMode)
  {
   try
   { 
     tmp = toolbox.executeDbQuery("asset", "insertFixedAsset", getParams());
   }
   catch(e)
   {
    print(e);
    var msg = "Asset creation failed.  Please contact your System Administrator.\n\n" + tmp.lastError().text; 
    QMessageBox.critical( mywindow, "Database Error", msg);
    return false;
   }
  }
  if(_fixedAsset.mode == _editMode)
  {
   try
   {
     tmp = toolbox.executeDbQuery("asset", "updateFixedAsset", getParams());
   }
   catch(e)
   {
    print(e);
    var msg = "Asset update  failed.  Please contact your System Administrator.\n\n" + tmp.lastError().text;
    QMessageBox.critical(mywindow, "Database Error", msg);
    return false;
   }
  }
  _fixedAsset.setMode(_editMode);
} 

function getParams()
{
var params = new Object();
 params.code = _assetCode.text;
 params.name = _assetName.text;
 params.type = _assetType.id();
 params.status = _assetStatus.id();
 if (_assetStatus.id() == 5) params.setretire = true;
 params.brand = _asset_brand.text;
 params.barcode = mywindow.findChild("_asset_barcode").text;
 params.model = mywindow.findChild("_asset_model").text;
 params.serial = mywindow.findChild("_asset_serial").text;
 params.vendor = _vendor.id();
 params.purchase_place = mywindow.findChild("_purchase_place").text; 
 params.purch_date = mywindow.findChild("_purchdate").date;
 params.service = mywindow.findChild("_last_service").date;
 params.install_date = _installdate.date;
 params.purch_price = _purch_price.baseValue;
 params.residual_value = _residual_value.baseValue;
 params.purch_date = _purchdate.date;
 params.asset_life = _asset_life.text;
 params.notes = mywindow.findChild("_notes").plainText;
 if (_address.id() != -1)
 {
   params.address = _address.id();
 }
 params.warranty_exp = _warranty_exp.date;
 params.warranty = _warranty.value;
 params.retire_date = _asset_retire.date;
 params.disposition = _asset_disposition.id();
 if (_parent.id() == -1)
 {
   params.parent = null;
 } else {
   params.parent = _parent.id();
 }

 return params;
}

function checkStatus()
{
  if (_populating) return 0;
//  Check Retired Status
  if (_assetStatus.id() == 5 && ( !_asset_retire.isValid() || _asset_disposition.id() == -1))
  {
   QMessageBox.warning(mywindow, "Missing Data", "You must enter the Retire date and Disposition code");
   retireAsset(); 
   return false;
  }
  if (_assetStatus.id() != 5 && ( _asset_retire.isValid() || _asset_disposition.id() != -1))
  {
    var msg = "You have entered a Retire Date or Disposition reason.  Do you wish to retire this asset?";
    if (QMessageBox.question(mywindow,qsTr("Sell Asset"), msg,QMessageBox.Yes, QMessageBox.Cancel) == QMessageBox.Yes)
    {
     retireAsset();
     return false;
    }
  }
  return true;
}

function warrantyChanged()
{
 if (!_purchdate.isValid()) return;
  var params;
  var formatDate = _purchdate.date.getFullYear() + '-' + (_purchdate.date.getMonth()+1) + '-' + _purchdate.date.getDate();
  var warranty = _warranty.value;
  var sql = "SELECT '" + formatDate + "'::date + interval '"+ warranty +" months' as new";
  var warr_date = toolbox.executeQuery(sql, params);
  if (warr_date.first())
  {
    _warranty_exp.setDate(warr_date.value("new"));
   }
}

function retireAsset()
{
  _assetStatus.setId(5);
  if(!_asset_retire.isValid())
    _asset_retire.setDate(new Date());
}

function printAsset()
{
 var aparams = new Object();
 aparams.code = _assetCode.text;
 toolbox.printReport("FixedAssetDetail", aparams);
}

// Check control status of Asset and prevent changes to fields if certain statuses are present
function checkCtrlStatus()
{
 var sparams = new Object();
 sparams.asset = _assetCode.text;
 var sql = 'SELECT asset_retired as retired, asset_depreciated as depreciated FROM asset.asset a'
         + ' WHERE asset_code = <? value("asset") ?>';
 var data = toolbox.executeQuery(sql, sparams);
 if (data.first())
 {
  if (data.value("retired") || data.value("depreciated"))
  {
   _purch_price.enabled = false;
   _residual_value.enabled = false; 
   _purchdate.enabled = false;  
   _asset_life.enabled = false;
  }
 } 
// Lock screen if asset is retired
  if (data.value("retired")) 
  {
    _fixedAsset.setMode(_viewMode);
    populate();
  }
}

function checkTag()
{
 if (_fixedAsset.mode == _editMode || _fixedAsset.mode == _viewMode)
   return true;

 var p = new Object();
 p.code = _assetCode.text;
 var d= toolbox.executeQuery('SELECT asset_code FROM asset.asset WHERE asset_code = <? value("code") ?>', p);
 if (d.first())
 {
  QMessageBox.warning(mywindow, "Duplicate Code", "You have entered an Asset code that already exists.  Please amend the code");
  _assetCode.clear();
  _assetCode.setFocus();
  return false;
 }
  return true;
}

//function selectComments()
//{
// _notes.setVisible(false);
// _comments.setVisible(true);
//}

//function selectNotes()
//{
// _notes.setVisible(true);
// _comments.setVisible(false);
//}
