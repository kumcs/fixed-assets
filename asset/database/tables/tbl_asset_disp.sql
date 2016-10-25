SELECT xt.create_table('asset_disp', 'asset', false);

SELECT xt.add_column('asset_disp', 'disp_id', 'serial', 'NOT NULL', 'asset', null);
SELECT xt.add_column('asset_disp', 'disp_code', 'text', '', 'asset', null);
SELECT xt.add_column('asset_disp', 'disp_descr', 'text', '', 'asset', null);
SELECT xt.add_column('asset_disp', 'disp_system', 'boolean', '', 'asset', null);

SELECT xt.add_constraint('asset_disp', 'pk_asset_disp', 'PRIMARY KEY (disp_id)', 'asset');
SELECT xt.add_constraint('asset_disp', 'un_asset_disp', 'UNIQUE (disp_code)', 'asset');

REVOKE ALL ON TABLE asset.asset_disp_disp_id_seq FROM PUBLIC;
REVOKE ALL ON TABLE asset.asset_disp FROM PUBLIC;
COMMENT ON TABLE asset.asset_disp IS 'Asset Disposition List';

GRANT ALL ON TABLE asset.asset_disp_disp_id_seq TO xtrole;
GRANT ALL ON TABLE asset.asset_disp_disp_id_seq TO admin;

ALTER TABLE asset.asset_disp OWNER TO admin;
GRANT ALL ON TABLE asset.asset_disp TO admin;
GRANT ALL ON TABLE asset.asset_disp TO xtrole;

