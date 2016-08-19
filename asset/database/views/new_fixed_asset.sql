-- View: asset.new_fixed_asset

DROP VIEW IF EXISTS asset.new_fixed_asset CASCADE;

CREATE OR REPLACE VIEW asset.new_fixed_asset AS 
 SELECT a.asset_code, a.asset_name, t.assettype_code AS asset_type, v.vend_number AS vendor_code, a.asset_purch_date AS purchase_date, a.asset_purch_price AS purchase_price, a.asset_install_date AS install_date, a.asset_life, a.asset_residual_value AS residual_value, a.asset_warranty_mth AS warranty_months, a.asset_comments, s.assetstatus_code AS asset_status, a.asset_brand AS brand, a.asset_model AS model, a.asset_serial AS serial, a.asset_barcode AS barcode, a.asset_purch_place AS purchase_place, a.asset_warranty_exp AS warranty_expiry, a.asset_last_service AS last_service_date, a.asset_bookvalue AS book_value, p.asset_code AS asset_parent, i.item_number
   FROM asset.asset a
   LEFT JOIN asset.asset p ON a.asset_parentid = p.id
   JOIN asset.asset_type t ON a.asset_type = t.id
   JOIN asset.asset_status s ON a.asset_status = s.assetstatus_id
   LEFT JOIN vendinfo v ON a.asset_vendor = v.vend_id
   LEFT JOIN addr ON a.asset_address = addr.addr_id
   LEFT JOIN item i ON a.asset_item_id = i.item_id;

ALTER TABLE asset.new_fixed_asset
  OWNER TO xtrole;
GRANT ALL ON TABLE asset.new_fixed_asset TO xtrole;

-- Rule: "_INSERT" ON asset.new_fixed_asset

-- DROP RULE "_INSERT" ON asset.new_fixed_asset;

CREATE OR REPLACE RULE "_INSERT" AS
    ON INSERT TO asset.new_fixed_asset DO INSTEAD  INSERT INTO asset.asset (asset_code, asset_name, asset_type, asset_vendor, asset_purch_date, asset_purch_price, asset_install_date, asset_life, asset_residual_value, asset_warranty_mth, asset_comments, asset_status, asset_brand, asset_model, asset_serial, asset_barcode, asset_purch_place, asset_warranty_exp, asset_last_service, asset_bookvalue, asset_parentid, asset_item_id) 
  VALUES (new.asset_code, new.asset_name, ( SELECT asset_type.id
           FROM asset.asset_type
          WHERE asset_type.assettype_code = COALESCE(new.asset_type, (SELECT assettype_code FROM asset.asset_type LIMIT 1))), ( SELECT vendinfo.vend_id
           FROM vendinfo
          WHERE vendinfo.vend_number = new.vendor_code), new.purchase_date, new.purchase_price, new.install_date, new.asset_life, new.residual_value, new.warranty_months, new.asset_comments, ( SELECT asset_status.assetstatus_id
           FROM asset.asset_status
          WHERE asset_status.assetstatus_code = COALESCE(new.asset_status, 'Active')), new.brand, new.model, new.serial, new.barcode, new.purchase_place, new.warranty_expiry, new.last_service_date, new.book_value, ( SELECT asset.id
           FROM asset.asset
          WHERE asset.asset_code = new.asset_parent), ( SELECT item.item_id
           FROM item
          WHERE item.item_number = new.item_number));

