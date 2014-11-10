CREATE FUNCTION asset.createtbl_asset() RETURNS INTEGER AS $$
DECLARE
  _statement TEXT := '';
  _version   TEXT := '';
BEGIN

-- Check existance of table
  IF (EXISTS(SELECT relname
               FROM pg_class, pg_namespace
              WHERE relname='asset_disp'
                AND relnamespace=pg_namespace.oid
                AND nspname='asset')) THEN

  -- Amend Table
     SELECT pkghead_version INTO _version
       FROM pkghead
       WHERE  pkghead_name = 'asset_disp';
     IF (_version = '1.0.2') THEN             
         _statement = '';
     ELSE
      -- Do nothing
     END IF;     
  ELSE
  -- Create New table
    _statement ='CREATE TABLE asset.asset_disp (
    		    disp_id SERIAL NOT NULL,
		    disp_code text,
		    disp_descr text,
		    disp_system boolean,
		CONSTRAINT pk_asset_disp PRIMARY KEY (disp_id),
		CONSTRAINT un_asset_disp UNIQUE (disp_code));';

   END IF;

  EXECUTE _statement;

  RETURN 0;
END;
$$ LANGUAGE 'plpgsql';

SELECT asset.createtbl_asset();
DROP FUNCTION asset.createtbl_asset();

REVOKE ALL ON TABLE asset.asset_disp_disp_id_seq FROM PUBLIC;
REVOKE ALL ON TABLE asset.asset_disp FROM PUBLIC;
COMMENT ON TABLE asset.asset_disp IS 'Asset Disposition List';

GRANT ALL ON TABLE asset.asset_disp_disp_id_seq TO xtrole;
GRANT ALL ON TABLE asset.asset_disp_disp_id_seq TO admin;

ALTER TABLE asset.asset_disp OWNER TO admin;
GRANT ALL ON TABLE asset.asset_disp TO admin;
GRANT ALL ON TABLE asset.asset_disp TO xtrole;

