CREATE OR REPLACE FUNCTION asset.createtbl_asset() RETURNS INTEGER AS $$
DECLARE
  _statement TEXT := '';
BEGIN

-- Check existance of table
  IF (EXISTS(SELECT relname
               FROM pg_class, pg_namespace
              WHERE relname='asset'
                AND relnamespace=pg_namespace.oid
                AND nspname='asset')) THEN

  -- Amend Table
     IF (SELECT pkghead_version = '1.1'
            FROM pkghead
            WHERE  pkghead_name = 'asset') THEN        
         _statement = 'ALTER TABLE asset.asset ADD COLUMN asset_parentid integer, 
		       ADD CONSTRAINT fk_asset_parentid FOREIGN KEY (asset_parentid)
		          REFERENCES asset.asset (id) MATCH SIMPLE
		          ON UPDATE NO ACTION ON DELETE NO ACTION;';
     END IF;     
  ELSE
  -- Create New table
    _statement = 'CREATE TABLE asset.asset (
    		    id serial NOT NULL,
		    asset_code text NOT NULL,
		    asset_name text NOT NULL,
		    asset_type integer NOT NULL,
		    asset_vendor integer,
		    asset_purch_date date,
		    asset_purch_price numeric(16,2),
		    asset_install_date date,
		    asset_life integer,
		    asset_residual_value numeric(16,2) DEFAULT 0,
		    asset_warranty_mth integer,
		    asset_retire_date date,
		    asset_address integer,
		    asset_comments text,
		    asset_status integer,
		    asset_brand text,
		    asset_model text,
		    asset_serial text,
		    asset_barcode text,
		    asset_purch_place text,
		    asset_warranty_exp date,
		    asset_last_service date,
		    asset_warranty boolean,
		    asset_disposition integer,
		    asset_retired boolean DEFAULT false,
		    asset_depreciated boolean DEFAULT false,
		    asset_bookvalue numeric(10,2),
		    asset_parentid integer,
		  CONSTRAINT pk_asset PRIMARY KEY (id),
		  CONSTRAINT fk_asset_parentid FOREIGN KEY (asset_parentid)
		      REFERENCES asset.asset (id) MATCH SIMPLE
		      ON UPDATE NO ACTION ON DELETE NO ACTION,
		  CONSTRAINT fk_asset_type FOREIGN KEY (asset_type)
		      REFERENCES asset.asset_type (id) MATCH SIMPLE
		      ON UPDATE NO ACTION ON DELETE NO ACTION,
		  CONSTRAINT un_asset_code UNIQUE (asset_code));';
  END IF;

  EXECUTE _statement;

  RETURN 0;
END;
$$ LANGUAGE 'plpgsql';

SELECT asset.createtbl_asset();
DROP FUNCTION asset.createtbl_asset();

REVOKE ALL ON TABLE asset.asset_id_seq FROM PUBLIC;
GRANT ALL ON TABLE asset.asset_id_seq TO GROUP xtrole;
GRANT ALL ON TABLE asset.asset_id_seq TO admin;
GRANT ALL ON TABLE asset.asset_id_seq TO PUBLIC;

REVOKE ALL ON TABLE asset.asset FROM PUBLIC;
ALTER TABLE asset.asset OWNER TO admin;
GRANT ALL ON TABLE asset.asset TO admin;
GRANT ALL ON TABLE asset.asset TO GROUP xtrole;

