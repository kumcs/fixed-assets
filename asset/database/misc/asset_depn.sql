INSERT INTO asset.asset_depn (depn_id, depn_name) 
  SELECT 0, 'No Depreciation'
  WHERE NOT EXISTS (SELECT 1 FROM asset.asset_depn WHERE depn_id = 0);

INSERT INTO asset.asset_depn (depn_id, depn_name) 
  SELECT 1, 'Straight Line (fin. period)'
  WHERE NOT EXISTS (SELECT 1 FROM asset.asset_depn WHERE depn_id = 1);

INSERT INTO asset.asset_depn (depn_id, depn_name) 
  SELECT 2, 'Diminishing Value (fin. period)'
  WHERE NOT EXISTS (SELECT 1 FROM asset.asset_depn WHERE depn_id = 2);

INSERT INTO asset.asset_depn (depn_id, depn_name) 
  SELECT 3, 'Straight Line (annual)'
  WHERE NOT EXISTS (SELECT 1 FROM asset.asset_depn WHERE depn_id = 3);

INSERT INTO asset.asset_depn (depn_id, depn_name) 
  SELECT 4, 'Diminishing Value (annual)'
  WHERE NOT EXISTS (SELECT 1 FROM asset.asset_depn WHERE depn_id = 4);

SELECT setval('asset.asset_depn_depn_id_seq', (SELECT max(depn_id) +1 FROM asset.asset_depn), true);

