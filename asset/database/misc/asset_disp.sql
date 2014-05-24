DELETE FROM asset.asset_disp WHERE disp_system=true;
INSERT INTO asset.asset_disp (disp_id, disp_code, disp_descr, disp_system) VALUES (1,'SOLD', 'Asset Sold', true);
INSERT INTO asset.asset_disp (disp_id, disp_code, disp_descr, disp_system) VALUES (2,'SCRAP', 'Asset Scrapped', true);

SELECT setval('asset.asset_disp_disp_id_seq',(SELECT max(disp_id)+1 FROM asset.asset_disp));
