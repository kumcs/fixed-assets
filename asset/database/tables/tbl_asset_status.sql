SELECT xt.create_table('asset_status', 'asset', false);

SELECT xt.add_column('asset_status', 'assetstatus_id', 'serial', 'NOT NULL', 'asset', null);
SELECT xt.add_column('asset_status', 'assetstatus_code', 'text', 'NOT NULL', 'asset', null);
SELECT xt.add_column('asset_status', 'assetstatus_order', 'integer', '', 'asset', null);

SELECT xt.add_constraint('asset_status', 'pk_assetstatus', 'PRIMARY KEY (assetstatus_id)', 'asset');

REVOKE ALL ON TABLE asset.asset_status_assetstatus_id_seq FROM PUBLIC;
REVOKE ALL ON TABLE asset.asset_status FROM PUBLIC;

GRANT ALL ON TABLE asset.asset_status_assetstatus_id_seq TO xtrole;
GRANT ALL ON TABLE asset.asset_status_assetstatus_id_seq TO admin;

ALTER TABLE asset.asset_status OWNER TO admin;
GRANT ALL ON TABLE asset_status TO admin;
GRANT ALL ON TABLE asset_status TO xtrole;

