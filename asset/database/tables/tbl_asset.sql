DROP VIEW IF EXISTS asset.vw_fixed_asset;

SELECT xt.create_table('asset', 'asset', false);

SELECT xt.add_column('asset', 'id', 'serial', 'NOT NULL', 'asset', null);
SELECT xt.add_column('asset', 'asset_code', 'text', 'NOT NULL', 'asset', null);
SELECT xt.add_column('asset', 'asset_name', 'text', 'NOT NULL', 'asset', null);
SELECT xt.add_column('asset', 'asset_type', 'integer', 'NOT NULL', 'asset', null);
SELECT xt.add_column('asset', 'asset_vendor', 'integer', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_purch_date', 'date', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_purch_price', 'numeric(16,2)', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_install_date', 'date', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_life', 'integer', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_residual_value', 'numeric(16,2)', 'DEFAULT 0', 'asset', null);
SELECT xt.add_column('asset', 'asset_warranty_mth', 'integer', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_retire_date', 'date', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_address', 'integer', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_comments', 'text', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_status', 'integer', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_brand', 'text', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_model', 'text', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_serial', 'text', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_barcode', 'text', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_purch_place', 'text', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_warranty_exp', 'date', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_last_service', 'date', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_warranty', 'boolean', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_disposition', 'integer', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_retired', 'boolean', 'DEFAULT false', 'asset', null);
SELECT xt.add_column('asset', 'asset_depreciated', 'boolean', 'DEFAULT false', 'asset', null);
SELECT xt.add_column('asset', 'asset_bookvalue', 'numeric(16,2)', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_parentid', 'integer', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_item_id', 'integer', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_crmacct_id', 'integer', '', 'asset', null);
SELECT xt.add_column('asset', 'asset_location_id', 'integer', '', 'asset', null);

SELECT xt.add_constraint('asset', 'pk_asset', 'PRIMARY KEY (id)', 'asset');
SELECT xt.add_constraint('asset', 'fk_asset_crmacct_id', 'FOREIGN KEY (asset_crmacct_id)
      REFERENCES public.crmacct (crmacct_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION', 'asset');
SELECT xt.add_constraint('asset', 'fk_asset_item_id', 'FOREIGN KEY (asset_item_id)
      REFERENCES public.item (item_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION', 'asset');
SELECT xt.add_constraint('asset', 'fk_asset_location_id', 'FOREIGN KEY (asset_location_id)
      REFERENCES public.location (location_id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION', 'asset');
SELECT xt.add_constraint('asset', 'fk_asset_parentid', 'FOREIGN KEY (asset_parentid)
      REFERENCES asset.asset (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION', 'asset');
SELECT xt.add_constraint('asset', 'fk_asset_type', 'FOREIGN KEY (asset_type)
      REFERENCES asset.asset_type (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION', 'asset');
SELECT xt.add_constraint('asset', 'un_asset_code', 'UNIQUE (asset_code)', 'asset');

REVOKE ALL ON TABLE asset.asset_id_seq FROM PUBLIC;
GRANT ALL ON TABLE asset.asset_id_seq TO GROUP xtrole;
GRANT ALL ON TABLE asset.asset_id_seq TO admin;

REVOKE ALL ON TABLE asset.asset FROM PUBLIC;
ALTER TABLE asset.asset OWNER TO admin;
GRANT ALL ON TABLE asset.asset TO admin;
GRANT ALL ON TABLE asset.asset TO GROUP xtrole;
