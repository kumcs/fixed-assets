-- Fixed Asset Hierarchy functions
-- Multi-level hierarchy display
-- Copyright (c) 2013 Pentuple Consulting Ltd. (New Zealand) dave@pentuple.co.nz
-- All Rights Reserved.

-- NOTE:  These functions must be run in this order hence the single file
CREATE OR REPLACE FUNCTION asset.hierarchy_parent(asset integer)
  RETURNS integer AS
$BODY$
DECLARE
   tmpid integer;
   parentid integer := 99;

BEGIN

--  Determine the Top level parent id for sorting purposes
	tmpid = asset;
	
	WHILE parentid != 0
	LOOP
	  SELECT id,COALESCE(asset_parentid, 0) 
	  INTO tmpid, parentid
	  FROM asset.asset
	  WHERE id=tmpid;

	  IF parentid != 0 THEN
	    tmpid = parentid;
	  END IF;  
	END LOOP;

	return tmpid;
    
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION asset.hierarchy_parent(integer)
  OWNER TO xtrole;

CREATE OR REPLACE VIEW asset.t_hierarchy AS 
 SELECT asset.hierarchy_parent(asset.id) AS toplevel, asset.id, asset.id AS assetid, COALESCE(asset.asset_parentid, 0) AS parent, asset.asset_code AS value
   FROM asset.asset
  ORDER BY asset.hierarchy_parent(asset.id), COALESCE(asset.asset_parentid, 0), asset.id;

ALTER TABLE asset.t_hierarchy
  OWNER TO xtrole;
GRANT ALL ON TABLE asset.t_hierarchy TO xtrole;

DROP TYPE IF EXISTS asset.tp_hierarchy CASCADE;

CREATE TYPE asset.tp_hierarchy AS
   (node asset.t_hierarchy,
    level integer);
ALTER TYPE asset.tp_hierarchy
  OWNER TO xtrole;

CREATE OR REPLACE FUNCTION asset.fn_hierarchy_connect_by(integer, integer)
  RETURNS SETOF asset.tp_hierarchy AS
$BODY$
        SELECT  CASE
                WHEN node = 1 THEN
                        (t_hierarchy, $2)::asset.tp_hierarchy
                ELSE
                        asset.fn_hierarchy_connect_by((q.t_hierarchy).id, $2 + 1)
                END
        FROM    (
                SELECT  t_hierarchy, node
                FROM    (
                        SELECT  1 AS node
                        UNION ALL
                        SELECT  2
                        ) nodes,
                        asset.t_hierarchy
                WHERE   parent = $1
                ORDER BY
                        id, node
                ) q;
$BODY$
  LANGUAGE sql VOLATILE
  COST 100
  ROWS 1000;
ALTER FUNCTION asset.fn_hierarchy_connect_by(integer, integer)
  OWNER TO xtrole;


