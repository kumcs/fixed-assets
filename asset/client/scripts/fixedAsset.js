/* xTuple Fixed Asset
// Copyright (c) 2010-2015 Dave Anderson (www.pentuple.co.nz)
// This package is provided free of charge to the xTuple community.
// If you find any errors or bugs or make any improvements, please submit these back to the author for inclusion in a future release
*/

include("asset");
asset.fixedAsset = new Object;

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
var _crmacct = mywindow.findChild("_crmacct");
var _address = mywindow.findChild("_address");
var _location = mywindow.findChild("_location");
var _tab = mywindow.findChild("_tab");
var _warranty = mywindow.findChild("_warranty");
var _purchdate = mywindow.findChild("_purchdate");
var _installdate =  mywindow.findChild("_installdate");
var _warranty_exp = mywindow.findChild("_warranty_exp");
var _purch_price = mywindow.findChild("_purchprice");
var _residual_value = mywindow.findChild("_residualvalue");
var _asset_life = mywindow.findChild("_assetlife");
var _asset_model = mywindow.findChild("_asset_model");
var _asset_barcode = mywindow.findChild("_asset_barcode");
var _asset_serial = mywindow.findChild("_asset_serial");
var _purchase_place = mywindow.findChild("_purchase_place");
var _last_service = mywindow.findChild("_last_service");

var _assetid;
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
_crmacct["newId(int)"].connect(updateCRMAddress);
_location["newID(int)"].connect(updateLocationAddress);

// TODO - Add Comments when the Comments Widget allows adhoc types
//_rb1.clicked.connect(selectNotes);
//_rb2.clicked.connect(selectComments);

// Populate dropdowns
_assetType.populate("SELECT id, assettype_code as name from asset.asset_type ORDER BY assettype_code");
_assetStatus.populate("SELECT assetstatus_id, assetstatus_code from asset.asset_status order by assetstatus_order"); 
_asset_brand.populate("SELECT trunc(random() * 10000 + 1) as id, asset_brand FROM (SELECT DISTINCT asset_brand FROM asset.asset) as qry ORDER BY asset_brand");
_asset_disposition.populate("SELECT disp_id, disp_code FROM asset.asset_disp ORDER BY disp_code");
_parent.populate("SELECT id, asset_code || ' - ' || asset_name FROM asset.asset ORDER BY asset_code");
_location.populate("SELECT location_id, formatLocationName(location_id) AS locationname FROM location");

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

  var qparam = new Object();
  qparam.assetid = _assetid;
  var data = toolbox.executeDbQuery("asset", "fetchFixedAsset", qparam);
  asset.errorCheck(data);
  if (data.first())
  {
    _assetCode.text = data.value("asset_code");
    _assetName.text = data.value("asset_name");
    _assetType.setId(data.value("asset_type"));
    _assetStatus.setId(data.value("asset_status"));
    _asset_brand.text = data.value("asset_brand");
    _asset_retire.setDate(data.value("asset_retire_date"));
    _asset_disposition.setId(data.value("asset_disposition"));
    _purchdate.setDate(data.value("asset_purch_date"));
    _warranty.setValue(data.value("asset_warranty_mth"));
    _last_service.setDate(data.value("asset_last_service"));
    _installdate.setDate(data.value("asset_install_date"));
    _asset_model.text = data.value("asset_model");
    _asset_serial.text = data.value("asset_serial");
    _asset_barcode.text = data.value("asset_barcode");
    _purchase_place.text = data.value("purchase_place");
    _vendor.setId(data.value("asset_vendor"));
    _notes.plainText = data.value("asset_comments");
    _purch_price.baseValue = data.value("asset_purch_price");
    _purchase_place.text = data.value("asset_purch_place");
    _residual_value.baseValue = data.value("asset_residual_value"); 
    _asset_disposition.setId(data.value("asset_disposition"));
    _parent.setId(data.value("asset_parentid"));	
    _crmacct.setId(data.value("asset_crmacct_id"));
    _location.setId(data.value("asset_location_id"));
    _address.setId(data.value("asset_address"));
  }
  if(_fixedAsset.mode == _viewMode)
  {
    _asset_brand.enabled = false;
    _notes.enabled = false;
    _vendor.enabled = false;
    _purch_price.enabled = false;
    _residual_value.enabled = false;
    _crmacct.enabled = false;
    _location.enabled = false;
    _address.enabled = false;
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
   if (input.mode == _viewMode)
   {
     _save.setVisible(false);
   } 
 }
 if ("assetid" in input)
 {
   _assetid = input.assetid;
   populate();
 } 
 if ("retire" in input)
 {
   if (input.retire == true)
     retireAsset();
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

function sSave() {
  var tmp;
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
  if(_fixedAsset.mode == _newMode) {
    tmp = toolbox.executeDbQuery("asset", "insertFixedAsset", getParams());
  } else if(_fixedAsset.mode == _editMode) {
    tmp = toolbox.executeDbQuery("asset", "updateFixedAsset", getParams());
  }
  asset.errorCheck(tmp);
  _fixedAsset.setMode(_editMode);
}

function getParams()
{
var params = new Object();
 params.assetid = _assetid;
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
 params.crmacct = _crmacct.id() == -1 ? null : _crmacct.id();
 params.location = _location.id() == -1 ? null : _location.id();
 params.address = _address.id();
 params.warranty_exp = _warranty_exp.date;
 params.warranty = _warranty.value;
 params.retire_date = _asset_retire.date;
 params.disposition = _asset_disposition.id();
 params.parent = _parent.id() == -1 ? null : _parent.id();

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

function updateCRMAddress() {
  if (_populating)
    return;

  if (_crmacct.id() > 0) {
    _location.setId(-1);
    _location.setEnabled(_crmacct.id() < 0);

    var p = new Object;
    p.crmacct = _crmacct.id();
    var _sql = "SELECT cntct_addr_id FROM crmacct "
             + "JOIN cntct ON (crmacct_cntct_id_1 = cntct_id) "
             + "WHERE (crmacct_id=<? value('crmacct') ?>);";
    var addr = toolbox.executeQuery(_sql, p);
    asset.errorCheck(addr);
    if (addr.first())
      _address.setId(addr.value("cntct_addr_id"));
    updateSubAssetLocations();
  }

  if (_crmacct.id() == -1 && _location.id() == -1) {
    _location.setEnabled(true);
    _crmacct.setEnabled(true);
    updateSubAssetLocations();
  }
}

function updateLocationAddress() {
  if (_populating)
    return;

  if (_location.id() > 0) {
    _crmacct.setId(-1);
    _crmacct.setEnabled(_location.id() < 0);
    with (_address) {
      setId(-1);
      setLine1("");
      setLine2("");
      setLine3("");
      setCity("");
      setState("");
      setPostalCode("");
    }
    updateSubAssetLocations();
  }
 
  if (_crmacct.id() == -1 && _location.id() == -1) {
    _location.setEnabled(true);
    _crmacct.setEnabled(true);
    updateSubAssetLocations();
  }
}

function updateSubAssetLocations() {
  var p = new Object;
  p.code = _assetCode.text;
  var _sql = "SELECT EXISTS (SELECT * FROM asset.asset "
           + " WHERE asset_parentid IN (SELECT id FROM asset.asset WHERE asset_code = <? value('code') ?>));";
  var _chk = toolbox.executeQuery(_sql, p);
  if (!_chk.first())
    return; // this should not occur

  if (_chk.value("exists") == false)
     return; // Nothing to update

  var _msg = qsTr("This Asset has sub-assets assigned.  Do you want to update the sub-asset locations?");
  if (QMessageBox.question(mywindow,qsTr("Sub-Assets"), _msg, QMessageBox.Yes, QMessageBox.No) == QMessageBox.No)
     return; // User does not want to update

  // Passed checks OK to update sub-assets
  _sql = "UPDATE asset.asset SET asset_address = <? value('address') ?>, asset_crmacct_id = <? value('crmacct') ?>, "
         + " asset_location_id = <? value('location') ?> WHERE asset_parentid IN (SELECT id FROM asset.asset WHERE asset_code = <? value('code') ?>);";
  var _upd = toolbox.executeQuery(_sql, getParams());
  asset.errorCheck(_upd);
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
 asset.errorCheck(data);
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
 if (_fixedAsset.mode == _viewMode)
   return true;

 var p = new Object();
 p.assetid = _assetid; 
 p.code = _assetCode.text;
 var d= toolbox.executeQuery('SELECT asset_code FROM asset.asset WHERE (asset_code = <? value("code") ?>) AND (asset.id <> <? value("assetid") ?>)', p);
  asset.errorCheck(d);
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
