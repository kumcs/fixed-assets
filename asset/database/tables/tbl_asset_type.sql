CREATE FUNCTION asset.createtbl_asset() RETURNS INTEGER AS $$
DECLARE
  _statement TEXT := '';
  _version   TEXT := '';
BEGIN

-- Check existance of table
  IF (EXISTS(SELECT relname
               FROM pg_class, pg_namespace
              WHERE relname='asset_type'
                AND relnamespace=pg_namespace.oid
                AND nspname='asset')) THEN

  -- Amend Table
     SELECT pkghead_version INTO _version
       FROM pkghead
       WHERE  pkghead_name = 'asset';
     IF (_version = '1.0.2') THEN             
         _statement = '';
     ELSE
      -- Do nothing
     END IF;     
  ELSE
  -- Create New table
    _statement ='CREATE TABLE asset.asset_type (
		    id serial NOT NULL,
		    assettype_code text,
		    assettype_name text,
		    assettype_depn integer,
		    assettype_gl1 integer,
		    assettype_gl2 integer,
		    assettype_gl3 integer,
		    assettype_gl4 integer,
		    assettype_gl5 integer,
		    assettype_depnperc numeric(6,2),
		CONSTRAINT pk_assettype PRIMARY KEY (id),
		CONSTRAINT un_asset_type UNIQUE (assettype_code));';

   END IF;

  EXECUTE _statement;

  RETURN 0;
END;
$$ LANGUAGE 'plpgsql';

SELECT asset.createtbl_asset();
DROP FUNCTION asset.createtbl_asset();

REVOKE ALL ON TABLE asset.asset_type_id_seq FROM PUBLIC;
REVOKE ALL ON TABLE asset.asset_type FROM PUBLIC;

GRANT ALL ON TABLE asset.asset_type_id_seq TO xtrole;
GRANT ALL ON TABLE asset.asset_type_id_seq TO admin;
GRANT ALL ON TABLE asset.asset_type_id_seq TO PUBLIC;

ALTER TABLE asset.asset_type OWNER TO admin;
GRANT ALL ON TABLE asset.asset_type TO admin;
GRANT ALL ON TABLE asset.asset_type TO xtrole;

