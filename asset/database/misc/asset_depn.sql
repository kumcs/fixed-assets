TRUNCATE TABLE asset.asset_depn;
INSERT INTO asset.asset_depn (depn_id, depn_name) VALUES (0, 'No Depreciation');
INSERT INTO asset.asset_depn (depn_id, depn_name) VALUES (1, 'Straight Line (monthly)');
INSERT INTO asset.asset_depn (depn_id, depn_name) VALUES (2, 'Diminishing Value (monthly)');
INSERT INTO asset.asset_depn (depn_id, depn_name) VALUES (3, 'Straight Line (annual)');
INSERT INTO asset.asset_depn (depn_id, depn_name) VALUES (4, 'Diminishing Value (annual)');

SELECT setval('asset.asset_depn_depn_id_seq', 5, true);

