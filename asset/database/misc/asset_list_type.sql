DROP TYPE IF EXISTS asset.asset_list CASCADE;

CREATE TYPE asset.asset_list AS
   (id 	integer,
    seq	integer,
    asset_code text,
    asset_name text,
    asset_type text,
    xtindentrole integer
    );
ALTER TYPE asset.asset_list
  OWNER TO admin;
