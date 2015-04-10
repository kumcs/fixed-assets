var asset;
if (!asset)
  asset = new Object;

asset.newMode 	= 0;
asset.editMode	= 1;
asset.viewMode	= 2;

asset.errorCheck = function (q)
{
  if (q.lastError().type != QSqlError.NoError)
  {
    toolbox.messageBox("critical", mywindow,
                        qsTr("Database Error"), q.lastError().text);
    return false;
  }

  return true;
}

asset.getAssetId = function (assetcode) 
{
  var sql = "SELECT id AS ret FROM asset.asset WHERE asset_code=<? value('asset') ?>;";
  var ret = toolbox.executeQuery(sql, {asset: assetcode});
  if (ret.first())
    return ret.value("ret");
}

// Check presence of Depreciation package
asset.checkDepn = function ()
{
  var sql = "select COALESCE(pkghead_id,0) as id from pkghead where pkghead_name = 'assetdepn'";
  var check = toolbox.executeQuery(sql, new Object());
  if (check.first())
  {
   if (check.value("id") > 0)
   { return true }
   else { return false}
  } 
   else { return false}  
}

// Check presence of Asset Maintenance package
asset.checkMaint = function ()
{
  var sql = "select COALESCE(pkghead_id,0) as id from pkghead where pkghead_name = 'assetmaint'";
  var check = toolbox.executeQuery(sql, new Object());
  if (check.first())
  {
   if (check.value("id") > 0)
   { return true }
   else { return false}
  } 
   else { return false}  
}

asset.isRetired = function (asset) 
{
  var sql = "SELECT (asset_status = 5) AS ret FROM asset.asset WHERE id=<? value('assetid') ?>;";
  var ret = toolbox.executeQuery(sql, {assetid: asset});
  if (ret.first())
    return ret.value("ret");
}