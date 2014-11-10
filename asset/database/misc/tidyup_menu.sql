ALTER TABLE asset.pkgscript DISABLE TRIGGER USER;

DELETE FROM asset.pkgscript WHERE script_name='initMenu' and script_order = 0;

ALTER TABLE asset.pkgscript ENABLE TRIGGER USER;

ALTER TABLE asset.asset OWNER TO xtrole;
ALTER TABLE asset.asset_depn OWNER TO xtrole;
ALTER TABLE asset.asset_disp OWNER TO xtrole;
ALTER TABLE asset.asset_status OWNER TO xtrole;
ALTER TABLE asset.asset_type OWNER TO xtrole;
