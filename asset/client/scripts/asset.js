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