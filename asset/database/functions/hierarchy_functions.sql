-- Fixed Asset Hierarchy functions
-- Multi-level hierarchy display
-- Copyright (c) 2013 Pentuple Consulting Ltd. (New Zealand)
--
-- Copyright (c) 1999-2018 by OpenMFG LLC, d/b/a xTuple. 
-- See www.xtuple.com/EULA for the full text of the software license.

-- NOTE:  These functions have been deprecated by a recursive PostgreSQL query
DROP VIEW IF EXISTS asset.t_hierarchy CASCADE;
DROP TYPE IF EXISTS asset.tp_hierarchy CASCADE;
DROP TYPE IF EXISTS asset.asset_list;
DROP FUNCTION IF EXISTS asset.hierarchy_parent(integer);
DROP FUNCTION IF EXISTS asset.fn_hierarchy_connect_by(integer, integer);

