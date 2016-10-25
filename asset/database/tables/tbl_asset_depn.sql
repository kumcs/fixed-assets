SELECT xt.create_table('asset_depn', 'asset', false);

SELECT xt.add_column('asset_depn', 'depn_id', 'serial', 'NOT NULL', 'asset', null);
SELECT xt.add_column('asset_depn', 'depn_name', 'text', 'NOT NULL', 'asset', null);

SELECT xt.add_constraint('asset_depn', 'pk_asset_depn', 'PRIMARY KEY (depn_id)', 'asset');
SELECT xt.add_constraint('asset_depn', 'un_asset_depn', 'UNIQUE (depn_name)', 'asset');

ALTER TABLE asset.asset_depn OWNER TO admin;
REVOKE ALL ON TABLE asset.asset_depn_depn_id_seq FROM PUBLIC;
REVOKE ALL ON TABLE asset.asset_depn FROM PUBLIC;
GRANT ALL ON TABLE asset.asset_depn_depn_id_seq TO xtrole;
GRANT ALL ON TABLE asset.asset_depn TO admin;
GRANT ALL ON TABLE asset.asset_depn TO xtrole;

