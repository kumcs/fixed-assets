include("asset");

var _close = mywindow.findChild("_close");
var _save = mywindow.findChild("_save");
var _assetCode = mywindow.findChild("_assetCode");
var _assetName = mywindow.findChild("_assetName");
var _assetDepn = mywindow.findChild("_assetDepn");
var _glFixedAsset = mywindow.findChild("_glFixedAsset");
var _glAccumDepn = mywindow.findChild("_glAccumDepn");
var _glDepnExp = mywindow.findChild("_glDepnExp");
var _glGainLoss = mywindow.findChild("_glGainLoss");
var _glScrap = mywindow.findChild("_glScrap");
var _depnperc = mywindow.findChild("_depnperc");
var _accounts = mywindow.findChild("_accounts");
var _depreciation = mywindow.findChild("_depreciation");

var _newMode = 0;
var _editMode = 1;
var _viewMode = 2;
var _assetType = new Object;
var _assettypeid;

_glFixedAsset.setType(GLCluster.cAsset);
_glAccumDepn.setType(GLCluster.cAsset);
_glDepnExp.setType(GLCluster.cExpense);
_glGainLoss.setType(GLCluster.cRevenue);
_glScrap.setType(GLCluster.cExpense);

_assetDepn.populate("SELECT depn_id as id, depn_name as name from asset.asset_depn ORDER BY depn_id");
_depnperc.setValidator(mainwindow.percentVal());

_accounts.enabled = asset.checkDepn();
_depreciation.enabled = asset.checkDepn();

function prepare()
{
  _assetCode.clear();
  _assetName.clear();
  _depnperc.text = '00.0';
}

function populate()
{
  var p = new Object();
  p.assettype = _assettypeid;
  var d=toolbox.executeQuery("SELECT * FROM asset.asset_type WHERE id = <? value(\"assettype\") ?>", p);
  if (d.first()){
    _assetCode.text = d.value("assettype_code");
    _assetName.text = d.value("assettype_name");
    _assetDepn.setId(d.value("assettype_depn"));
    _depnperc.setDouble(d.value("assettype_depnperc"));
    _glFixedAsset.setId(d.value("assettype_gl1"));
    _glAccumDepn.setId(d.value("assettype_gl2"));
    _glDepnExp.setId(d.value("assettype_gl3"));
    _glGainLoss.setId(d.value("assettype_gl4"));
    _glScrap.setId(d.value("assettype_gl5"));
  }

  _assetCode.enabled = false;
  _assetDepn.enabled = false;
  _depnperc.enabled = false;
}

function set(input)
{
 if ("mode" in input)
 {
  _assetType.mode = input.mode;
  if (input.mode == _newMode)
    prepare();
  else {
   _assettypeid = input.assettypeid;
   populate();
  }
 }  
 return 0;
}

function saveAsset()
{

// Check required details have been entered 
  if (_assetDepn.id() == -1 || _assetCode.text == "" || _assetName.text == "")
  {
    QMessageBox.warning(mywindow, "Missing Information", "You must enter all details before saving.");
    return 0;
  }

// DA (Aug 2012 v 1.1.1) Check Depreciation package installed and if so make GL entries mandatory
  if (asset.checkDepn() == true)
  {
   if (_assetDepn.id() == -1 || _glFixedAsset.id() == -1 || _glAccumDepn.id() == -1 || _glDepnExp.id() == -1 || _glGainLoss.id() == -1 || _glScrap.id() == -1)
   {
     QMessageBox.warning(mywindow, "Missing Information", "Depreciation package requires the G/L Accounts to be specified.  You must enter all details before saving.");
     return 0;
   }
  } 

// If Diminishing Value is selected you must select a Depreciation %
  if (_assetDepn.id() == 2 && _depnperc.toDouble() == 0)
  {
    QMessageBox.warning(mywindow, "Missing Information", "You must enter a Depreciation % with Diminishing Value.");
    return 0;
  }

  if (_assetType.mode == _newMode)
  {
   var sql = 'INSERT INTO asset.asset_type (assettype_code, assettype_name, assettype_depn, assettype_gl1, assettype_gl2, assettype_gl3, assettype_gl4, assettype_gl5, assettype_depnperc)'
     + ' VALUES(<? value("code") ?>, <? value("name") ?>,<? value("depn") ?>,<? value("gl1") ?>,<? value("gl2") ?>,<? value("gl3") ?>,<? value("gl4") ?>,<? value("gl5") ?>,<? value("depnperc") ?>)';
   var d = toolbox.executeQuery(sql, getParams());
  } else {
   var sql = 'UPDATE asset.asset_type SET assettype_name = <? value("name") ?>, assettype_gl1 =<? value("gl1") ?>, assettype_gl2 =<? value("gl2") ?>,assettype_gl3 =<? value("gl3") ?>,assettype_gl4 =<? value("gl4") ?>,assettype_gl5 =<? value("gl5") ?>'
       + ' WHERE assettype_code = <? value("code") ?>';
   var d = toolbox.executeQuery(sql, getParams());
  }

  mainwindow.sSalesOrdersUpdated(-1);
  mywindow.close();
} 

function getParams()
{
 var params = new Object();
 params.code = _assetCode.text;
 params.name = _assetName.text;
 params.depn = _assetDepn.id();
 params.depnperc = _depnperc.toDouble();
 params.gl1 = _glFixedAsset.id();
 params.gl2 = _glAccumDepn.id();
 params.gl3 = _glDepnExp.id();
 params.gl4 = _glGainLoss.id();
 params.gl5 = _glScrap.id();

 return params;
}

_close.clicked.connect(mywindow.close);
_save.clicked.connect(saveAsset);
