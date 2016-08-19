ALTER TABLE asset.pkgscript DISABLE TRIGGER USER;

DELETE FROM asset.pkgscript WHERE script_name='initMenu' and script_order = 0;

ALTER TABLE asset.pkgscript ENABLE TRIGGER USER;

ALTER TABLE asset.asset OWNER TO xtrole;
ALTER TABLE asset.asset_depn OWNER TO xtrole;
ALTER TABLE asset.asset_disp OWNER TO xtrole;
ALTER TABLE asset.asset_status OWNER TO xtrole;
ALTER TABLE asset.asset_type OWNER TO xtrole;


DO $$
DECLARE
  _depn BOOLEAN;
  _r RECORD;
  _bv NUMERIC;
BEGIN
  _depn := EXISTS(SELECT 1 FROM pkghead WHERE pkghead_name='assetdepn');
  IF (_depn) THEN
    FOR _r IN
      select asset.id, asset_purch_price, asset_bookvalue, assettrans_id, assettrans_amount, assettrans_bookvalue
      from assetdepn.asset_trans 
      join asset.asset ON (assettrans_asset_id=asset.id)
      where assettrans_bookvalue < 0
    LOOP
      _bv := _r.asset_purch_price - _r.assettrans_amount;
      UPDATE asset.asset SET asset_bookvalue = _bv
        WHERE asset.id = _r.id;
      UPDATE assetdepn.asset_trans SET assettrans_bookvalue =_bv
        WHERE assettrans_id = _r.assettrans_id; 
    END LOOP;
  END IF;
END; $$
