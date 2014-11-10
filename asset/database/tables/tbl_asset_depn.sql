CREATE FUNCTION asset.createtbl_asset() RETURNS INTEGER AS $$
DECLARE
  _statement TEXT := '';
  _version   TEXT := '';
BEGIN

-- Check existance of table
  IF (EXISTS(SELECT relname
               FROM pg_class, pg_namespace
              WHERE relname='asset_depn'
                AND relnamespace=pg_namespace.oid
                AND nspname='asset')) THEN

  -- Amend Table
     SELECT pkghead_version INTO _version
       FROM pkghead
       WHERE  pkghead_name = 'asset';
     IF (_version <= '1.0.2') THEN             
         _statement = '';
     ELSE
      -- Do nothing
     END IF;     
  ELSE
  -- Create New table
     _statement ='CREATE TABLE asset.asset_depn (
		    depn_id SERIAL NOT NULL,
		    depn_name text,
		  CONSTRAINT pk_asset_depn PRIMARY KEY (depn_id),
		  CONSTRAINT un_asset_depn UNIQUE (depn_name));';

   END IF;

  EXECUTE _statement;

  RETURN 0;
END;
$$ LANGUAGE 'plpgsql';

SELECT asset.createtbl_asset();
DROP FUNCTION asset.createtbl_asset();

REVOKE ALL ON TABLE asset.asset_depn_depn_id_seq FROM PUBLIC;
REVOKE ALL ON TABLE asset.asset_depn FROM PUBLIC;
GRANT ALL ON TABLE asset.asset_depn_depn_id_seq TO xtrole;
GRANT ALL ON TABLE asset.asset_depn_depn_id_seq TO admin;
ALTER TABLE asset.asset_depn OWNER TO admin;
GRANT ALL ON TABLE asset.asset_depn TO admin;
GRANT ALL ON TABLE asset.asset_depn TO xtrole;

