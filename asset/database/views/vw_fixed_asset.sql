DROP VIEW IF EXISTS asset.vw_fixed_asset CASCADE;

CREATE OR REPLACE VIEW asset.vw_fixed_asset AS 
 SELECT a.id, a.asset_code, a.asset_name, a.asset_type, a.asset_vendor, a.asset_purch_date, a.asset_purch_price, a.asset_install_date, a.asset_life, a.asset_residual_value, a.asset_warranty_mth, a.asset_retire_date, a.asset_address, a.asset_comments, a.asset_status, a.asset_brand, a.asset_model, a.asset_serial, a.asset_barcode, a.asset_purch_place, a.asset_warranty_exp, a.asset_last_service, a.asset_disposition, a.asset_warranty, t.assettype_code AS asset_type_code, s.assetstatus_code AS asset_status_code, v.vend_number AS asset_vendor_code, addr.addr_line1, addr.addr_line2, addr.addr_line3, addr.addr_city, addr.addr_state, addr.addr_postalcode, addr.addr_country, a.asset_bookvalue, p.asset_name AS asset_parent
   FROM asset.asset a
   LEFT JOIN asset.asset p ON a.asset_parentid = p.id
   JOIN asset.asset_type t ON a.asset_type = t.id
   JOIN asset.asset_status s ON a.asset_status = s.assetstatus_id
   LEFT JOIN vendinfo v ON a.asset_vendor = v.vend_id
   LEFT JOIN addr ON a.asset_address = addr.addr_id;

REVOKE ALL ON TABLE asset.vw_fixed_asset FROM PUBLIC;
ALTER TABLE asset.vw_fixed_asset OWNER TO admin;
GRANT ALL ON TABLE asset.vw_fixed_asset TO admin;
GRANT ALL ON TABLE asset.vw_fixed_asset TO xtrole;
