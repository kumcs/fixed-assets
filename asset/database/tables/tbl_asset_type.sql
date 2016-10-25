SELECT xt.create_table('asset_type', 'asset', false);

SELECT xt.add_column('asset_type', 'id', 'serial', 'NOT NULL', 'asset', null);
SELECT xt.add_column('asset_type', 'assettype_code', 'text', '', 'asset', null);
SELECT xt.add_column('asset_type', 'assettype_name', 'text', '', 'asset', null);
SELECT xt.add_column('asset_type', 'assettype_depn', 'integer', '', 'asset', null);
SELECT xt.add_column('asset_type', 'assettype_gl1', 'integer', '', 'asset', null);
SELECT xt.add_column('asset_type', 'assettype_gl2', 'integer', '', 'asset', null);
SELECT xt.add_column('asset_type', 'assettype_gl3', 'integer', '', 'asset', null);
SELECT xt.add_column('asset_type', 'assettype_gl4', 'integer', '', 'asset', null);
SELECT xt.add_column('asset_type', 'assettype_gl5', 'integer', '', 'asset', null);
SELECT xt.add_column('asset_type', 'assettype_depnperc', 'numeric(6,2)', '', 'asset', null);

SELECT xt.add_constraint('asset_type', 'pk_assettype', 'PRIMARY KEY (id)', 'asset');
SELECT xt.add_constraint('asset_type', 'un_asset_type', 'UNIQUE (assettype_code)', 'asset');

REVOKE ALL ON TABLE asset.asset_type_id_seq FROM PUBLIC;
REVOKE ALL ON TABLE asset.asset_type FROM PUBLIC;

GRANT ALL ON TABLE asset.asset_type_id_seq TO xtrole;
GRANT ALL ON TABLE asset.asset_type_id_seq TO admin;
GRANT ALL ON TABLE asset.asset_type_id_seq TO PUBLIC;

ALTER TABLE asset.asset_type OWNER TO admin;
GRANT ALL ON TABLE asset.asset_type TO admin;
GRANT ALL ON TABLE asset.asset_type TO xtrole;

