TRUNCATE TABLE asset.asset_status;
INSERT INTO asset.asset_status (assetstatus_id, assetstatus_code, assetstatus_order) VALUES (1, 'Purchased', 1);
INSERT INTO asset.asset_status (assetstatus_id, assetstatus_code, assetstatus_order) VALUES (2, 'Awaiting Installation', 2);
INSERT INTO asset.asset_status (assetstatus_id, assetstatus_code, assetstatus_order) VALUES (3, 'Active', 3);
INSERT INTO asset.asset_status (assetstatus_id, assetstatus_code, assetstatus_order) VALUES (4, 'At Maintenance', 4);
INSERT INTO asset.asset_status (assetstatus_id, assetstatus_code, assetstatus_order) VALUES (5, 'Retired', 9);

SELECT setval('asset.asset_status_assetstatus_id_seq', 6, true);

